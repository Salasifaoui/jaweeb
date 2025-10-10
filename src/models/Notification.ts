export interface Notification {
  $id: string;
  title: string;
  message: string;
  read_at?: string;
  sendTo: string;
  sender: string;
  type?: 'mention' | 'comment' | 'like' | 'follow' | 'general';
  postId?: string;
  commentId?: string;
}

export interface CreateNotificationData {
  title: string;
  message: string;
  sendTo: string;
  sender: string;
  type?: 'mention' | 'comment' | 'like' | 'follow' | 'general';
  postId?: string;
  commentId?: string;
}

export interface UpdateNotificationData {
  read_at?: string;
  updatedAt?: string;
}

export interface NotificationStatus {
  $id: string;
  count: number;
  userId: string;
  updatedAt: string;
}

export interface CreateNotificationStatusData {
  count: number;
  userId: string;
}

export interface UpdateNotificationStatusData {
  count?: number;
  updatedAt?: string;
}
