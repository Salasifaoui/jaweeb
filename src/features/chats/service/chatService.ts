import { APP_CONFIG } from '@/src/config';
import { databases, listDocuments } from '@/src/services/apiService';
import { Chat, Message } from '@/src/types/chat';
import { ID, Query } from 'react-native-appwrite';

export class ChatService {
  // Chat CRUD Operations
  static async createChat(data: {
    name?: string;
    imageUrl?: string;
    is_group: boolean;
    members: string[];
    created_by: string;
  }): Promise<Chat> {
    try {
      const chat = await databases.createDocument(
        process.env.EXPO_PUBLIC_DATABASE_ID!,
        APP_CONFIG.CHATS_COLLECTION,
        ID.unique(),
        {
          name: data.name,
          imageUrl: data.imageUrl,
          is_group: data.is_group,
          members: data.members,
          created_by: data.created_by,
          created_at: new Date().toISOString(),
        }
      );
      return chat as Chat;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  }

  static async getChat(chatId: string): Promise<Chat> {
    try {
      const chat = await databases.getDocument(
        process.env.EXPO_PUBLIC_DATABASE_ID!,
        APP_CONFIG.CHATS_COLLECTION,
        chatId
      );
      return chat as Chat;
    } catch (error) {
      console.error('Error getting chat:', error);
      throw error;
    }
  }

  static async getUserChats(userId: string): Promise<Chat[]> {
    try {
      const chats = await databases.listDocuments(
        process.env.EXPO_PUBLIC_DATABASE_ID!,
        APP_CONFIG.CHATS_COLLECTION,
        [Query.contains('members', userId)]
      );
      return chats.documents as Chat[];
    } catch (error) {
      console.error('Error getting user chats:', error);
      throw error;
    }
  }

  static async updateChat(chatId: string, data: Partial<Chat>): Promise<Chat> {
    try {
      const chat = await databases.updateDocument(
        process.env.EXPO_PUBLIC_DATABASE_ID!,
        APP_CONFIG.CHATS_COLLECTION,
        chatId,
        data
      );
      return chat as Chat;
    } catch (error) {
      console.error('Error updating chat:', error);
      throw error;
    }
  }

  static async deleteChat(chatId: string): Promise<void> {
    try {
      await databases.deleteDocument(
        process.env.EXPO_PUBLIC_DATABASE_ID!,
        APP_CONFIG.CHATS_COLLECTION,
        chatId
      );
    } catch (error) {
      console.error('Error deleting chat:', error);
      throw error;
    }
  }

  static async getAllChats(): Promise<Chat[]> {
    try {
      const chats = await listDocuments(
        APP_CONFIG.CHATS_COLLECTION,
      );
      return chats.documents as unknown as Chat[];
    } catch (error) {
      console.error('Error getting all chats:', error);
      throw error;
    }
  }

  // Message CRUD Operations
  static async sendMessage(data: {
    chat_id: string;
    sender_id: string;
    content: string;
    file_id?: string;
  }): Promise<Message> {
    try {
      const message = await databases.createDocument(
        process.env.EXPO_PUBLIC_DATABASE_ID!,
        APP_CONFIG.MESSAGES_COLLECTION,
        ID.unique(),
        {
          chat_id: data.chat_id,
          sender_id: data.sender_id,
          content: data.content,
          file_id: data.file_id,
          seen_by: [data.sender_id],
          created_at: new Date().toISOString(),
        }
      );

      // Update chat's last_message_id
      await this.updateChat(data.chat_id, {
        last_message_id: message.$id,
      });

      return message as Message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  static async getChatMessages(chatId: string, limit = 50): Promise<Message[]> {
    try {
      const messages = await databases.listDocuments(
        process.env.EXPO_PUBLIC_DATABASE_ID!,
        APP_CONFIG.MESSAGES_COLLECTION,
        [
          Query.equal('chat_id', chatId),
          Query.orderDesc('created_at'),
          Query.limit(limit),
        ]
      );
      return messages.documents as Message[];
    } catch (error) {
      console.error('Error getting chat messages:', error);
      throw error;
    }
  }

  static async markMessageAsSeen(messageId: string, userId: string): Promise<Message> {
    try {
      const message = await databases.getDocument(
        process.env.EXPO_PUBLIC_DATABASE_ID!,
        APP_CONFIG.MESSAGES_COLLECTION,
        messageId
      );

      const seenBy = message.seen_by || [];
      if (!seenBy.includes(userId)) {
        seenBy.push(userId);
      }

      const updatedMessage = await databases.updateDocument(
        process.env.EXPO_PUBLIC_DATABASE_ID!,
        APP_CONFIG.MESSAGES_COLLECTION,
        messageId,
        { seen_by: seenBy }
      );

      return updatedMessage as Message;
    } catch (error) {
      console.error('Error marking message as seen:', error);
      throw error;
    }
  }

  static async deleteMessage(messageId: string): Promise<void> {
    try {
      await databases.deleteDocument(
        process.env.EXPO_PUBLIC_DATABASE_ID!,
        APP_CONFIG.MESSAGES_COLLECTION,
        messageId
      );
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  // Realtime subscriptions
  static subscribeToChat(chatId: string, callback: (payload: any) => void) {
    return databases.subscribe(
      `databases.${process.env.EXPO_PUBLIC_DATABASE_ID}.collections.${APP_CONFIG.CHATS_COLLECTION}.documents.${chatId}`,
      callback
    );
  }

  static subscribeToChatMessages(chatId: string, callback: (payload: any) => void) {
    return databases.subscribe(
      `databases.${process.env.EXPO_PUBLIC_DATABASE_ID}.collections.${APP_CONFIG.MESSAGES_COLLECTION}.documents`,
      (payload) => {
        if (payload.events.includes('databases.*.collections.*.documents.*.create') &&
            payload.payload.chat_id === chatId) {
          callback(payload);
        }
      }
    );
  }

  static subscribeToUserChats(userId: string, callback: (payload: any) => void) {
    return databases.subscribe(
      `databases.${process.env.EXPO_PUBLIC_DATABASE_ID}.collections.${APP_CONFIG.CHATS_COLLECTION}.documents`,
      (payload) => {
        if (payload.events.includes('databases.*.collections.*.documents.*.create') &&
            payload.payload.members.includes(userId)) {
          callback(payload);
        }
      }
    );
  }
}
