'use client';

import { IMessage } from '@/types';
import { cn } from '@/utils/cn';
import { formatMessageTime } from '@/utils/formatDate';
import { Check, CheckCheck, FileText, Download } from 'lucide-react';
import Image from 'next/image';

interface MessageBubbleProps {
  message: IMessage;
  isOwn: boolean;
  otherParticipantId: string;
  onReplyClick?: (message: IMessage) => void;
}

export function MessageBubble({
  message,
  isOwn,
  otherParticipantId,
  onReplyClick,
}: MessageBubbleProps) {
  const isRead = message.readBy.includes(otherParticipantId);
  const isDelivered = message.deliveredTo.includes(otherParticipantId);

  const renderStatus = () => {
    if (!isOwn) return null;
    if (isRead) return <CheckCheck className="w-3.5 h-3.5 text-blue-500" />;
    if (isDelivered) return <CheckCheck className="w-3.5 h-3.5 text-muted-foreground" />;
    return <Check className="w-3.5 h-3.5 text-muted-foreground" />;
  };

  return (
    <div
      className={cn(
        'flex w-full mb-2',
        isOwn ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[70%] rounded-2xl px-3 py-2 shadow-sm relative flex flex-col',
          isOwn
            ? 'bg-primary text-primary-foreground rounded-tr-none'
            : 'bg-muted text-foreground rounded-tl-none'
        )}
      >
        {/* Reply Message Header */}
        {message.replyTo && (
          <div
            onClick={() => onReplyClick?.(message.replyTo as any)}
            className={cn(
              'border-l-4 rounded p-1.5 text-xs mb-1.5 cursor-pointer flex flex-col',
              isOwn
                ? 'bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground/80'
                : 'bg-foreground/5 border-foreground/20 text-muted-foreground'
            )}
          >
            <span className="font-semibold text-[10px]">
              {message.replyTo.sender.name}
            </span>
            <span className="truncate">
              {message.replyTo.content}
            </span>
          </div>
        )}

        {/* Message Content depending on type */}
        {message.messageType === 'image' && message.fileUrl && (
          <div className="rounded-lg overflow-hidden max-w-sm mb-1.5 border border-border/10">
            <a href={message.fileUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={message.fileUrl}
                alt="Image attachment"
                className="w-full h-auto object-cover max-h-60 hover:opacity-90 transition-opacity"
              />
            </a>
          </div>
        )}

        {message.messageType === 'file' && message.fileUrl && (
          <div
            className={cn(
              'flex items-center gap-3 p-2 rounded-lg text-xs mb-1.5 border',
              isOwn
                ? 'bg-primary-foreground/10 border-primary-foreground/15 text-primary-foreground'
                : 'bg-background/50 border-border text-foreground'
            )}
          >
            <FileText className="w-8 h-8 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{message.fileName || 'Attachment'}</p>
              <p className="text-[10px] opacity-75">File attachment</p>
            </div>
            <a
              href={message.fileUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'p-1.5 rounded-full hover:bg-foreground/10',
                isOwn ? 'text-primary-foreground' : 'text-foreground'
              )}
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* Message text */}
        {message.content && (
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words pr-8">
            {message.content}
          </p>
        )}

        {/* Footer info: time & delivery status */}
        <div className="absolute bottom-1 right-1.5 flex items-center gap-1 select-none">
          <span
            className={cn(
              'text-[9px]',
              isOwn ? 'text-primary-foreground/75' : 'text-muted-foreground'
            )}
          >
            {formatMessageTime(message.createdAt)}
          </span>
          {renderStatus()}
        </div>
      </div>
    </div>
  );
}
