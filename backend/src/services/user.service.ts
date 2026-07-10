import userRepository from '../repositories/user.repository';
import { IUser, IUpdateProfile } from '../types/user.types';
import ApiError from '../utils/apiError';

class UserService {
  async getUserById(userId: string): Promise<IUser> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return user;
  }

  async searchUsers(query: string, currentUserId: string): Promise<IUser[]> {
    if (!query || query.trim().length < 1) {
      return [];
    }
    return userRepository.searchUsers(query.trim(), currentUserId);
  }

  async blockUser(userId: string, blockUserId: string): Promise<IUser> {
    if (userId === blockUserId) {
      throw ApiError.badRequest('Cannot block yourself');
    }

    const targetUser = await userRepository.findById(blockUserId);
    if (!targetUser) {
      throw ApiError.notFound('User to block not found');
    }

    const user = await userRepository.blockUser(userId, blockUserId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return user;
  }

  async unblockUser(userId: string, unblockUserId: string): Promise<IUser> {
    const user = await userRepository.unblockUser(userId, unblockUserId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return user;
  }

  async updateProfile(userId: string, data: IUpdateProfile): Promise<IUser> {
    const user = await userRepository.updateProfile(userId, data);
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return user;
  }

  async updateProfileImage(userId: string, imageUrl: string): Promise<IUser> {
    const user = await userRepository.updateProfileImage(userId, imageUrl);
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return user;
  }
}

export default new UserService();
