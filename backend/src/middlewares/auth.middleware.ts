import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import ApiError from '../utils/apiError';
import User from '../models/user.model';
import { AuthRequest } from '../types';
import { JWT } from '../constants';

const authMiddleware = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token =
      req.cookies?.[JWT.COOKIE_NAME] ||
      req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw ApiError.unauthorized('No token provided');
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId).select('-googleId -__v');

    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    req.user = user;
    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      next(ApiError.unauthorized('Invalid token'));
    } else if (error.name === 'TokenExpiredError') {
      next(ApiError.unauthorized('Token expired'));
    } else {
      next(error);
    }
  }
};

export default authMiddleware;
