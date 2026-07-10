export interface IUser {
  _id: string;
  name: string;
  email: string;
  profileImage: string;
  isOnline: boolean;
  lastSeen: string;
  about: string;
  blockedUsers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IUpdateProfile {
  name?: string;
  about?: string;
}
