'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ChatLayout } from '@/components/layout/ChatLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import Link from 'next/link';
import { Bell, ChevronRight, Palette } from 'lucide-react';

export default function SettingsPage() {
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
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">Settings</h2>
          <div className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md shadow-md divide-y divide-border/40">
            {/* Theme settings row */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Palette className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">Toggle application theme colors</p>
                </div>
              </div>
              <ThemeToggle />
            </div>

            {/* Notification settings link */}
            <Link
              href="/settings/notifications"
              className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Notifications</p>
                  <p className="text-xs text-muted-foreground">Manage push notifications & alerts</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </main>
    </ChatLayout>
  );
}
