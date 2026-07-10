'use client';

// ChatLayout component - Full implementation in Phase 9
interface ChatLayoutProps {
  children: React.ReactNode;
}

export function ChatLayout({ children }: ChatLayoutProps) {
  return <div id="chat-layout" className="flex h-screen">{children}</div>;
}
