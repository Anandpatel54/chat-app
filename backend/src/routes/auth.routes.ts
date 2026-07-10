import { Router } from 'express';
import {
  googleAuth,
  googleCallback,
  getMe,
  logout,
  updateFcmToken,
} from '../controllers/auth.controller';
import authMiddleware from '../middlewares/auth.middleware';
import validate from '../middlewares/validate.middleware';
import { fcmTokenSchema } from '../validators/auth.validator';
import { authLimiter } from '../middlewares/rateLimiter.middleware';

const router = Router();

router.get('/google', authLimiter, googleAuth);
router.get('/google/callback', ...googleCallback);
router.get('/me', authMiddleware, getMe);
router.post('/logout', authMiddleware, logout);
router.put(
  '/fcm-token',
  authMiddleware,
  validate(fcmTokenSchema),
  updateFcmToken
);

export default router;
