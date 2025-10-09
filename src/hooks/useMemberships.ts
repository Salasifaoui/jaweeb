import {
    membershipsService,
    type CreateMembershipData,
    type Membership,
    type UpdateMembershipData
} from '@/src/services/membershipsService';
import { useState } from 'react';

export function useMemberships() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(false);

  const getMemberships = async (): Promise<Membership[]> => {
    setLoading(true);
    try {
      const membershipList = await membershipsService.getMemberships();
      setMemberships(membershipList);
      return membershipList;
    } catch (error) {
      console.error('Error fetching memberships:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getMembership = async (membershipId: string): Promise<Membership> => {
    try {
      return await membershipsService.getMembership(membershipId);
    } catch (error) {
      console.error('Error fetching membership:', error);
      throw error;
    }
  };

  const createMembership = async (membershipData: CreateMembershipData): Promise<Membership> => {
    try {
      const newMembership = await membershipsService.createMembership(membershipData);
      setMemberships(prev => [...prev, newMembership]);
      return newMembership;
    } catch (error) {
      console.error('Error creating membership:', error);
      throw error;
    }
  };

  const updateMembership = async (membershipId: string, membershipData: UpdateMembershipData): Promise<Membership> => {
    try {
      const updatedMembership = await membershipsService.updateMembership(membershipId, membershipData);
      setMemberships(prev => prev.map(membership => 
        membership.id === membershipId ? updatedMembership : membership
      ));
      return updatedMembership;
    } catch (error) {
      console.error('Error updating membership:', error);
      throw error;
    }
  };

  const deleteMembership = async (membershipId: string): Promise<void> => {
    try {
      await membershipsService.deleteMembership(membershipId);
      setMemberships(prev => prev.filter(membership => membership.id !== membershipId));
    } catch (error) {
      console.error('Error deleting membership:', error);
      throw error;
    }
  };

  const getGroupMembers = async (groupId: string): Promise<Membership[]> => {
    try {
      return await membershipsService.getGroupMembers(groupId);
    } catch (error) {
      console.error('Error fetching group members:', error);
      throw error;
    }
  };

  const getUserMemberships = async (userId: string): Promise<Membership[]> => {
    try {
      return await membershipsService.getUserMemberships(userId);
    } catch (error) {
      console.error('Error fetching user memberships:', error);
      throw error;
    }
  };

  const addMemberToGroup = async (userId: string, groupId: string, role: 'admin' | 'moderator' | 'member' = 'member'): Promise<Membership> => {
    try {
      const newMembership = await membershipsService.addMemberToGroup(userId, groupId, role);
      setMemberships(prev => [...prev, newMembership]);
      return newMembership;
    } catch (error) {
      console.error('Error adding member to group:', error);
      throw error;
    }
  };

  const removeMemberFromGroup = async (userId: string, groupId: string): Promise<void> => {
    try {
      await membershipsService.removeMemberFromGroup(userId, groupId);
      setMemberships(prev => prev.filter(membership => 
        !(membership.userId === userId && membership.groupId === groupId)
      ));
    } catch (error) {
      console.error('Error removing member from group:', error);
      throw error;
    }
  };

  const updateMemberRole = async (membershipId: string, role: 'admin' | 'moderator' | 'member'): Promise<Membership> => {
    try {
      const updatedMembership = await membershipsService.updateMemberRole(membershipId, role);
      setMemberships(prev => prev.map(membership => 
        membership.id === membershipId ? updatedMembership : membership
      ));
      return updatedMembership;
    } catch (error) {
      console.error('Error updating member role:', error);
      throw error;
    }
  };

  const banMember = async (membershipId: string): Promise<Membership> => {
    try {
      const updatedMembership = await membershipsService.banMember(membershipId);
      setMemberships(prev => prev.map(membership => 
        membership.id === membershipId ? updatedMembership : membership
      ));
      return updatedMembership;
    } catch (error) {
      console.error('Error banning member:', error);
      throw error;
    }
  };

  const unbanMember = async (membershipId: string): Promise<Membership> => {
    try {
      const updatedMembership = await membershipsService.unbanMember(membershipId);
      setMemberships(prev => prev.map(membership => 
        membership.id === membershipId ? updatedMembership : membership
      ));
      return updatedMembership;
    } catch (error) {
      console.error('Error unbanning member:', error);
      throw error;
    }
  };

  return {
    memberships,
    loading,
    getMemberships,
    getMembership,
    createMembership,
    updateMembership,
    deleteMembership,
    getGroupMembers,
    getUserMemberships,
    addMemberToGroup,
    removeMemberFromGroup,
    updateMemberRole,
    banMember,
    unbanMember,
  };
}
