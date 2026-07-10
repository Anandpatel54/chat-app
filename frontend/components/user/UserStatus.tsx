'use client';

import { formatLastSeen } from '@/utils/formatDate';

interface UserStatusProps {
  isOnline: boolean;
  lastSeen: string;
  isTyping?: boolean;
  typingUserName?: string;
}

export function UserStatus({
  isOnline,
  lastSeen,
  isTyping,
  typingUserName,
}: UserStatusProps) {
  if (isTyping) {
    return (
      <span className="text-xs text-emerald-500 font-medium animate-pulse">
        {typingUserName ? `${typingUserName} is typing...` : 'typing...'}
      </span>
    );
  }

  if (isOnline) {
    return <span className="text-xs text-emerald-500 font-medium">online</span>;
  }

  return (
    <span className="text-xs text-muted-foreground">
      {formatLastSeen(lastSeen)}
    </span>
  );
}
