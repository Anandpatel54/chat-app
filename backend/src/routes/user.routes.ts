import { Router } from 'express';
import {
  searchUsers,
  getUserById,
  blockUser,
  unblockUser,
} from '../controllers/user.controller';
import authMiddleware from '../middlewares/auth.middleware';
import validate from '../middlewares/validate.middleware';
import { searchUserSchema, userIdParamSchema } from '../validators/user.validator';

const router = Router();

router.use(authMiddleware);

router.get('/search', validate(searchUserSchema, 'query'), searchUsers);
router.get('/:id', validate(userIdParamSchema, 'params'), getUserById);
router.put('/block/:id', validate(userIdParamSchema, 'params'), blockUser);
router.put('/unblock/:id', validate(userIdParamSchema, 'params'), unblockUser);

export default router;
