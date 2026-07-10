'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  setConversations,
  setActiveConversation,
  addConversation,
  removeConversation,
  setChatLoading,
  setChatError,
  setSearchQuery,
  setSearchResults,
} from '@/features/chat/chatSlice';
import { chatService } from '@/services/chat.service';
import { IConversation } from '@/types';

export const useChat = () => {
  const dispatch = useAppDispatch();
  const { conversations, activeConversation, isLoading, searchQuery, searchResults } =
    useAppSelector((state) => state.chat);

  const fetchConversations = useCallback(async () => {
    try {
      dispatch(setChatLoading(true));
      const data = await chatService.getConversations();
      dispatch(setConversations(data));
    } catch (err: any) {
      dispatch(setChatError(err.message));
    }
  }, [dispatch]);

  const selectConversation = useCallback(
    (conversation: IConversation | null) => {
      dispatch(setActiveConversation(conversation));
    },
    [dispatch]
  );

  const createNewConversation = useCallback(
    async (participantId: string): Promise<IConversation> => {
      const conversation = await chatService.createConversation(participantId);
      dispatch(addConversation(conversation));
      dispatch(setActiveConversation(conversation));
      return conversation;
    },
    [dispatch]
  );

  const deleteChat = useCallback(
    async (conversationId: string) => {
      try {
        await chatService.deleteConversation(conversationId);
        dispatch(removeConversation(conversationId));
      } catch (err: any) {
        dispatch(setChatError(err.message));
      }
    },
    [dispatch]
  );

  const searchChats = useCallback(
    async (query: string) => {
      dispatch(setSearchQuery(query));
      if (!query.trim()) {
        dispatch(setSearchResults([]));
        return;
      }
      try {
        const results = await chatService.searchConversations(query);
        dispatch(setSearchResults(results));
      } catch {
        dispatch(setSearchResults([]));
      }
    },
    [dispatch]
  );

  return {
    conversations,
    activeConversation,
    isLoading,
    searchQuery,
    searchResults,
    fetchConversations,
    selectConversation,
    createNewConversation,
    deleteChat,
    searchChats,
  };
};
