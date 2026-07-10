import { Request, Response } from 'express';
import passport from 'passport';
import authService from '../services/auth.service';
import asyncHandler from '../utils/asyncHandler';
import ApiResponse from '../utils/apiResponse';
import { AuthRequest } from '../types';
import { JWT } from '../constants';
import { sanitizeUser } from '../utils/helpers';

export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false,
});

export const googleCallback = [
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed`,
  }),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { token, user } = await authService.handleGoogleAuth(req.user!);

    res.cookie(JWT.COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: JWT.COOKIE_MAX_AGE,
    });

    res.redirect(`${process.env.CLIENT_URL}/home`);
  }),
];

export const getMe = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = await authService.getCurrentUser(req.user!._id.toString());
    res.json(ApiResponse.success(sanitizeUser(user), 'User fetched successfully'));
  }
);

export const logout = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    await authService.logout(req.user!._id.toString());

    res.clearCookie(JWT.COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    res.json(ApiResponse.success(null, 'Logged out successfully'));
  }
);

export const updateFcmToken = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { fcmToken } = req.body;
    await authService.updateFcmToken(req.user!._id.toString(), fcmToken);
    res.json(ApiResponse.success(null, 'FCM token updated'));
  }
);
