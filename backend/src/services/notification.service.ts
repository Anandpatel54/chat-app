import notificationRepository from '../repositories/notification.repository';
import { INotification, ICreateNotification } from '../types/notification.types';
import ApiError from '../utils/apiError';

class NotificationService {
  async createNotification(data: ICreateNotification): Promise<INotification> {
    return notificationRepository.create(data);
  }

  async getUserNotifications(
    userId: string,
    page: number,
    limit: number
  ): Promise<{
    notifications: INotification[];
    total: number;
    hasMore: boolean;
    unreadCount: number;
  }> {
    const [{ notifications, total }, unreadCount] = await Promise.all([
      notificationRepository.getUserNotifications(userId, page, limit),
      notificationRepository.getUnreadCount(userId),
    ]);

    return {
      notifications,
      total,
      hasMore: page * limit < total,
      unreadCount,
    };
  }

  async markAsRead(
    notificationId: string,
    userId: string
  ): Promise<INotification> {
    const notification = await notificationRepository.markAsRead(notificationId);
    if (!notification) {
      throw ApiError.notFound('Notification not found');
    }
    if (notification.userId.toString() !== userId) {
      throw ApiError.forbidden('Not authorized');
    }
    return notification;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await notificationRepository.markAllAsRead(userId);
  }

  async getUnreadCount(userId: string): Promise<number> {
    return notificationRepository.getUnreadCount(userId);
  }
}

export default new NotificationService();
