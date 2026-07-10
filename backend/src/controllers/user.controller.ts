import { Response } from 'express';
import userService from '../services/user.service';
import asyncHandler from '../utils/asyncHandler';
import ApiResponse from '../utils/apiResponse';
import { AuthRequest } from '../types';
import { sanitizeUser } from '../utils/helpers';

export const searchUsers = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { q } = req.query as { q: string };
    const users = await userService.searchUsers(q, req.user!._id.toString());
    res.json(ApiResponse.success(users, 'Users found'));
  }
);

export const getUserById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const user = await userService.getUserById(id);
    res.json(ApiResponse.success(sanitizeUser(user), 'User fetched'));
  }
);

export const blockUser = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const user = await userService.blockUser(
      req.user!._id.toString(),
      id
    );
    res.json(ApiResponse.success(sanitizeUser(user), 'User blocked'));
  }
);

export const unblockUser = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const user = await userService.unblockUser(
      req.user!._id.toString(),
      id
    );
    res.json(ApiResponse.success(sanitizeUser(user), 'User unblocked'));
  }
);
