import { Response } from 'express';
import messageService from '../services/message.service';
import cloudinaryService from '../services/cloudinary.service';
import asyncHandler from '../utils/asyncHandler';
import ApiResponse from '../utils/apiResponse';
import { AuthRequest } from '../types';
import { UPLOAD } from '../constants';
import { getIO } from '../socket';
import { SOCKET_EVENTS } from '../constants/socketEvents';
import { getUserSocketId } from '../socket/events/connection.event';
import conversationRepository from '../repositories/conversation.repository';

export const getMessages = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { conversationId } = req.params as { conversationId: string };
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await messageService.getMessages(
      conversationId,
      req.user!._id.toString(),
      page,
      limit
    );

    res.json(ApiResponse.success(result, 'Messages fetched'));
  }
);

export const sendMessage = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    let fileUrl: string | undefined;
    let fileName: string | undefined;

    if (req.file) {
      const isImage = (UPLOAD.ALLOWED_IMAGE_TYPES as readonly string[]).includes(req.file.mimetype);
      const uploadResult = isImage
        ? await cloudinaryService.uploadImage(req.file.path)
        : await cloudinaryService.uploadFile(req.file.path);

      fileUrl = uploadResult.url;
      fileName = req.file.originalname;
    }

    const message = await messageService.sendMessage(
      {
        ...req.body,
        fileUrl,
        fileName,
      },
      req.user!._id.toString()
    );

    // Emit live message event to all participants via Socket.io
    try {
      const io = getIO();
      const conversationIdStr = message.conversationId.toString();

      // Emit to the conversation room first
      io.to(conversationIdStr).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, {
        message,
      });

      // Find all participants and emit to their individual socket IDs if online
      const conversation = await conversationRepository.findById(conversationIdStr);
      if (conversation) {
        for (const p of conversation.participants) {
          const pid = p._id?.toString() || p.toString();
          // Send to everyone except the sender (to avoid duplicate processing)
          if (pid !== req.user!._id.toString()) {
            const socketId = getUserSocketId(pid);
            if (socketId) {
              io.to(socketId).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, {
                message,
              });
            }
          }
        }
      }
    } catch (socketError) {
      console.error('Error emitting live message event:', socketError);
    }

    res.status(201).json(ApiResponse.created(message, 'Message sent'));
  }
);

export const markAsRead = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    await messageService.markConversationAsRead(
      id,
      req.user!._id.toString()
    );
    res.json(ApiResponse.success(null, 'Messages marked as read'));
  }
);

export const deleteForMe = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const message = await messageService.deleteForMe(
      id,
      req.user!._id.toString()
    );
    res.json(ApiResponse.success(message, 'Message deleted for you'));
  }
);

export const deleteForEveryone = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const message = await messageService.deleteForEveryone(
      id,
      req.user!._id.toString()
    );
    res.json(ApiResponse.success(message, 'Message deleted for everyone'));
  }
);

export const forwardMessage = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const { conversationIds } = req.body;
    const messages = await messageService.forwardMessage(
      id,
      conversationIds,
      req.user!._id.toString()
    );
    res.json(ApiResponse.success(messages, 'Message forwarded'));
  }
);
