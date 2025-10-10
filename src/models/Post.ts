import { CatBasic } from "./cat";
import { Hashtag } from "./Hashtag";
import { User } from "./User";

export interface Post {
  $id: string;
  userId: string | {
    $id: string;
    username?: string;
    fullName?: string;
    // imageUrl?: string;
  };
  content: string;
  type: 'post' | 'question' | 'answer';
  createdAt: string;
  updatedAt?: string;
  likesCount?: number;
  commentsCount?: number;
  isLiked?: boolean;
  // Store IDs to avoid permission issues
  imageUrls?: string[];
  nicknameIds?: string[];
  // Optional: populated data for display (loaded via Query.select)
  cats?: string[];
  hashtags?: string[];
  users?: string[];
  comments?: string[];
}

export interface CreatePostData {
  userId: string;
  content: string;
  likesCount?: number;
  commentsCount?: number;
  isLiked?: boolean;
  type?: 'post' | 'question' | 'answer';
  // Store IDs for database
  imageUrls?: string[];
  nicknameIds?: string[];
  // Optional: for convenience when creating posts (will extract IDs)
  cats?: string[];
  hashtags?: string[];
  users?: string[];
  comments?: string[];
}

export interface UpdatePostData {
  content?: string;
  updatedAt?: string;
  likesCount?: number;
  commentsCount?: number;
  isLiked?: boolean;
  // Store IDs for database
  imageUrls?: string[];
  nicknameIds?: string[];
  // Optional: for convenience when updating posts
  cats?: string[];
  hashtags?: string[];
  users?: string[];
  comments?: string[];
}
