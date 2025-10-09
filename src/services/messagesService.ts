import { appwriteClient } from '@/src/appwrite/appwriteClient';
import type { Message, MessageType } from '@/src/types';
import { APPWRITE_CONFIG } from '@/src/utils/constants';
import { Query } from 'react-native-appwrite';

export interface CreateMessageData {
  sender_id: string;
  receiver_id?: string;
  group_id?: string;
  content: string;
  type: MessageType;
  media_url?: string;
}

export interface UpdateMessageData {
  content?: string;
  is_read?: boolean;
  read_by?: string[];
}

export class MessagesService {
  async getMessages(): Promise<Message[]> {
    try {
      const messages = await appwriteClient.databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.MESSAGES,
        [Query.orderDesc('created_at')]
      );
      
      return messages.documents.map((message: any) => ({
        id: message.$id,
        sender_id: message.sender_id,
        receiver_id: message.receiver_id,
        group_id: message.group_id,
        content: message.content,
        type: message.type,
        media_url: message.media_url,
        is_read: message.is_read,
        read_by: message.read_by,
        created_at: message.created_at,
      }));
    } catch (error) {
      throw new Error('فشل في تحميل الرسائل.');
    }
  }

  async getMessage(messageId: string): Promise<Message> {
    try {
      const message = await appwriteClient.databases.getDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.MESSAGES,
        messageId
      );
      
      return {
        id: (message as any).$id,
        sender_id: (message as any).sender_id,
        receiver_id: (message as any).receiver_id,
        group_id: (message as any).group_id,
        content: (message as any).content,
        type: (message as any).type,
        media_url: (message as any).media_url,
        is_read: (message as any).is_read,
        read_by: (message as any).read_by,
        created_at: (message as any).created_at,
      };
    } catch (error) {
      throw new Error('فشل في تحميل الرسالة.');
    }
  }

  async createMessage(messageData: CreateMessageData): Promise<Message> {
    try {
      const message = await appwriteClient.databases.createDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.MESSAGES,
        'unique()',
        {
          sender_id: messageData.sender_id,
          receiver_id: messageData.receiver_id,
          group_id: messageData.group_id,
          content: messageData.content,
          type: messageData.type,
          media_url: messageData.media_url,
          is_read: false,
          read_by: [],
          created_at: new Date().toISOString(),
        }
      );

      return {
        id: (message as any).$id,
        sender_id: (message as any).sender_id,
        receiver_id: (message as any).receiver_id,
        group_id: (message as any).group_id,
        content: (message as any).content,
        type: (message as any).type,
        media_url: (message as any).media_url,
        is_read: (message as any).is_read,
        read_by: (message as any).read_by,
        created_at: (message as any).created_at,
      };
    } catch (error) {
      throw new Error('فشل في إرسال الرسالة.');
    }
  }

  async updateMessage(messageId: string, messageData: UpdateMessageData): Promise<Message> {
    try {
      const message = await appwriteClient.databases.updateDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.MESSAGES,
        messageId,
        messageData as any
      );

      return {
        id: (message as any).$id,
        sender_id: (message as any).sender_id,
        receiver_id: (message as any).receiver_id,
        group_id: (message as any).group_id,
        content: (message as any).content,
        type: (message as any).type,
        media_url: (message as any).media_url,
        is_read: (message as any).is_read,
        read_by: (message as any).read_by,
        created_at: (message as any).created_at,
      };
    } catch (error) {
      throw new Error('فشل في تحديث الرسالة.');
    }
  }

  async deleteMessage(messageId: string): Promise<void> {
    try {
      await appwriteClient.databases.deleteDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.MESSAGES,
        messageId
      );
    } catch (error) {
      throw new Error('فشل في حذف الرسالة.');
    }
  }

  async getGroupMessages(groupId: string, limit: number = 50, offset: number = 0): Promise<Message[]> {
    try {
      const messages = await appwriteClient.databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.MESSAGES,
        [
          Query.equal('group_id', [groupId]),
          Query.orderDesc('created_at'),
          Query.limit(limit),
          Query.offset(offset),
        ]
      );
      
      return messages.documents.map((message: any) => ({
        id: message.$id,
        sender_id: message.sender_id,
        receiver_id: message.receiver_id,
        group_id: message.group_id,
        content: message.content,
        type: message.type,
        media_url: message.media_url,
        is_read: message.is_read,
        read_by: message.read_by,
        created_at: message.created_at,
      }));
    } catch (error) {
      throw new Error('فشل في تحميل رسائل المجموعة.');
    }
  }

  async getPrivateMessages(userId1: string, userId2: string): Promise<Message[]> {
    try {
      const messages = await appwriteClient.databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.MESSAGES,
        [
          Query.or([
            Query.and([
              Query.equal('sender_id', [userId1]),
              Query.equal('receiver_id', [userId2]),
            ]),
            Query.and([
              Query.equal('sender_id', [userId2]),
              Query.equal('receiver_id', [userId1]),
            ]),
          ]),
          Query.orderDesc('created_at'),
        ]
      );
      
      return messages.documents.map((message: any) => ({
        id: message.$id,
        sender_id: message.sender_id,
        receiver_id: message.receiver_id,
        group_id: message.group_id,
        content: message.content,
        type: message.type,
        media_url: message.media_url,
        is_read: message.is_read,
        read_by: message.read_by,
        created_at: message.created_at,
      }));
    } catch (error) {
      throw new Error('فشل في تحميل الرسائل الخاصة.');
    }
  }

  async getUserMessages(userId: string): Promise<Message[]> {
    try {
      const messages = await appwriteClient.databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.MESSAGES,
        [
          Query.equal('sender_id', [userId]),
          Query.orderDesc('created_at'),
        ]
      );
      
      return messages.documents.map((message: any) => ({
        id: message.$id,
        sender_id: message.sender_id,
        receiver_id: message.receiver_id,
        group_id: message.group_id,
        content: message.content,
        type: message.type,
        media_url: message.media_url,
        is_read: message.is_read,
        read_by: message.read_by,
        created_at: message.created_at,
      }));
    } catch (error) {
      throw new Error('فشل في تحميل رسائل المستخدم.');
    }
  }

  async markMessageAsRead(messageId: string, userId: string): Promise<Message> {
    try {
      const message = await this.getMessage(messageId);
      const readBy = message.read_by || [];
      
      if (!readBy.includes(userId)) {
        readBy.push(userId);
      }

      return await this.updateMessage(messageId, { 
        is_read: true, 
        read_by: readBy 
      });
    } catch (error) {
      throw new Error('فشل في تحديد الرسالة كمقروءة.');
    }
  }

  async searchMessages(query: string, groupId?: string): Promise<Message[]> {
    try {
      const queries = [Query.search('content', query)];
      
      if (groupId) {
        queries.push(Query.equal('group_id', [groupId]));
      }

      const messages = await appwriteClient.databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.MESSAGES,
        queries
      );
      
      return messages.documents.map((message: any) => ({
        id: message.$id,
        sender_id: message.sender_id,
        receiver_id: message.receiver_id,
        group_id: message.group_id,
        content: message.content,
        type: message.type,
        media_url: message.media_url,
        is_read: message.is_read,
        read_by: message.read_by,
        created_at: message.created_at,
      }));
    } catch (error) {
      throw new Error('فشل في البحث في الرسائل.');
    }
  }

  async sendTextMessage(senderId: string, content: string, receiverId?: string, groupId?: string): Promise<Message> {
    try {
      return await this.createMessage({
        sender_id: senderId,
        receiver_id: receiverId,
        group_id: groupId,
        content,
        type: 'text',
      });
    } catch (error) {
      throw new Error('فشل في إرسال الرسالة النصية.');
    }
  }

  async sendImageMessage(senderId: string, content: string, mediaUrl: string, receiverId?: string, groupId?: string): Promise<Message> {
    try {
      return await this.createMessage({
        sender_id: senderId,
        receiver_id: receiverId,
        group_id: groupId,
        content,
        type: 'image',
        media_url: mediaUrl,
      });
    } catch (error) {
      throw new Error('فشل في إرسال الصورة.');
    }
  }

  async sendAudioMessage(senderId: string, content: string, mediaUrl: string, receiverId?: string, groupId?: string): Promise<Message> {
    try {
      return await this.createMessage({
        sender_id: senderId,
        receiver_id: receiverId,
        group_id: groupId,
        content,
        type: 'audio',
        media_url: mediaUrl,
      });
    } catch (error) {
      throw new Error('فشل في إرسال الصوت.');
    }
  }
}

export const messagesService = new MessagesService();