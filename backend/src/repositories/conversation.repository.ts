import Conversation from '../models/conversation.model';
import { IConversation } from '../types/chat.types';
import { Types } from 'mongoose';

class ConversationRepository {
  async findById(id: string): Promise<IConversation | null> {
    return Conversation.findById(id).populate(
      'participants',
      'name email profileImage isOnline lastSeen about'
    );
  }

  async findByParticipants(
    userId: string,
    participantId: string
  ): Promise<IConversation | null> {
    return Conversation.findOne({
      isGroup: false,
      participants: {
        $all: [
          new Types.ObjectId(userId),
          new Types.ObjectId(participantId),
        ],
      },
    }).populate('participants', 'name email profileImage isOnline lastSeen about');
  }

  async create(participants: string[]): Promise<IConversation> {
    const conversation = await Conversation.create({
      participants: participants.map((id) => new Types.ObjectId(id)),
      unreadCounts: new Map(participants.map((id) => [id, 0])),
    });

    return conversation.populate(
      'participants',
      'name email profileImage isOnline lastSeen about'
    );
  }

  async getUserConversations(userId: string): Promise<IConversation[]> {
    return Conversation.find({
      participants: new Types.ObjectId(userId),
    })
      .populate('participants', 'name email profileImage isOnline lastSeen about')
      .sort({ lastMessageTime: -1 });
  }

  async updateLastMessage(
    conversationId: string,
    message: string,
    senderId: string
  ): Promise<IConversation | null> {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return null;

    conversation.lastMessage = message;
    conversation.lastMessageTime = new Date();

    // Increment unread count for all participants except sender
    const unreadCounts = conversation.unreadCounts || new Map();
    conversation.participants.forEach((participantId) => {
      const pid = participantId.toString();
      if (pid !== senderId) {
        unreadCounts.set(pid, (unreadCounts.get(pid) || 0) + 1);
      }
    });
    conversation.unreadCounts = unreadCounts;

    await conversation.save();
    return conversation.populate(
      'participants',
      'name email profileImage isOnline lastSeen about'
    );
  }

  async resetUnreadCount(
    conversationId: string,
    userId: string
  ): Promise<IConversation | null> {
    return Conversation.findByIdAndUpdate(
      conversationId,
      { $set: { [`unreadCounts.${userId}`]: 0 } },
      { new: true }
    ).populate('participants', 'name email profileImage isOnline lastSeen about');
  }

  async deleteConversation(conversationId: string): Promise<IConversation | null> {
    return Conversation.findByIdAndDelete(conversationId);
  }

  async searchConversations(
    userId: string,
    query: string
  ): Promise<IConversation[]> {
    const conversations = await Conversation.find({
      participants: new Types.ObjectId(userId),
    })
      .populate('participants', 'name email profileImage isOnline lastSeen about')
      .sort({ lastMessageTime: -1 });

    // Filter by participant name or last message
    return conversations.filter((conv) => {
      const otherParticipants = (conv as any).participants.filter(
        (p: any) => p._id.toString() !== userId
      );
      return (
        otherParticipants.some(
          (p: any) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.email.toLowerCase().includes(query.toLowerCase())
        ) || conv.lastMessage.toLowerCase().includes(query.toLowerCase())
      );
    });
  }
}

export default new ConversationRepository();
