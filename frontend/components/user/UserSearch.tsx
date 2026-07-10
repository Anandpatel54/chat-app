'use client';

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { userService } from '@/services/user.service';
import { IUser } from '@/types';
import { UserAvatar } from './UserAvatar';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector } from '@/redux/hooks';

interface UserSearchProps {
  onSelectUser: (user: IUser) => void;
}

export function UserSearch({ onSelectUser }: UserSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const handleSearch = useCallback(
    async (value: string) => {
      setQuery(value);
      if (value.trim().length < 1) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const users = await userService.searchUsers(value);
        setResults(users);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search users..."
          className="pl-9 pr-9 bg-muted/50 border-none focus-visible:ring-1"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-1"
          >
            {results.map((user) => (
              <button
                key={user._id}
                onClick={() => {
                  onSelectUser(user);
                  clearSearch();
                }}
                className="flex items-center gap-3 w-full p-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left"
              >
                <UserAvatar
                  src={user.profileImage}
                  name={user.name}
                  size="md"
                  isOnline={user.isOnline}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
