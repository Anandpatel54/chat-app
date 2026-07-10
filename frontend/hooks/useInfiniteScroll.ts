'use client';

import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number;
  reverse?: boolean;
}

export const useInfiniteScroll = ({
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 100,
  reverse = false,
}: UseInfiniteScrollOptions) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeight = useRef(0);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || isLoading || !hasMore) return;

    if (reverse) {
      // For chat: load more when scrolled to top
      if (container.scrollTop <= threshold) {
        prevScrollHeight.current = container.scrollHeight;
        onLoadMore();
      }
    } else {
      // Normal: load more when scrolled near bottom
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - threshold) {
        onLoadMore();
      }
    }
  }, [isLoading, hasMore, onLoadMore, threshold, reverse]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Restore scroll position after prepending messages (reverse scroll)
  useEffect(() => {
    if (reverse && containerRef.current && prevScrollHeight.current > 0) {
      const newScrollHeight = containerRef.current.scrollHeight;
      containerRef.current.scrollTop =
        newScrollHeight - prevScrollHeight.current;
      prevScrollHeight.current = 0;
    }
  });

  return { containerRef };
};
