'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  setMessages,
  prependMessages,
  addMessage,
  removeMessage,
  setReplyTo,
  setMessageLoading,
  setMessageError,
} from '@/features/message/messageSlice';
import { messageService } from '@/services/message.service';
import { IMessage } from '@/types';
import { generateTempId } from '@/utils/helpers';

const EMPTY_ARRAY: IMessage[] = [];

export const useMessages = (conversationId: string) => {
  const dispatch = useAppDispatch();
  const messages = useAppSelector(
    (state) => state.message.messages[conversationId] || EMPTY_ARRAY
  );
  const hasMore = useAppSelector(
    (state) => state.message.hasMore[conversationId] ?? true
  );
  const page = useAppSelector(
    (state) => state.message.page[conversationId] || 1
  );
  const isLoading = useAppSelector((state) => state.message.isLoading);
  const replyTo = useAppSelector((state) => state.message.replyTo);

  const fetchMessages = useCallback(async () => {
    try {
      dispatch(setMessageLoading(true));
      const data = await messageService.getMessages(conversationId, 1, 20);
      dispatch(
        setMessages({
          conversationId,
          messages: data.messages,
          hasMore: data.hasMore,
        })
      );
    } catch (err: any) {
      dispatch(setMessageError(err.message));
    }
  }, [conversationId, dispatch]);

  const loadMoreMessages = useCallback(async () => {
    if (!hasMore || isLoading) return;
    try {
      dispatch(setMessageLoading(true));
      const nextPage = page + 1;
      const data = await messageService.getMessages(
        conversationId,
        nextPage,
        20
      );
      dispatch(
        prependMessages({
          conversationId,
          messages: data.messages,
          hasMore: data.hasMore,
        })
      );
    } catch (err: any) {
      dispatch(setMessageError(err.message));
    }
  }, [conversationId, hasMore, isLoading, page, dispatch]);

  const sendMessage = useCallback(
    async (content: string, messageType: 'text' | 'image' | 'file' = 'text', file?: File) => {
      const tempId = generateTempId();

      const formData = new FormData();
      formData.append('conversationId', conversationId);
      formData.append('content', content);
      formData.append('messageType', messageType);
      if (file) formData.append('file', file);
      if (replyTo) formData.append('replyTo', replyTo._id);

      try {
        await messageService.sendMessage(formData);
        dispatch(setReplyTo(null));
      } catch (err: any) {
        dispatch(setMessageError(err.message));
      }
    },
    [conversationId, replyTo, dispatch]
  );

  const deleteMessage = useCallback(
    async (messageId: string, forEveryone: boolean = false) => {
      try {
        if (forEveryone) {
          await messageService.deleteForEveryone(messageId);
        } else {
          await messageService.deleteForMe(messageId);
          dispatch(removeMessage({ conversationId, messageId }));
        }
      } catch (err: any) {
        dispatch(setMessageError(err.message));
      }
    },
    [conversationId, dispatch]
  );

  const forwardMsg = useCallback(
    async (messageId: string, targetConversationIds: string[]) => {
      try {
        await messageService.forwardMessage(messageId, targetConversationIds);
      } catch (err: any) {
        dispatch(setMessageError(err.message));
      }
    },
    [dispatch]
  );

  const setReply = useCallback(
    (message: IMessage | null) => {
      dispatch(setReplyTo(message));
    },
    [dispatch]
  );

  return {
    messages,
    hasMore,
    isLoading,
    replyTo,
    fetchMessages,
    loadMoreMessages,
    sendMessage,
    deleteMessage,
    forwardMsg,
    setReply,
  };
};
