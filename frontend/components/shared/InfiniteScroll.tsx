'use client';

import { useRef } from 'react';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

interface InfiniteScrollProps {
  children: React.ReactNode;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  reverse?: boolean;
  className?: string;
}

export function InfiniteScroll({
  children,
  onLoadMore,
  hasMore,
  isLoading,
  reverse = false,
  className = '',
}: InfiniteScrollProps) {
  const { containerRef } = useInfiniteScroll({
    onLoadMore,
    hasMore,
    isLoading,
    reverse,
  });

  return (
    <div ref={containerRef} className={`overflow-y-auto ${className}`}>
      {isLoading && reverse && (
        <div className="flex justify-center py-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {children}
      {isLoading && !reverse && (
        <div className="flex justify-center py-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
