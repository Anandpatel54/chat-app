import { Server } from 'socket.io';
import { IAuthenticatedSocket } from '../../types/socket.types';
import { SOCKET_EVENTS } from '../../constants/socketEvents';
import messageService from '../../services/message.service';
import conversationRepository from '../../repositories/conversation.repository';
import fcmService from '../../services/fcm.service';
import { getUserSocketId, isUserOnline } from './connection.event';
import { truncateMessage } from '../../utils/helpers';

export const handleMessageEvents = (io: Server, socket: IAuthenticatedSocket) => {
  const userId = socket.userId!;

  // Join conversation room
  socket.on(SOCKET_EVENTS.JOIN_ROOM, (conversationId: string) => {
    socket.join(conversationId);
    console.log(`👤 User ${userId} joined room: ${conversationId}`);
  });

  // Leave conversation room
  socket.on(SOCKET_EVENTS.LEAVE_ROOM, (conversationId: string) => {
    socket.leave(conversationId);
    console.log(`👤 User ${userId} left room: ${conversationId}`);
  });

  // Send message
  socket.on(SOCKET_EVENTS.SEND_MESSAGE, async (data: {
    conversationId: string;
    content: string;
    messageType: 'text' | 'image' | 'file';
    fileUrl?: string;
    fileName?: string;
    replyTo?: string;
    tempId?: string;
  }) => {
    try {
      const message = await messageService.sendMessage(
        {
          conversationId: data.conversationId,
          content: data.content,
          messageType: data.messageType,
          fileUrl: data.fileUrl,
          fileName: data.fileName,
          replyTo: data.replyTo,
        },
        userId
      );

      // Emit to the room (all participants)
      io.to(data.conversationId).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, {
        message,
        tempId: data.tempId,
      });

      // Get conversation to find other participants
      const conversation = await conversationRepository.findById(data.conversationId);
      if (conversation) {
        const otherParticipants = conversation.participants.filter(
          (p: any) => {
            const pid = p._id?.toString() || p.toString();
            return pid !== userId;
          }
        );

        for (const participant of otherParticipants) {
          const pid = (participant as any)._id?.toString() || participant.toString();

          if (isUserOnline(pid)) {
            // User is online — mark as delivered
            const recipientSocketId = getUserSocketId(pid);
            if (recipientSocketId) {
              io.to(recipientSocketId).emit(SOCKET_EVENTS.MESSAGE_DELIVERED, {
                messageId: message._id.toString(),
                conversationId: data.conversationId,
                userId: pid,
              });
            }
          } else {
            // User is offline — send push notification
            const senderData = (message as any).sender;
            await fcmService.sendPushNotification({
              receiverId: pid,
              senderId: userId,
              senderName: senderData?.name || 'Someone',
              senderImage: senderData?.profileImage || '',
              messagePreview:
                data.messageType === 'text'
                  ? data.content
                  : data.messageType === 'image'
                  ? '📷 Photo'
                  : '📎 File',
              conversationId: data.conversationId,
              messageId: message._id.toString(),
            });
          }
        }
      }
    } catch (error) {
      console.error('Send message error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Message delivered acknowledgement
  socket.on(SOCKET_EVENTS.MESSAGE_DELIVERED, async (data: {
    messageId: string;
    conversationId: string;
  }) => {
    try {
      await messageService.markAsDelivered(data.messageId, userId);

      // Notify the sender that their message was delivered
      socket.to(data.conversationId).emit(SOCKET_EVENTS.MESSAGE_DELIVERED, {
        messageId: data.messageId,
        conversationId: data.conversationId,
        userId,
      });
    } catch (error) {
      console.error('Message delivered error:', error);
    }
  });

  // Message seen
  socket.on(SOCKET_EVENTS.MESSAGE_SEEN, async (data: {
    messageId: string;
    conversationId: string;
  }) => {
    try {
      await messageService.markAsRead(data.messageId, userId);
      await messageService.markConversationAsRead(data.conversationId, userId);

      // Notify the sender that their message was seen
      socket.to(data.conversationId).emit(SOCKET_EVENTS.MESSAGE_SEEN, {
        messageId: data.messageId,
        conversationId: data.conversationId,
        userId,
      });
    } catch (error) {
      console.error('Message seen error:', error);
    }
  });
};
