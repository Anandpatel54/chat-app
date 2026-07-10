'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Search, UserPlus, Bell } from 'lucide-react';

interface EmptyStateProps {
  type?: 'chat' | 'messages' | 'search' | 'notifications';
  title?: string;
  description?: string;
}

const emptyConfig = {
  chat: {
    icon: MessageSquare,
    title: 'No conversations yet',
    description: 'Start a new chat by searching for users',
  },
  messages: {
    icon: MessageSquare,
    title: 'No messages yet',
    description: 'Send a message to start the conversation',
  },
  search: {
    icon: Search,
    title: 'No results found',
    description: 'Try searching with different keywords',
  },
  notifications: {
    icon: Bell,
    title: 'No notifications',
    description: "You're all caught up!",
  },
};

export function EmptyState({
  type = 'chat',
  title,
  description,
}: EmptyStateProps) {
  const config = emptyConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-full py-16 px-4 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title || config.title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        {description || config.description}
      </p>
    </motion.div>
  );
}
