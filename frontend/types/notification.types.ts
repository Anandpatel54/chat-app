export interface INotification {
  _id: string;
  userId: string;
  senderId: {
    _id: string;
    name: string;
    profileImage: string;
  };
  type: 'message' | 'missed_call' | 'system';
  title: string;
  body: string;
  data: {
    conversationId?: string;
    messageId?: string;
    [key: string]: string | undefined;
  };
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}
