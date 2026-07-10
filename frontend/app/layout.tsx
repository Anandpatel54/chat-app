import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from '@/redux/provider';
import { QueryProvider } from '@/providers/QueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { SocketProvider } from '@/providers/SocketProvider';
import { NotificationProvider } from '@/providers/NotificationProvider';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'ChatApp - Real-Time Enterprise Chat',
  description: 'A production-ready, enterprise-level real-time chat application inspired by WhatsApp, Telegram, and Discord.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground transition-colors duration-200`}>
        <ReduxProvider>
          <QueryProvider>
            <ThemeProvider>
              <AuthProvider>
                <SocketProvider>
                  <NotificationProvider>
                    {children}
                    <Toaster position="top-right" toastOptions={{
                      duration: 4000,
                      style: {
                        background: 'var(--background)',
                        color: 'var(--foreground)',
                        border: '1px solid var(--border)',
                      }
                    }} />
                  </NotificationProvider>
                </SocketProvider>
              </AuthProvider>
            </ThemeProvider>
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
