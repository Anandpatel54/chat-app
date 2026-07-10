'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ChatLayout } from '@/components/layout/ChatLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { UserProfile } from '@/components/user/UserProfile';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ChatLayout>
      <Sidebar />
      <main className="flex-1 flex flex-col h-full bg-background border-l border-border/40 overflow-y-auto">
        <div className="max-w-2xl mx-auto w-full py-8 px-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">Profile Settings</h2>
          <div className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md shadow-md">
            <UserProfile user={user} />
          </div>
        </div>
      </main>
    </ChatLayout>
  );
}
