import { Response } from 'express';
import notificationService from '../services/notification.service';
import asyncHandler from '../utils/asyncHandler';
import ApiResponse from '../utils/apiResponse';
import { AuthRequest } from '../types';

export const getNotifications = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await notificationService.getUserNotifications(
      req.user!._id.toString(),
      page,
      limit
    );

    res.json(ApiResponse.success(result, 'Notifications fetched'));
  }
);

export const markAsRead = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const notification = await notificationService.markAsRead(
      id,
      req.user!._id.toString()
    );
    res.json(ApiResponse.success(notification, 'Notification marked as read'));
  }
);

export const markAllAsRead = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    await notificationService.markAllAsRead(req.user!._id.toString());
    res.json(ApiResponse.success(null, 'All notifications marked as read'));
  }
);
