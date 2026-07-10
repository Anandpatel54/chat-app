import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  updateProfileImage,
  updateFcmToken,
} from '../controllers/profile.controller';
import authMiddleware from '../middlewares/auth.middleware';
import validate from '../middlewares/validate.middleware';
import { updateProfileSchema } from '../validators/profile.validator';
import { uploadProfileImage } from '../middlewares/upload.middleware';
import { uploadLimiter } from '../middlewares/rateLimiter.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getProfile);
router.put('/', validate(updateProfileSchema), updateProfile);
router.put('/image', uploadLimiter, uploadProfileImage, updateProfileImage);
router.put('/fcm-token', updateFcmToken);

export default router;
