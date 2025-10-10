export interface Comment {
  $id: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  likesCount?: number;
  isLiked?: boolean;
  replyTo?: string[];
  post?: string;
  imageUrls?: string[];
}

export interface CreateCommentData {
  userId: string;
  content: string;
  replyTo?: string[];
  post?: string;
  imageUrls?: string[];
}

export interface UpdateCommentData {
  content?: string;
  updatedAt?: string;
  likesCount?: number;
  isLiked?: boolean;
  replyTo?: string[];
  post?: string;
  imageUrls?: string[];
}
