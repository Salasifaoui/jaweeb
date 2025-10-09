import { appwriteClient } from '@/src/appwrite/appwriteClient';
import type { CreateMembershipData, Membership, MembershipRole, UpdateMembershipData } from '@/src/types';
import { APPWRITE_CONFIG } from '@/src/utils/constants';
import { Query } from 'react-native-appwrite';

export class MembershipsService {
  async getMemberships(): Promise<Membership[]> {
    try {
      const memberships = await appwriteClient.databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.MEMBERSHIPS
      );
      
      return memberships.documents.map((membership: any) => ({
        id: membership.$id,
        group_id: membership.group_id,
        user_id: membership.user_id,
        role: membership.role,
        joined_at: membership.joined_at,
      }));
    } catch (error) {
      throw new Error('فشل في تحميل العضويات.');
    }
  }

  async getMembership(membershipId: string): Promise<Membership> {
    try {
      const membership = await appwriteClient.databases.getDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.MEMBERSHIPS,
        membershipId
      );
      
      return {
        id: (membership as any).$id,
        group_id: (membership as any).group_id,
        user_id: (membership as any).user_id,
        role: (membership as any).role,
        joined_at: (membership as any).joined_at,
      };
    } catch (error) {
      throw new Error('فشل في تحميل العضوية.');
    }
  }

  async createMembership(membershipData: CreateMembershipData): Promise<Membership> {
    try {
      const membership = await appwriteClient.databases.createDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.MEMBERSHIPS,
        'unique()',
        {
          group_id: membershipData.group_id,
          user_id: membershipData.user_id,
          role: membershipData.role,
          joined_at: new Date().toISOString(),
        }
      );

      return {
        id: (membership as any).$id,
        group_id: (membership as any).group_id,
        user_id: (membership as any).user_id,
        role: (membership as any).role,
        joined_at: (membership as any).joined_at,
      };
    } catch (error) {
      throw new Error('فشل في إنشاء العضوية.');
    }
  }

  async updateMembership(membershipId: string, membershipData: UpdateMembershipData): Promise<Membership> {
    try {
      const membership = await appwriteClient.databases.updateDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.MEMBERSHIPS,
        membershipId,
        membershipData as any
      );

      return {
        id: (membership as any).$id,
        group_id: (membership as any).group_id,
        user_id: (membership as any).user_id,
        role: (membership as any).role,
        joined_at: (membership as any).joined_at,
      };
    } catch (error) {
      throw new Error('فشل في تحديث العضوية.');
    }
  }

  async deleteMembership(membershipId: string): Promise<void> {
    try {
      await appwriteClient.databases.deleteDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.MEMBERSHIPS,
        membershipId
      );
    } catch (error) {
      throw new Error('فشل في حذف العضوية.');
    }
  }

  async getGroupMembers(groupId: string): Promise<Membership[]> {
    try {
      const memberships = await appwriteClient.databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.MEMBERSHIPS,
        [
          Query.equal('group_id', [groupId]),
        ]
      );
      
      return memberships.documents.map((membership: any) => ({
        id: membership.$id,
        group_id: membership.group_id,
        user_id: membership.user_id,
        role: membership.role,
        joined_at: membership.joined_at,
      }));
    } catch (error) {
      throw new Error('فشل في تحميل أعضاء المجموعة.');
    }
  }

  async getUserMemberships(userId: string): Promise<Membership[]> {
    try {
      const memberships = await appwriteClient.databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.MEMBERSHIPS,
        [
          Query.equal('user_id', [userId]),
        ]
      );
      
      return memberships.documents.map((membership: any) => ({
        id: membership.$id,
        group_id: membership.group_id,
        user_id: membership.user_id,
        role: membership.role,
        joined_at: membership.joined_at,
      }));
    } catch (error) {
      throw new Error('فشل في تحميل عضوية المستخدم.');
    }
  }

  async addMemberToGroup(userId: string, groupId: string, role: MembershipRole = 'member'): Promise<Membership> {
    try {
      return await this.createMembership({
        user_id: userId,
        group_id: groupId,
        role,
      });
    } catch (error) {
      throw new Error('فشل في إضافة العضو للمجموعة.');
    }
  }

  async removeMemberFromGroup(userId: string, groupId: string): Promise<void> {
    try {
      const memberships = await appwriteClient.databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.MEMBERSHIPS,
        [
          Query.equal('user_id', [userId]),
          Query.equal('group_id', [groupId]),
        ]
      );

      if (memberships.documents.length > 0) {
        await this.deleteMembership(memberships.documents[0].$id);
      }
    } catch (error) {
      throw new Error('فشل في إزالة العضو من المجموعة.');
    }
  }

  async updateMemberRole(membershipId: string, role: MembershipRole): Promise<Membership> {
    try {
      return await this.updateMembership(membershipId, { role });
    } catch (error) {
      throw new Error('فشل في تحديث دور العضو.');
    }
  }

  async promoteToAdmin(membershipId: string): Promise<Membership> {
    try {
      return await this.updateMemberRole(membershipId, 'admin');
    } catch (error) {
      throw new Error('فشل في ترقية العضو إلى مشرف.');
    }
  }

  async demoteToMember(membershipId: string): Promise<Membership> {
    try {
      return await this.updateMemberRole(membershipId, 'member');
    } catch (error) {
      throw new Error('فشل في تخفيض العضو إلى عضو عادي.');
    }
  }

  async isUserMemberOfGroup(userId: string, groupId: string): Promise<boolean> {
    try {
      const memberships = await appwriteClient.databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.MEMBERSHIPS,
        [
          Query.equal('user_id', [userId]),
          Query.equal('group_id', [groupId]),
        ]
      );

      return memberships.documents.length > 0;
    } catch (error) {
      return false;
    }
  }

  async isUserAdminOfGroup(userId: string, groupId: string): Promise<boolean> {
    try {
      const memberships = await appwriteClient.databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.MEMBERSHIPS,
        [
          Query.equal('user_id', [userId]),
          Query.equal('group_id', [groupId]),
          Query.equal('role', ['admin']),
        ]
      );

      return memberships.documents.length > 0;
    } catch (error) {
      return false;
    }
  }

  async getGroupAdmins(groupId: string): Promise<Membership[]> {
    try {
      const memberships = await appwriteClient.databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.MEMBERSHIPS,
        [
          Query.equal('group_id', [groupId]),
          Query.equal('role', ['admin']),
        ]
      );
      
      return memberships.documents.map((membership: any) => ({
        id: membership.$id,
        group_id: membership.group_id,
        user_id: membership.user_id,
        role: membership.role,
        joined_at: membership.joined_at,
      }));
    } catch (error) {
      throw new Error('فشل في تحميل مشرفي المجموعة.');
    }
  }
}

export const membershipsService = new MembershipsService();