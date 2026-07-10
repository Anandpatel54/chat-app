'use client';

import { IMessage } from '@/types';
import { X, CornerDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReplyPreviewProps {
  message: IMessage;
  onClose: () => void;
}

export function ReplyPreview({ message, onClose }: ReplyPreviewProps) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2 bg-muted/60 border-t border-border/40 backdrop-blur-md relative select-none animate-in slide-in-from-bottom duration-200">
      <div className="flex items-center gap-2 overflow-hidden">
        <CornerDownRight className="w-4 h-4 text-primary shrink-0" />
        <div className="flex flex-col text-left overflow-hidden">
          <span className="text-[10px] font-bold text-primary truncate">
            Replying to {message.sender.name}
          </span>
          <span className="text-xs text-muted-foreground truncate">
            {message.messageType === 'text'
              ? message.content
              : message.messageType === 'image'
              ? '📷 Photo'
              : '📎 File attachment'}
          </span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="w-6 h-6 rounded-full hover:bg-muted"
      >
        <X className="w-3.5 h-3.5 text-muted-foreground" />
      </Button>
    </div>
  );
}
