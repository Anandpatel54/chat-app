export interface IMessage {
  _id: string;
  conversationId: string;
  sender: {
    _id: string;
    name: string;
    profileImage: string;
  };
  content: string;
  messageType: 'text' | 'image' | 'file';
  fileUrl: string | null;
  fileName: string | null;
  replyTo: {
    _id: string;
    content: string;
    sender: {
      _id: string;
      name: string;
    };
    messageType?: string;
  } | null;
  readBy: string[];
  deliveredTo: string[];
  deletedFor: string[];
  isDeletedForEveryone: boolean;
  forwardedFrom: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ISendMessage {
  conversationId: string;
  content: string;
  messageType: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  replyTo?: string;
  tempId?: string;
}

export interface IForwardMessage {
  messageId: string;
  conversationIds: string[];
}
