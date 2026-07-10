'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { UserAvatar } from '../user/UserAvatar';
import { UserSearch } from '../user/UserSearch';
import { ChatList } from '../chat/ChatList';
import { Button, buttonVariants } from '@/components/ui/button';
import { LogOut, Settings, User, MessageSquarePlus, Bell } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IUser } from '@/types';
import toast from 'react-hot-toast';
import { cn } from '@/utils/cn';

export function Sidebar() {
  const { user, logout } = useAuth();
  const { conversations, fetchConversations, createNewConversation, activeConversation, selectConversation } = useChat();
  const [showSearch, setShowSearch] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleSelectSearchedUser = async (searchedUser: IUser) => {
    try {
      const conv = await createNewConversation(searchedUser._id);
      setShowSearch(false);
      router.push(`/chat/${conv._id}`);
      toast.success(`Chat started with ${searchedUser.name}`);
    } catch {
      toast.error('Failed to start conversation');
    }
  };

  return (
    <aside id="sidebar" className="w-full md:w-80 h-full flex flex-col bg-card border-r border-border/40 shrink-0">
      {/* Header with User Info & Controls */}
      <div className="p-4 flex items-center justify-between border-b border-border/40">
        <Link href="/profile" className="flex items-center gap-3 group">
          <UserAvatar
            src={user?.profileImage || ''}
            name={user?.name || 'User'}
            size="md"
            isOnline={true}
          />
          <div className="flex flex-col text-left max-w-[120px]">
            <span className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
              {user?.name}
            </span>
            <span className="text-[10px] text-muted-foreground truncate">
              {user?.email}
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSearch(!showSearch)}
            className="w-8 h-8 rounded-full"
            title="Start new conversation"
          >
            <MessageSquarePlus className="w-4 h-4" />
          </Button>
          <Link
            href="/settings"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'icon' }),
              "w-8 h-8 rounded-full inline-flex items-center justify-center"
            )}
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="w-8 h-8 rounded-full text-destructive hover:bg-destructive/10"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* User Search Panel */}
      <div className="p-3">
        {showSearch ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Find User
              </span>
              <button
                onClick={() => setShowSearch(false)}
                className="text-xs text-primary hover:underline"
              >
                Cancel
              </button>
            </div>
            <UserSearch onSelectUser={handleSelectSearchedUser} />
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full justify-start text-muted-foreground bg-muted/30 border-none hover:bg-muted/50 h-9 px-3 rounded-lg text-xs"
            onClick={() => setShowSearch(true)}
          >
            Search or start a new chat...
          </Button>
        )}
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Chats
        </div>
        <ChatList />
      </div>
    </aside>
  );
}
