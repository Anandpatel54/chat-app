'use client';

import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  type?: 'chat-list' | 'message' | 'profile' | 'default';
  count?: number;
}

export function SkeletonLoader({ type = 'default', count = 3 }: SkeletonLoaderProps) {
  const items = Array.from({ length: count });

  if (type === 'chat-list') {
    return (
      <div className="space-y-1">
        {items.map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
              <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
            </div>
            <div className="h-3 bg-muted rounded animate-pulse w-10" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'message') {
    return (
      <div className="space-y-4 p-4">
        {items.map((_, i) => (
          <div
            key={i}
            className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[60%] space-y-2 ${
                i % 2 === 0 ? '' : 'items-end'
              }`}
            >
              <div className="h-16 bg-muted rounded-2xl animate-pulse w-48" />
              <div className="h-3 bg-muted rounded animate-pulse w-12" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'profile') {
    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <div className="w-24 h-24 rounded-full bg-muted animate-pulse" />
        <div className="h-5 bg-muted rounded animate-pulse w-32" />
        <div className="h-4 bg-muted rounded animate-pulse w-48" />
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4">
      {items.map((_, i) => (
        <div key={i} className="h-4 bg-muted rounded animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
      ))}
    </div>
  );
}
