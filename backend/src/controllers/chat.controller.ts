import { Response } from 'express';
import chatService from '../services/chat.service';
import asyncHandler from '../utils/asyncHandler';
import ApiResponse from '../utils/apiResponse';
import { AuthRequest } from '../types';

export const getConversations = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const conversations = await chatService.getUserConversations(
      req.user!._id.toString()
    );
    res.json(ApiResponse.success(conversations, 'Conversations fetched'));
  }
);

export const createConversation = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { participantId } = req.body;
    const conversation = await chatService.getOrCreateConversation(
      req.user!._id.toString(),
      participantId
    );
    res.status(201).json(
      ApiResponse.created(conversation, 'Conversation created')
    );
  }
);

export const getConversationById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const conversation = await chatService.getConversationById(
      id,
      req.user!._id.toString()
    );
    res.json(ApiResponse.success(conversation, 'Conversation fetched'));
  }
);

export const deleteConversation = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    await chatService.deleteConversation(
      id,
      req.user!._id.toString()
    );
    res.json(ApiResponse.noContent('Conversation deleted'));
  }
);

export const searchConversations = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { q } = req.query as { q: string };
    const conversations = await chatService.searchConversations(
      req.user!._id.toString(),
      q
    );
    res.json(ApiResponse.success(conversations, 'Conversations found'));
  }
);
