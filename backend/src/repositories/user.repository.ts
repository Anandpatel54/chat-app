import User from '../models/user.model';
import { IUser, IUpdateProfile } from '../types/user.types';
import { Types } from 'mongoose';

class UserRepository {
  async findById(id: string): Promise<IUser | null> {
    return User.findById(id).select('-googleId -__v');
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }

  async findByGoogleId(googleId: string): Promise<IUser | null> {
    return User.findOne({ googleId });
  }

  async create(userData: Partial<IUser>): Promise<IUser> {
    return User.create(userData);
  }

  async updateProfile(userId: string, data: IUpdateProfile): Promise<IUser | null> {
    return User.findByIdAndUpdate(userId, { $set: data }, { new: true }).select(
      '-googleId -__v'
    );
  }

  async updateProfileImage(userId: string, imageUrl: string): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      userId,
      { $set: { profileImage: imageUrl } },
      { new: true }
    ).select('-googleId -__v');
  }

  async updateFcmToken(userId: string, fcmToken: string): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      userId,
      { $set: { fcmToken } },
      { new: true }
    );
  }

  async setOnline(userId: string): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      userId,
      { $set: { isOnline: true } },
      { new: true }
    );
  }

  async setOffline(userId: string): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      userId,
      { $set: { isOnline: false, lastSeen: new Date() } },
      { new: true }
    );
  }

  async searchUsers(query: string, currentUserId: string): Promise<IUser[]> {
    return User.find({
      _id: { $ne: new Types.ObjectId(currentUserId) },
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
    })
      .select('name email profileImage isOnline lastSeen about')
      .limit(20);
  }

  async blockUser(userId: string, blockUserId: string): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      userId,
      { $addToSet: { blockedUsers: new Types.ObjectId(blockUserId) } },
      { new: true }
    ).select('-googleId -__v');
  }

  async unblockUser(userId: string, unblockUserId: string): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      userId,
      { $pull: { blockedUsers: new Types.ObjectId(unblockUserId) } },
      { new: true }
    ).select('-googleId -__v');
  }

  async getFcmToken(userId: string): Promise<string | null> {
    const user = await User.findById(userId).select('fcmToken');
    return user?.fcmToken || null;
  }
}

export default new UserRepository();
