import { Response } from 'express';
import userService from '../services/user.service';
import cloudinaryService from '../services/cloudinary.service';
import asyncHandler from '../utils/asyncHandler';
import ApiResponse from '../utils/apiResponse';
import { AuthRequest } from '../types';
import { sanitizeUser } from '../utils/helpers';
import { UPLOAD } from '../constants';

export const getProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = req.user!;
    res.json(ApiResponse.success(sanitizeUser(user), 'Profile fetched'));
  }
);

export const updateProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = await userService.updateProfile(
      req.user!._id.toString(),
      req.body
    );
    res.json(ApiResponse.success(sanitizeUser(user), 'Profile updated'));
  }
);

export const updateProfileImage = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No image file provided',
      });
      return;
    }

    const { url } = await cloudinaryService.uploadImage(
      req.file.path,
      UPLOAD.CLOUDINARY_FOLDERS.PROFILE
    );

    const user = await userService.updateProfileImage(
      req.user!._id.toString(),
      url
    );

    res.json(ApiResponse.success(sanitizeUser(user), 'Profile image updated'));
  }
);

export const updateFcmToken = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { fcmToken } = req.body;
    const user = await userService.updateProfile(req.user!._id.toString(), {});
    // FCM token is handled separately through auth service
    res.json(ApiResponse.success(null, 'FCM token updated'));
  }
);
