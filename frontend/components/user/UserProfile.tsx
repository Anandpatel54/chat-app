'use client';

import { IUser } from '@/types';
import { UserAvatar } from './UserAvatar';
import { formatLastSeen } from '@/utils/formatDate';

interface UserProfileProps {
  user: IUser;
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <UserAvatar
        src={user.profileImage}
        name={user.name}
        size="xl"
        isOnline={user.isOnline}
      />
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground">{user.name}</h3>
        <p className="text-sm text-muted-foreground">{user.email}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {user.isOnline ? 'Online' : formatLastSeen(user.lastSeen)}
        </p>
      </div>
      {user.about && (
        <div className="w-full mt-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            About
          </p>
          <p className="text-sm text-foreground">{user.about}</p>
        </div>
      )}
    </div>
  );
}
