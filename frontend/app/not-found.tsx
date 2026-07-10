'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageSquare, AlertCircle } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/cn';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-background via-background to-muted/30 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md p-8 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-md shadow-2xl flex flex-col items-center space-y-6"
      >
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight">404</h1>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Page Not Found</h2>
          <p className="text-sm text-muted-foreground">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>

        <Link
          href="/home"
          className={cn(
            buttonVariants({ size: 'lg' }),
            "w-full bg-gradient-to-r from-primary to-violet-600 text-white"
          )}
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
