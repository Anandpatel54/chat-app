'use client';

import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { ChatListItem } from './ChatListItem';
import { SkeletonLoader } from '../shared/SkeletonLoader';
import { EmptyState } from '../shared/EmptyState';
import { useRouter } from 'next/navigation';

export function ChatList() {
  const { conversations, activeConversation, selectConversation, isLoading } = useChat();
  const { user } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <SkeletonLoader type="chat-list" count={5} />;
  }

  if (conversations.length === 0) {
    return (
      <EmptyState
        type="chat"
        title="No chats yet"
        description="Search for users above to start a conversation."
      />
    );
  }

  const handleSelect = (conv: any) => {
    selectConversation(conv);
    router.push(`/chat/${conv._id}`);
  };

  return (
    <div className="flex flex-col w-full">
      {conversations.map((conversation) => (
        <ChatListItem
          key={conversation._id}
          conversation={conversation}
          isActive={activeConversation?._id === conversation._id}
          currentUserId={user?._id || ''}
          onClick={() => handleSelect(conversation)}
        />
      ))}
    </div>
  );
}
