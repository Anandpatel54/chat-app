'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/cn';

export default function LoginPage() {
  const { isAuthenticated, isLoading, loginWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/home');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Navigation Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/40 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-violet-500 flex items-center justify-center shadow-md">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
            ChatApp
          </span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={loginWithGoogle}
            className={cn(buttonVariants({ variant: 'ghost' }), "cursor-pointer")}
          >
            Login
          </button>
          <button
            onClick={loginWithGoogle}
            className={cn(
              buttonVariants(),
              "bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 text-white shadow-lg cursor-pointer"
            )}
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Login Card Container */}
      <main className="flex-1 flex flex-col justify-center items-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md p-8 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-md shadow-2xl space-y-8"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-violet-500 flex items-center justify-center shadow-lg">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Welcome to ChatApp</h2>
              <p className="text-sm text-muted-foreground">Sign in to sync your messages, chats, and files.</p>
            </div>
          </div>

          <div className="space-y-4">
            <GoogleLoginButton />
          </div>

          <p className="text-center text-xs text-muted-foreground leading-relaxed px-4">
            By signing in, you agree to our Terms of Service and Privacy Policy. Secure single sign-on powered by Google OAuth.
          </p>
        </motion.div>
      </main>

      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-border/40">
        <p>&copy; {new Date().getFullYear()} ChatApp. All rights reserved.</p>
      </footer>
    </div>
  );
}
