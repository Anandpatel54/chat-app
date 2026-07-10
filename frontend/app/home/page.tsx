'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ChatLayout } from '@/components/layout/ChatLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { EmptyState } from '@/components/shared/EmptyState';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ChatLayout>
      <Sidebar />
      <main className="hidden md:flex flex-1 flex-col justify-center items-center h-full bg-muted/10 border-l border-border/40">
        <EmptyState
          type="chat"
          title="Select a chat to start messaging"
          description="Create conversations or check your settings in the sidebar."
        />
      </main>
    </ChatLayout>
  );
}
