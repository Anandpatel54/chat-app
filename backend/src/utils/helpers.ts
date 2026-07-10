import { Types } from 'mongoose';

export const isValidObjectId = (id: string): boolean => {
  return Types.ObjectId.isValid(id);
};

export const toObjectId = (id: string): Types.ObjectId => {
  return new Types.ObjectId(id);
};

export const formatPagination = (page: string | undefined, limit: string | undefined) => {
  const pageNum = Math.max(1, parseInt(page || '1', 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit || '20', 10)));
  const skip = (pageNum - 1) * limitNum;

  return { page: pageNum, limit: limitNum, skip };
};

export const sanitizeUser = (user: any) => {
  const { googleId, fcmToken, __v, ...sanitized } = user.toObject
    ? user.toObject()
    : user;
  return sanitized;
};

export const truncateMessage = (message: string, maxLength: number = 100): string => {
  if (message.length <= maxLength) return message;
  return message.substring(0, maxLength) + '...';
};
