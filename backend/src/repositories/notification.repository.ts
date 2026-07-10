import Notification from '../models/notification.model';
import { INotification, ICreateNotification } from '../types/notification.types';
import { Types } from 'mongoose';

class NotificationRepository {
  async create(data: ICreateNotification): Promise<INotification> {
    return Notification.create({
      ...data,
      userId: new Types.ObjectId(data.userId),
      senderId: new Types.ObjectId(data.senderId),
    });
  }

  async getUserNotifications(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ notifications: INotification[]; total: number }> {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      Notification.find({ userId: new Types.ObjectId(userId) })
        .populate('senderId', 'name profileImage')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments({ userId: new Types.ObjectId(userId) }),
    ]);

    return { notifications, total };
  }

  async markAsRead(notificationId: string): Promise<INotification | null> {
    return Notification.findByIdAndUpdate(
      notificationId,
      { $set: { isRead: true } },
      { new: true }
    );
  }

  async markAllAsRead(userId: string): Promise<void> {
    await Notification.updateMany(
      { userId: new Types.ObjectId(userId), isRead: false },
      { $set: { isRead: true } }
    );
  }

  async getUnreadCount(userId: string): Promise<number> {
    return Notification.countDocuments({
      userId: new Types.ObjectId(userId),
      isRead: false,
    });
  }
}

export default new NotificationRepository();
