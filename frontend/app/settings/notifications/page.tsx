'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ChatLayout } from '@/components/layout/ChatLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function NotificationSettingsPage() {
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
      <main className="flex-1 flex flex-col h-full bg-background border-l border-border/40 overflow-y-auto">
        <div className="max-w-2xl mx-auto w-full py-8 px-4">
          <Link
            href="/settings"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              "mb-4 gap-1 inline-flex"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Settings
          </Link>

          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">Notification Settings</h2>
          <div className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md shadow-md p-6 space-y-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">Firebase Push Notifications</p>
              <p className="text-xs text-muted-foreground">
                Enable this option to receive instant push alerts whenever a message arrives while you are offline.
              </p>
            </div>
            <div className="pt-2">
              <Button onClick={() => Notification.requestPermission()}>
                Configure Push Alert Permissions
              </Button>
            </div>
          </div>
        </div>
      </main>
    </ChatLayout>
  );
}
