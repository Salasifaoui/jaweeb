export type MessageType = 'text' | 'image' | 'audio' | 'system';

export interface Message {
  id: string;
  sender_id: string;      // User who sent the message
  receiver_id?: string;   // For private messages
  group_id?: string;      // For group messages
  content: string;        // Message text
  type: MessageType;      // Message type
  media_url?: string;     // Media URL (image/audio)
  is_read?: boolean;      // Read status
  read_by?: string[];     // Users who read the message (for groups)
  created_at: string;     // Send timestamp
}

// For backward compatibility with existing Chat interface
export interface ChatMessage extends Message {
  chatId: string;         // Alias for group_id or receiver_id
  senderId: string;       // Alias for sender_id
  createdAt: string;      // Alias for created_at
  updatedAt: string;      // Same as created_at
  status?: 'sent' | 'delivered' | 'read';
  replyTo?: string;
  attachments?: string[];
}