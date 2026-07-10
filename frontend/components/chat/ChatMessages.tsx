'use client';

import { useEffect, useRef } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/hooks/useSocket';
import { MessageBubble } from './MessageBubble';
import { DateSeparator } from './DateSeparator';
import { InfiniteScroll } from '../shared/InfiniteScroll';
import { SkeletonLoader } from '../shared/SkeletonLoader';
import { EmptyState } from '../shared/EmptyState';
import { getOtherParticipant } from '@/utils/helpers';
import { SOCKET_EVENTS } from '@/constants/socketEvents';
import { format } from 'date-fns';

interface ChatMessagesProps {
  conversationId: string;
  participants: any[];
}

export function ChatMessages({ conversationId, participants }: ChatMessagesProps) {
  const { messages, hasMore, isLoading, fetchMessages, loadMoreMessages, setReply } = useMessages(conversationId);
  const { user: currentUser } = useAuth();
  const { socket } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch initial messages on mount / conv change
  useEffect(() => {
    fetchMessages();
  }, [conversationId, fetchMessages]);

  const otherParticipant = getOtherParticipant(participants, currentUser?._id || '');

  // Scroll to bottom when a new message arrives
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  // Mark all incoming messages in this conversation as seen
  useEffect(() => {
    if (!socket || !currentUser || messages.length === 0) return;

    const unreadMessages = messages.filter(
      (m) => m.sender._id !== currentUser._id && !m.readBy.includes(currentUser._id)
    );

    if (unreadMessages.length > 0) {
      unreadMessages.forEach((msg) => {
        socket.emit(SOCKET_EVENTS.MESSAGE_SEEN, {
          messageId: msg._id,
          conversationId,
        });
      });
    }
  }, [messages, currentUser, conversationId, socket]);

  if (isLoading && messages.length === 0) {
    return <SkeletonLoader type="message" count={4} />;
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col justify-center">
        <EmptyState
          type="messages"
          title="No messages yet"
          description="Send a message to start the conversation!"
        />
      </div>
    );
  }

  // Group messages by date
  const renderGroupedMessages = () => {
    const grouped: React.ReactNode[] = [];
    let lastDate = '';

    messages.forEach((msg, index) => {
      const msgDate = format(new Date(msg.createdAt), 'yyyy-MM-dd');

      if (msgDate !== lastDate) {
        grouped.push(
          <DateSeparator key={`sep-${msg._id}`} date={msg.createdAt} />
        );
        lastDate = msgDate;
      }

      grouped.push(
        <MessageBubble
          key={msg._id}
          message={msg}
          isOwn={msg.sender._id === currentUser?._id}
          otherParticipantId={otherParticipant?._id || ''}
          onReplyClick={(replyMsg) => {
            // Find replied message if needed or show feedback
          }}
        />
      );
    });

    return grouped;
  };

  return (
    <InfiniteScroll
      onLoadMore={loadMoreMessages}
      hasMore={hasMore}
      isLoading={isLoading}
      reverse={true}
      className="flex-1 p-4 bg-muted/5 flex flex-col"
    >
      <div className="flex-1" />
      {renderGroupedMessages()}
      <div ref={messagesEndRef} />
    </InfiniteScroll>
  );
}
