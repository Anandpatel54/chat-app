'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { ChatLayout } from '@/components/layout/ChatLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatMessages } from '@/components/chat/ChatMessages';
import { ChatInput } from '@/components/chat/ChatInput';
import { chatService } from '@/services/chat.service';
import { SkeletonLoader } from '@/components/shared/SkeletonLoader';
import { ErrorState } from '@/components/shared/ErrorState';
import { IConversation } from '@/types';
import toast from 'react-hot-toast';

import { useSocket } from '@/hooks/useSocket';
import { SOCKET_EVENTS } from '@/constants/socketEvents';

interface PageProps {
  params: Promise<{
    conversationId: string;
  }>;
}

export default function ChatRoomPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const conversationId = resolvedParams.conversationId;
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { conversations, activeConversation, selectConversation } = useChat();
  const [loadingConv, setLoadingConv] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { socket } = useSocket();
  const router = useRouter();

  // Route protection
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isAuthLoading, router]);

  // Join socket room when conversation changes
  useEffect(() => {
    if (!socket || !isAuthenticated || loadingConv || error || !activeConversation) return;

    socket.emit(SOCKET_EVENTS.JOIN_ROOM, conversationId);

    return () => {
      socket.emit(SOCKET_EVENTS.LEAVE_ROOM, conversationId);
    };
  }, [socket, conversationId, isAuthenticated, loadingConv, error, activeConversation]);

  // Load conversation details
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadConversation = async () => {
      setLoadingConv(true);
      setError(null);
      try {
        // First check if already in the list
        const existing = conversations.find((c) => c._id === conversationId);
        if (existing) {
          selectConversation(existing);
        } else {
          // Fetch from API
          const fetched = await chatService.getConversationById(conversationId);
          selectConversation(fetched);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load conversation');
        toast.error('Failed to load conversation details');
      } finally {
        setLoadingConv(false);
      }
    };

    loadConversation();
  }, [conversationId, isAuthenticated, conversations, selectConversation]);

  if (isAuthLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const renderContent = () => {
    if (loadingConv) {
      return (
        <div className="flex-1 flex flex-col justify-center">
          <SkeletonLoader type="message" count={3} />
        </div>
      );
    }

    if (error || !activeConversation) {
      return (
        <div className="flex-1 flex flex-col justify-center">
          <ErrorState
            title="Chat not found"
            description={error || 'Could not load conversation details.'}
            onRetry={() => router.push('/home')}
          />
        </div>
      );
    }

    return (
      <>
        <ChatHeader />
        <ChatMessages
          conversationId={activeConversation._id}
          participants={activeConversation.participants}
        />
        <ChatInput conversationId={activeConversation._id} />
      </>
    );
  };

  return (
    <ChatLayout>
      <div className="hidden md:flex h-full">
        <Sidebar />
      </div>
      <main className="flex-1 flex flex-col h-full bg-background border-l border-border/40 overflow-hidden">
        {renderContent()}
      </main>
    </ChatLayout>
  );
}
