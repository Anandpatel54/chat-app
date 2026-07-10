import { Router } from 'express';
import {
  getConversations,
  createConversation,
  getConversationById,
  deleteConversation,
  searchConversations,
} from '../controllers/chat.controller';
import authMiddleware from '../middlewares/auth.middleware';
import validate from '../middlewares/validate.middleware';
import {
  createConversationSchema,
  conversationIdParamSchema,
  searchChatSchema,
} from '../validators/chat.validator';

const router = Router();

router.use(authMiddleware);

router.get('/', getConversations);
router.post('/', validate(createConversationSchema), createConversation);
router.get('/search', validate(searchChatSchema, 'query'), searchConversations);
router.get(
  '/:id',
  validate(conversationIdParamSchema, 'params'),
  getConversationById
);
router.delete(
  '/:id',
  validate(conversationIdParamSchema, 'params'),
  deleteConversation
);

export default router;
