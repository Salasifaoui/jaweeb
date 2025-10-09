import { appwriteClient } from '@/src/appwrite/appwriteClient';
import type { Chat, CreateGroupData, Message, UpdateGroupData, User } from '@/src/types';
import { groupsService } from './groupsService';
import { membershipsService } from './membershipsService';
import { messagesService } from './messagesService';
import { usersService } from './usersService';

export class ChatService {
  async getChats(): Promise<Chat[]> {
    try {
      const session = await appwriteClient.account.getSession('current');
      if (!session) throw new Error('غير مصرح لك');

      // Get user's groups through memberships
      const userGroups = await groupsService.getUserGroups(session.userId);
      
      return userGroups.map(group => ({
        id: group.id,
        name: group.name,
        type: 'group' as any,
        avatar: group.avatar_url,
        description: group.description,
        members: [], // Will be populated separately if needed
        lastMessage: '',
        lastMessageTime: group.created_at,
        unreadCount: 0,
        createdAt: group.created_at,
        updatedAt: group.created_at,
        createdBy: group.owner_id,
      }));
    } catch (error) {
      throw new Error('فشل في تحميل المحادثات.');
    }
  }

  async getChat(chatId: string): Promise<Chat> {
    try {
      const group = await groupsService.getGroup(chatId);
      const members = await membershipsService.getGroupMembers(chatId);
      
      return {
        id: group.id,
        name: group.name,
        type: 'group' as const,
        avatar: group.avatar_url,
        description: group.description,
        members: members.map(m => ({
          userId: m.user_id,
          role: m.role,
          joinedAt: m.joined_at,
        })),
        lastMessage: '',
        lastMessageTime: group.created_at,
        unreadCount: 0,
        createdAt: group.created_at,
        updatedAt: group.created_at,
        createdBy: group.owner_id,
      };
    } catch (error) {
      throw new Error('فشل في تحميل المحادثة.');
    }
  }

  async createGroup(groupData: CreateGroupData): Promise<string> {
    console.log('groupData', groupData);
    try {
      const session = await appwriteClient.account.getSession('current');
      if (!session) throw new Error('غير مصرح لك');

      // Create the group
      const group = await groupsService.createGroup({
        name: groupData.name,
        description: groupData.description,
        avatar_url: groupData.avatar,
      });

      // Add creator as admin
      await membershipsService.addMemberToGroup(session.userId, group.id, 'admin');

      // Add other members
      if (groupData.memberIds) {
        for (const memberId of groupData.memberIds) {
          await membershipsService.addMemberToGroup(memberId, group.id, 'member');
        }
      }

      return group.id;
    } catch (error) {
      throw new Error('فشل في إنشاء المجموعة.');
    }
  }

  async updateGroup(chatId: string, updateData: UpdateGroupData): Promise<void> {
    try {
      await groupsService.updateGroup(chatId, updateData);
    } catch (error) {
      throw new Error('فشل في تحديث المجموعة.');
    }
  }

  async deleteChat(chatId: string): Promise<void> {
    try {
      await groupsService.deleteGroup(chatId);
    } catch (error) {
      throw new Error('فشل في حذف المحادثة.');
    }
  }

  async addMember(chatId: string, userId: string): Promise<void> {
    try {
      await membershipsService.addMemberToGroup(userId, chatId, 'member');
    } catch (error) {
      throw new Error('فشل في إضافة العضو.');
    }
  }

  async removeMember(chatId: string, userId: string): Promise<void> {
    try {
      await membershipsService.removeMemberFromGroup(userId, chatId);
    } catch (error) {
      throw new Error('فشل في إزالة العضو.');
    }
  }

  async getMessages(chatId: string): Promise<Message[]> {
    try {
      return await messagesService.getGroupMessages(chatId);
    } catch (error) {
      throw new Error('فشل في تحميل الرسائل.');
    }
  }

  async sendMessage(chatId: string, content: string): Promise<Message> {
    try {
      const session = await appwriteClient.account.getSession('current');
      if (!session) throw new Error('غير مصرح لك');

      const message = await messagesService.createMessage({
        content,
        sender_id: session.userId,
        group_id: chatId,
        groups: chatId,
        type: 'text',
      });

      return message;
    } catch (error) {
      throw new Error('فشل في إرسال الرسالة.');
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      return await usersService.getUsers();
    } catch (error) {
      throw new Error('فشل في تحميل المستخدمين.');
    }
  }
}

export const chatService = new ChatService();
