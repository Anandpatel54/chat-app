'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setUser, clearUser, setLoading, setError } from '@/features/auth/authSlice';
import { authService } from '@/services/auth.service';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  );

  const checkAuth = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const userData = await authService.getMe();
      dispatch(setUser(userData));
    } catch {
      dispatch(clearUser());
    }
  }, [dispatch]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      dispatch(clearUser());
      router.push('/login');
    } catch (err: any) {
      dispatch(setError(err.message));
    }
  }, [dispatch, router]);

  const loginWithGoogle = useCallback(() => {
    window.location.href = authService.getGoogleAuthUrl();
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    checkAuth,
    logout,
    loginWithGoogle,
  };
};
