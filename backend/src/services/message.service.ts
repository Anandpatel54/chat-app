import messageRepository from '../repositories/message.repository';
import conversationRepository from '../repositories/conversation.repository';
import { IMessage, ISendMessage } from '../types/message.types';
import ApiError from '../utils/apiError';
import { truncateMessage } from '../utils/helpers';

class MessageService {
  async sendMessage(data: ISendMessage, senderId: string): Promise<IMessage> {
    // Verify conversation exists
    const conversation = await conversationRepository.findById(data.conversationId);
    if (!conversation) {
      throw ApiError.notFound('Conversation not found');
    }

    const isParticipant = conversation.participants.some(
      (p: any) => p._id.toString() === senderId || p.toString() === senderId
    );
    if (!isParticipant) {
      throw ApiError.forbidden('Not a participant in this conversation');
    }

    const message = await messageRepository.create({
      ...data,
      sender: senderId,
    });

    // Update conversation last message
    const preview =
      data.messageType === 'text'
        ? truncateMessage(data.content)
        : data.messageType === 'image'
        ? '📷 Photo'
        : '📎 File';

    await conversationRepository.updateLastMessage(
      data.conversationId,
      preview,
      senderId
    );

    return message;
  }

  async getMessages(
    conversationId: string,
    userId: string,
    page: number,
    limit: number
  ): Promise<{ messages: IMessage[]; total: number; hasMore: boolean }> {
    const conversation = await conversationRepository.findById(conversationId);
    if (!conversation) {
      throw ApiError.notFound('Conversation not found');
    }

    const isParticipant = conversation.participants.some(
      (p: any) => p._id.toString() === userId || p.toString() === userId
    );
    if (!isParticipant) {
      throw ApiError.forbidden('Not a participant in this conversation');
    }

    const { messages, total } = await messageRepository.getConversationMessages(
      conversationId,
      userId,
      page,
      limit
    );

    return {
      messages,
      total,
      hasMore: page * limit < total,
    };
  }

  async markAsRead(messageId: string, userId: string): Promise<IMessage> {
    const message = await messageRepository.markAsRead(messageId, userId);
    if (!message) {
      throw ApiError.notFound('Message not found');
    }
    return message;
  }

  async markConversationAsRead(
    conversationId: string,
    userId: string
  ): Promise<void> {
    await messageRepository.markConversationAsRead(conversationId, userId);
    await conversationRepository.resetUnreadCount(conversationId, userId);
  }

  async markAsDelivered(messageId: string, userId: string): Promise<IMessage> {
    const message = await messageRepository.markAsDelivered(messageId, userId);
    if (!message) {
      throw ApiError.notFound('Message not found');
    }
    return message;
  }

  async deleteForMe(messageId: string, userId: string): Promise<IMessage> {
    const message = await messageRepository.findById(messageId);
    if (!message) {
      throw ApiError.notFound('Message not found');
    }

    const updated = await messageRepository.deleteForMe(messageId, userId);
    if (!updated) {
      throw ApiError.internal('Failed to delete message');
    }
    return updated;
  }

  async deleteForEveryone(
    messageId: string,
    userId: string
  ): Promise<IMessage> {
    const message = await messageRepository.findById(messageId);
    if (!message) {
      throw ApiError.notFound('Message not found');
    }

    if (message.sender.toString() !== userId && 
        (message.sender as any)?._id?.toString() !== userId) {
      throw ApiError.forbidden('Can only delete your own messages for everyone');
    }

    const updated = await messageRepository.deleteForEveryone(messageId);
    if (!updated) {
      throw ApiError.internal('Failed to delete message');
    }
    return updated;
  }

  async forwardMessage(
    messageId: string,
    conversationIds: string[],
    senderId: string
  ): Promise<IMessage[]> {
    const forwardedMessages: IMessage[] = [];

    for (const conversationId of conversationIds) {
      const conversation = await conversationRepository.findById(conversationId);
      if (!conversation) continue;

      const isParticipant = conversation.participants.some(
        (p: any) => p._id.toString() === senderId || p.toString() === senderId
      );
      if (!isParticipant) continue;

      const forwarded = await messageRepository.forwardMessage(
        messageId,
        conversationId,
        senderId
      );

      await conversationRepository.updateLastMessage(
        conversationId,
        truncateMessage(forwarded.content),
        senderId
      );

      forwardedMessages.push(forwarded);
    }

    return forwardedMessages;
  }

  async searchMessages(
    conversationId: string,
    query: string,
    userId: string
  ): Promise<IMessage[]> {
    return messageRepository.searchMessages(conversationId, query, userId);
  }
}

export default new MessageService();
