'use client';

import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { useAppSelector } from '@/redux/hooks';
import { UserAvatar } from '../user/UserAvatar';
import { UserStatus } from '../user/UserStatus';
import { Button, buttonVariants } from '@/components/ui/button';
import { ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';
import { getOtherParticipant } from '@/utils/helpers';
import Link from 'next/link';
import { cn } from '@/utils/cn';

const EMPTY_TYPING_USERS: { userId: string; userName: string }[] = [];

export function ChatHeader() {
  const { activeConversation } = useChat();
  const { user: currentUser } = useAuth();

  // Typing status from Redux
  const typingUsers = useAppSelector(
    (state) => state.socket.typingUsers[activeConversation?._id || ''] || EMPTY_TYPING_USERS
  );

  if (!activeConversation || !currentUser) return null;

  const otherParticipant = getOtherParticipant(
    activeConversation.participants,
    currentUser._id
  );

  const isTyping = typingUsers.length > 0;

  // Use Redux onlineUsers as source of truth for real-time status
  const onlineUsers = useAppSelector((state) => state.socket.onlineUsers);
  const isOnline = otherParticipant
    ? onlineUsers.includes(otherParticipant._id) || otherParticipant.isOnline
    : false;

  return (
    <div className="h-16 border-b border-border/40 px-4 flex items-center justify-between bg-card">
      <div className="flex items-center gap-3">
        {/* Mobile Back Button */}
        <Link
          href="/home"
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'icon' }),
            "md:hidden w-8 h-8 rounded-full inline-flex items-center justify-center"
          )}
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <UserAvatar
          src={otherParticipant?.profileImage || ''}
          name={otherParticipant?.name || 'User'}
          size="md"
          isOnline={isOnline}
        />

        <div className="flex flex-col text-left">
          <span className="text-sm font-semibold text-foreground">
            {otherParticipant?.name || 'User'}
          </span>
          <UserStatus
            isOnline={isOnline}
            lastSeen={otherParticipant?.lastSeen || ''}
            isTyping={isTyping}
            typingUserName={typingUsers[0]?.userName}
          />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
          <Phone className="w-4 h-4 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
          <Video className="w-4 h-4 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
          <MoreVertical className="w-4 h-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}
