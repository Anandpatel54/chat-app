'use client';

import { formatDateSeparator } from '@/utils/formatDate';

interface DateSeparatorProps {
  date: string;
}

export function DateSeparator({ date }: DateSeparatorProps) {
  return (
    <div className="flex justify-center my-4 select-none">
      <span className="bg-muted px-3 py-1 rounded-full text-[10px] text-muted-foreground font-semibold shadow-sm border border-border/10">
        {formatDateSeparator(date)}
      </span>
    </div>
  );
}
