'use client';

import { IConversation } from '@/types';
import { UserAvatar } from '../user/UserAvatar';
import { getOtherParticipant, truncateText } from '@/utils/helpers';
import { formatChatListTime } from '@/utils/formatDate';
import { cn } from '@/utils/cn';
import { Badge } from '@/components/ui/badge';
import { useAppSelector } from '@/redux/hooks';

interface ChatListItemProps {
  conversation: IConversation;
  isActive: boolean;
  currentUserId: string;
  onClick: () => void;
}

export function ChatListItem({
  conversation,
  isActive,
  currentUserId,
  onClick,
}: ChatListItemProps) {
  const otherParticipant = getOtherParticipant(
    conversation.participants,
    currentUserId
  );

  const onlineUsers = useAppSelector((state) => state.socket.onlineUsers);
  const isOnline = otherParticipant
    ? onlineUsers.includes(otherParticipant._id) || otherParticipant.isOnline
    : false;

  const unreadCount = conversation.unreadCounts?.[currentUserId] || 0;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 p-3 transition-colors text-left relative outline-none border-b border-border/10',
        isActive
          ? 'bg-primary/10 hover:bg-primary/15'
          : 'hover:bg-muted/40'
      )}
    >
      {/* Active Indicator Bar */}
      {isActive && (
        <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-r" />
      )}

      <UserAvatar
        src={otherParticipant?.profileImage || ''}
        name={otherParticipant?.name || 'User'}
        size="md"
        isOnline={isOnline}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <p className="text-sm font-semibold truncate text-foreground">
            {otherParticipant?.name || 'User'}
          </p>
          {conversation.lastMessageTime && (
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
              {formatChatListTime(conversation.lastMessageTime)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-1">
          <p
            className={cn(
              'text-xs truncate max-w-[150px]',
              unreadCount > 0
                ? 'text-foreground font-semibold'
                : 'text-muted-foreground'
            )}
          >
            {conversation.lastMessage || 'No messages yet'}
          </p>
          {unreadCount > 0 && (
            <Badge className="bg-primary hover:bg-primary text-primary-foreground text-[10px] h-4.5 min-w-4.5 rounded-full flex items-center justify-center p-1 font-bold animate-pulse">
              {unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}
