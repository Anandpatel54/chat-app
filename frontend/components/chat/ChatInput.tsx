'use client';

import { useState, useRef } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { useTyping } from '@/hooks/useTyping';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ReplyPreview } from './ReplyPreview';
import { Paperclip, Smile, Send, Image as ImageIcon, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';

// Dynamically import EmojiPicker to optimize bundle size
const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

interface ChatInputProps {
  conversationId: string;
}

export function ChatInput({ conversationId }: ChatInputProps) {
  const { sendMessage, replyTo, setReply } = useMessages(conversationId);
  const { handleTyping, stopTyping } = useTyping(conversationId);
  const [content, setContent] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'image' | 'file' | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !selectedFile) return;

    try {
      const type = fileType || 'text';
      await sendMessage(content, type, selectedFile || undefined);
      setContent('');
      setSelectedFile(null);
      setFileType(null);
      stopTyping();
      setShowEmoji(false);
    } catch {
      toast.error('Failed to send message');
    }
  };

  const handleInputChange = (value: string) => {
    setContent(value);
    if (value.trim().length > 0) {
      handleTyping();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds the 10MB limit');
      return;
    }

    setSelectedFile(file);
    setFileType(type);
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setFileType(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const onEmojiClick = (emojiObject: any) => {
    setContent((prev) => prev + emojiObject.emoji);
  };

  return (
    <div className="flex flex-col border-t border-border/40 bg-card">
      {/* Reply Preview Banner */}
      {replyTo && (
        <ReplyPreview message={replyTo} onClose={() => setReply(null)} />
      )}

      {/* Selected File Banner */}
      {selectedFile && (
        <div className="flex items-center justify-between gap-3 px-4 py-2 bg-muted/40 border-b border-border/10">
          <div className="flex items-center gap-2">
            {fileType === 'image' ? (
              <ImageIcon className="w-4 h-4 text-primary" />
            ) : (
              <Paperclip className="w-4 h-4 text-primary" />
            )}
            <span className="text-xs font-semibold text-foreground truncate max-w-[200px]">
              {selectedFile.name}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={clearSelectedFile} className="w-5 h-5 rounded-full">
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}

      {/* Main Input Form */}
      <form onSubmit={handleSend} className="p-3 flex items-center gap-2 relative">
        {/* Hidden inputs */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFileChange(e, 'file')}
          className="hidden"
        />
        <input
          type="file"
          accept="image/*"
          ref={imageInputRef}
          onChange={(e) => handleFileChange(e, 'image')}
          className="hidden"
        />

        <div className="flex items-center gap-1">
          {/* File attachment */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="w-8 h-8 rounded-full"
            title="Attach file"
          >
            <Paperclip className="w-4 h-4 text-muted-foreground" />
          </Button>

          {/* Image attachment */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => imageInputRef.current?.click()}
            className="w-8 h-8 rounded-full"
            title="Attach photo"
          >
            <ImageIcon className="w-4 h-4 text-muted-foreground" />
          </Button>

          {/* Emoji toggle */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowEmoji(!showEmoji)}
            className="w-8 h-8 rounded-full"
            title="Emojis"
          >
            <Smile className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>

        {/* Text Input */}
        <Input
          value={content}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-muted/50 border-none focus-visible:ring-1 h-9 rounded-lg"
        />

        {/* Send Button */}
        <Button
          type="submit"
          size="icon"
          disabled={!content.trim() && !selectedFile}
          className="w-8 h-8 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground shadow"
        >
          <Send className="w-3.5 h-3.5" />
        </Button>

        {/* Emoji Picker Popover */}
        {showEmoji && (
          <div className="absolute bottom-14 left-3 z-50 shadow-2xl border border-border rounded-2xl overflow-hidden">
            <EmojiPicker onEmojiClick={onEmojiClick} theme={undefined as any} />
          </div>
        )}
      </form>
    </div>
  );
}
