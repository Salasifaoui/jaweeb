import { account, databases } from '@/src/services/apiService';
import type { CreateGroupData, Group, UpdateGroupData } from '@/src/types';
import { APPWRITE_CONFIG } from '@/src/utils/constants';
import { Query } from 'react-native-appwrite';

export class GroupsService {
  async getGroups(): Promise<Group[]> {
    try {
      const groups = await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.GROUPS,
        [Query.orderDesc('created_at')]
      );
      
      return groups.documents.map((group: any) => ({
        id: group.$id,
        name: group.name,
        owner_id: group.owner_id,
        description: group.description,
        avatar_url: group.avatar_url,
        members_count: group.members_count || 0,
        created_at: group.created_at,
      }));
    } catch (error) {
      throw new Error('فشل في تحميل المجموعات.');
    }
  }

  async getGroup(groupId: string): Promise<Group> {
    try {
      const group = await databases.getDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.GROUPS,
        groupId
      );
      
      return {
        id: (group as any).$id,
        name: (group as any).name,
        owner_id: (group as any).owner_id,
        description: (group as any).description,
        avatar_url: (group as any).avatar_url,
        members_count: (group as any).members_count || 0,
        created_at: (group as any).created_at,
      };
    } catch (error) {
      throw new Error('فشل في تحميل المجموعة.');
    }
  }

  async createGroup(groupData: CreateGroupData): Promise<Group> {
    try {
      const session = await account.getSession('current');
      if (!session) throw new Error('غير مصرح لك');

      const group = await databases.createDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.GROUPS,
        'unique()',
        {
          name: groupData.name,
          owner_id: session.userId,
          description: groupData.description || '',
          avatar_url: groupData.avatar_url || '',
          members_count: 1, // Owner is the first member
          created_at: new Date().toISOString(),
        }
      );

      return {
        id: (group as any).$id,
        name: (group as any).name,
        owner_id: (group as any).owner_id,
        description: (group as any).description,
        avatar_url: (group as any).avatar_url,
        members_count: (group as any).members_count,
        created_at: (group as any).created_at,
      };
    } catch (error) {
      throw new Error('فشل في إنشاء المجموعة.');
    }
  }

  async updateGroup(groupId: string, groupData: UpdateGroupData): Promise<Group> {
    try {
      const group = await databases.updateDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.GROUPS,
        groupId,
        groupData as any
      );

      return {
        id: (group as any).$id,
        name: (group as any).name,
        owner_id: (group as any).owner_id,
        description: (group as any).description,
        avatar_url: (group as any).avatar_url,
        members_count: (group as any).members_count,
        created_at: (group as any).created_at,
      };
    } catch (error) {
      throw new Error('فشل في تحديث المجموعة.');
    }
  }

  async deleteGroup(groupId: string): Promise<void> {
    try {
      await databases.deleteDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.GROUPS,
        groupId
      );
    } catch (error) {
      throw new Error('فشل في حذف المجموعة.');
    }
  }

  async getUserGroups(userId: string): Promise<Group[]> {
    try {
      // Get groups where user is a member through memberships
      const memberships = await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.MEMBERSHIPS,
        [
          Query.equal('user_id', [userId]),
        ]
      );

      const groupIds = memberships.documents.map((membership: any) => membership.group_id);
      
      if (groupIds.length === 0) return [];

      const groups = await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.GROUPS,
        [Query.equal('$id', groupIds)]
      );
      
      return groups.documents.map((group: any) => ({
        id: group.$id,
        name: group.name,
        owner_id: group.owner_id,
        description: group.description,
        avatar_url: group.avatar_url,
        members_count: group.members_count || 0,
        created_at: group.created_at,
      }));
    } catch (error) {
      throw new Error('فشل في تحميل مجموعات المستخدم.');
    }
  }

  async getOwnedGroups(userId: string): Promise<Group[]> {
    try {
      const groups = await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.GROUPS,
        [
          Query.equal('owner_id', [userId]),
          Query.orderDesc('created_at'),
        ]
      );
      
      return groups.documents.map((group: any) => ({
        id: group.$id,
        name: group.name,
        owner_id: group.owner_id,
        description: group.description,
        avatar_url: group.avatar_url,
        members_count: group.members_count || 0,
        created_at: group.created_at,
      }));
    } catch (error) {
      throw new Error('فشل في تحميل المجموعات المملوكة.');
    }
  }

  async searchGroups(query: string): Promise<Group[]> {
    try {
      const groups = await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.GROUPS,
        [
          Query.search('name', query),
        ]
      );
      
      return groups.documents.map((group: any) => ({
        id: group.$id,
        name: group.name,
        owner_id: group.owner_id,
        description: group.description,
        avatar_url: group.avatar_url,
        members_count: group.members_count || 0,
        created_at: group.created_at,
      }));
    } catch (error) {
      throw new Error('فشل في البحث عن المجموعات.');
    }
  }

  async updateMemberCount(groupId: string, count: number): Promise<Group> {
    try {
      return await this.updateGroup(groupId, { members_count: count } as any);
    } catch (error) {
      throw new Error('فشل في تحديث عدد الأعضاء.');
    }
  }

  async incrementMemberCount(groupId: string): Promise<Group> {
    try {
      const group = await this.getGroup(groupId);
      return await this.updateMemberCount(groupId, group.members_count || 0 + 1);
    } catch (error) {
      throw new Error('فشل في زيادة عدد الأعضاء.');
    }
  }

  async decrementMemberCount(groupId: string): Promise<Group> {
    try {
      const group = await this.getGroup(groupId);
      return await this.updateMemberCount(groupId, Math.max(0, group.members_count || 0 - 1));
    } catch (error) {
      throw new Error('فشل في تقليل عدد الأعضاء.');
    }
  }
}

export const groupsService = new GroupsService();