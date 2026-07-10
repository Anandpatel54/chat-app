import { getFirebaseMessaging } from '../config/firebase';
import userRepository from '../repositories/user.repository';
import notificationRepository from '../repositories/notification.repository';
import { truncateMessage } from '../utils/helpers';

interface FcmNotificationPayload {
  receiverId: string;
  senderId: string;
  senderName: string;
  senderImage: string;
  messagePreview: string;
  conversationId: string;
  messageId: string;
}

class FcmService {
  async sendPushNotification(payload: FcmNotificationPayload): Promise<void> {
    try {
      const fcmToken = await userRepository.getFcmToken(payload.receiverId);
      if (!fcmToken) return;

      const messaging = getFirebaseMessaging();

      if (messaging) {
        await messaging.send({
          token: fcmToken,
          notification: {
            title: payload.senderName,
            body: truncateMessage(payload.messagePreview, 100),
            imageUrl: payload.senderImage,
          },
          data: {
            type: 'message',
            conversationId: payload.conversationId,
            messageId: payload.messageId,
            senderId: payload.senderId,
            senderName: payload.senderName,
            senderImage: payload.senderImage,
          },
          webpush: {
            fcmOptions: {
              link: `/chat/${payload.conversationId}`,
            },
            notification: {
              icon: payload.senderImage,
              badge: '/icons/badge.png',
              tag: payload.conversationId,
              renotify: true,
            },
          },
        });
      } else {
        console.warn('Skipping FCM push send (Firebase Admin not initialized).');
      }

      // Store notification in database
      await notificationRepository.create({
        userId: payload.receiverId,
        senderId: payload.senderId,
        type: 'message',
        title: payload.senderName,
        body: truncateMessage(payload.messagePreview, 100),
        data: {
          conversationId: payload.conversationId,
          messageId: payload.messageId,
        },
      });
    } catch (error: any) {
      // Token may be invalid — silently fail and clear token
      if (
        error?.code === 'messaging/invalid-registration-token' ||
        error?.code === 'messaging/registration-token-not-registered'
      ) {
        await userRepository.updateFcmToken(payload.receiverId, '');
      }
      console.error('FCM send error:', error);
    }
  }
}

export default new FcmService();
