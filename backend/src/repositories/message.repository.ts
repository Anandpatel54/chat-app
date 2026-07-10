import Message from '../models/message.model';
import { IMessage, ISendMessage } from '../types/message.types';
import { Types } from 'mongoose';

class MessageRepository {
  async findById(id: string): Promise<IMessage | null> {
    return Message.findById(id)
      .populate('sender', 'name profileImage')
      .populate({
        path: 'replyTo',
        select: 'content sender',
        populate: { path: 'sender', select: 'name' },
      });
  }

  async getConversationMessages(
    conversationId: string,
    userId: string,
    page: number,
    limit: number
  ): Promise<{ messages: IMessage[]; total: number }> {
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      Message.find({
        conversationId: new Types.ObjectId(conversationId),
        deletedFor: { $ne: new Types.ObjectId(userId) },
      })
        .populate('sender', 'name profileImage')
        .populate({
          path: 'replyTo',
          select: 'content sender messageType',
          populate: { path: 'sender', select: 'name' },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Message.countDocuments({
        conversationId: new Types.ObjectId(conversationId),
        deletedFor: { $ne: new Types.ObjectId(userId) },
      }),
    ]);

    return { messages: messages.reverse(), total };
  }

  async create(messageData: ISendMessage & { sender: string }): Promise<IMessage> {
    const message = await Message.create({
      ...messageData,
      conversationId: new Types.ObjectId(messageData.conversationId),
      sender: new Types.ObjectId(messageData.sender),
      replyTo: messageData.replyTo
        ? new Types.ObjectId(messageData.replyTo)
        : null,
      readBy: [new Types.ObjectId(messageData.sender)],
      deliveredTo: [new Types.ObjectId(messageData.sender)],
    });

    return message.populate([
      { path: 'sender', select: 'name profileImage' },
      {
        path: 'replyTo',
        select: 'content sender messageType',
        populate: { path: 'sender', select: 'name' },
      },
    ]);
  }

  async markAsRead(
    messageId: string,
    userId: string
  ): Promise<IMessage | null> {
    return Message.findByIdAndUpdate(
      messageId,
      { $addToSet: { readBy: new Types.ObjectId(userId) } },
      { new: true }
    );
  }

  async markConversationAsRead(
    conversationId: string,
    userId: string
  ): Promise<void> {
    await Message.updateMany(
      {
        conversationId: new Types.ObjectId(conversationId),
        sender: { $ne: new Types.ObjectId(userId) },
        readBy: { $ne: new Types.ObjectId(userId) },
      },
      { $addToSet: { readBy: new Types.ObjectId(userId) } }
    );
  }

  async markAsDelivered(
    messageId: string,
    userId: string
  ): Promise<IMessage | null> {
    return Message.findByIdAndUpdate(
      messageId,
      { $addToSet: { deliveredTo: new Types.ObjectId(userId) } },
      { new: true }
    );
  }

  async markConversationAsDelivered(
    conversationId: string,
    userId: string
  ): Promise<void> {
    await Message.updateMany(
      {
        conversationId: new Types.ObjectId(conversationId),
        sender: { $ne: new Types.ObjectId(userId) },
        deliveredTo: { $ne: new Types.ObjectId(userId) },
      },
      { $addToSet: { deliveredTo: new Types.ObjectId(userId) } }
    );
  }

  async deleteForMe(messageId: string, userId: string): Promise<IMessage | null> {
    return Message.findByIdAndUpdate(
      messageId,
      { $addToSet: { deletedFor: new Types.ObjectId(userId) } },
      { new: true }
    );
  }

  async deleteForEveryone(messageId: string): Promise<IMessage | null> {
    return Message.findByIdAndUpdate(
      messageId,
      {
        $set: {
          isDeletedForEveryone: true,
          content: 'This message was deleted',
          fileUrl: null,
          fileName: null,
        },
      },
      { new: true }
    );
  }

  async forwardMessage(
    originalMessageId: string,
    conversationId: string,
    senderId: string
  ): Promise<IMessage> {
    const original = await Message.findById(originalMessageId);
    if (!original) throw new Error('Original message not found');

    const forwarded = await Message.create({
      conversationId: new Types.ObjectId(conversationId),
      sender: new Types.ObjectId(senderId),
      content: original.content,
      messageType: original.messageType,
      fileUrl: original.fileUrl,
      fileName: original.fileName,
      forwardedFrom: original._id,
      readBy: [new Types.ObjectId(senderId)],
      deliveredTo: [new Types.ObjectId(senderId)],
    });

    return forwarded.populate([
      { path: 'sender', select: 'name profileImage' },
    ]);
  }

  async searchMessages(
    conversationId: string,
    query: string,
    userId: string
  ): Promise<IMessage[]> {
    return Message.find({
      conversationId: new Types.ObjectId(conversationId),
      content: { $regex: query, $options: 'i' },
      deletedFor: { $ne: new Types.ObjectId(userId) },
      isDeletedForEveryone: false,
    })
      .populate('sender', 'name profileImage')
      .sort({ createdAt: -1 })
      .limit(50);
  }
}

export default new MessageRepository();
