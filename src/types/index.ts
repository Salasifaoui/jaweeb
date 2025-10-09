// Re-export all types
export * from './group';
export * from './membership';
export * from './message';
export * from './user';

// Legacy Chat interface for backward compatibility
export interface Chat {
  id: string;
  name: string;
  type: 'group' | 'private';
  avatar?: string;
  description?: string;
  members: ChatMember[];
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ChatMember {
  userId: string;
  role: 'admin' | 'member';
  joinedAt: string;
}

export type ChatRole = 'admin' | 'member';
export type ChatType = 'group' | 'private';