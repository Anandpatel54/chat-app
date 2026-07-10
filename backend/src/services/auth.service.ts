import userRepository from '../repositories/user.repository';
import { IUser } from '../types/user.types';
import { generateToken, JwtPayload } from '../utils/jwt';
import ApiError from '../utils/apiError';

class AuthService {
  async handleGoogleAuth(user: IUser): Promise<{ token: string; user: IUser }> {
    if (!user) {
      throw ApiError.unauthorized('Authentication failed');
    }

    const payload: JwtPayload = {
      userId: user._id.toString(),
      email: user.email,
    };

    const token = generateToken(payload);

    return { token, user };
  }

  async getCurrentUser(userId: string): Promise<IUser> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return user;
  }

  async updateFcmToken(userId: string, fcmToken: string): Promise<IUser> {
    const user = await userRepository.updateFcmToken(userId, fcmToken);
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return user;
  }

  async logout(userId: string): Promise<void> {
    await userRepository.updateFcmToken(userId, '');
    await userRepository.setOffline(userId);
  }
}

export default new AuthService();
