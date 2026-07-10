import conversationRepository from '../repositories/conversation.repository';
import { IConversation } from '../types/chat.types';
import ApiError from '../utils/apiError';
import userRepository from '../repositories/user.repository';

class ChatService {
  async getOrCreateConversation(
    userId: string,
    participantId: string
  ): Promise<IConversation> {
    if (userId === participantId) {
      throw ApiError.badRequest('Cannot create conversation with yourself');
    }

    const participant = await userRepository.findById(participantId);
    if (!participant) {
      throw ApiError.notFound('Participant not found');
    }

    // Check if conversation already exists
    const existing = await conversationRepository.findByParticipants(
      userId,
      participantId
    );
    if (existing) {
      return existing;
    }

    return conversationRepository.create([userId, participantId]);
  }

  async getUserConversations(userId: string): Promise<IConversation[]> {
    return conversationRepository.getUserConversations(userId);
  }

  async getConversationById(
    conversationId: string,
    userId: string
  ): Promise<IConversation> {
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

    return conversation;
  }

  async deleteConversation(
    conversationId: string,
    userId: string
  ): Promise<void> {
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

    await conversationRepository.deleteConversation(conversationId);
  }

  async searchConversations(
    userId: string,
    query: string
  ): Promise<IConversation[]> {
    if (!query || query.trim().length < 1) {
      return [];
    }
    return conversationRepository.searchConversations(userId, query.trim());
  }

  async resetUnreadCount(
    conversationId: string,
    userId: string
  ): Promise<IConversation | null> {
    return conversationRepository.resetUnreadCount(conversationId, userId);
  }
}

export default new ChatService();
