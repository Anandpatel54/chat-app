import { Router } from 'express';
import {
  getMessages,
  sendMessage,
  markAsRead,
  deleteForMe,
  deleteForEveryone,
  forwardMessage,
} from '../controllers/message.controller';
import authMiddleware from '../middlewares/auth.middleware';
import validate from '../middlewares/validate.middleware';
import {
  sendMessageSchema,
  messageIdParamSchema,
  forwardMessageSchema,
} from '../validators/message.validator';
import { uploadSingle } from '../middlewares/upload.middleware';
import { messageLimiter, uploadLimiter } from '../middlewares/rateLimiter.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/:conversationId', getMessages);
router.post('/', messageLimiter, uploadSingle, sendMessage);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteForMe);
router.delete('/:id/everyone', deleteForEveryone);
router.post(
  '/:id/forward',
  validate(forwardMessageSchema),
  forwardMessage
);

export default router;
