'use client';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/utils/cn';

interface UserAvatarProps {
  src: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-20 h-20',
};

const dotSizeClasses = {
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-4 h-4',
};

export function UserAvatar({
  src,
  name,
  size = 'md',
  isOnline,
  className,
}: UserAvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative inline-flex">
      <Avatar className={cn(sizeClasses[size], className)}>
        <AvatarImage src={src} alt={name} />
        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
          {initials}
        </AvatarFallback>
      </Avatar>
      {isOnline !== undefined && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-background',
            dotSizeClasses[size],
            isOnline ? 'bg-emerald-500' : 'bg-gray-400'
          )}
        />
      )}
    </div>
  );
}
