import {
    groupsService,
    type CreateGroupData,
    type Group,
    type UpdateGroupData
} from '@/src/services/groupsService';
import { useState } from 'react';

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);

  const getGroups = async (): Promise<Group[]> => {
    setLoading(true);
    try {
      const groupList = await groupsService.getGroups();
      setGroups(groupList);
      return groupList;
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getGroup = async (groupId: string): Promise<Group> => {
    try {
      return await groupsService.getGroup(groupId);
    } catch (error) {
      console.error('Error fetching group:', error);
      throw error;
    }
  };

  const createGroup = async (groupData: CreateGroupData): Promise<Group> => {
    try {
      const newGroup = await groupsService.createGroup(groupData);
      setGroups(prev => [newGroup, ...prev]);
      return newGroup;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  };

  const updateGroup = async (groupId: string, groupData: UpdateGroupData): Promise<Group> => {
    try {
      const updatedGroup = await groupsService.updateGroup(groupId, groupData);
      setGroups(prev => prev.map(group => 
        group.id === groupId ? updatedGroup : group
      ));
      return updatedGroup;
    } catch (error) {
      console.error('Error updating group:', error);
      throw error;
    }
  };

  const deleteGroup = async (groupId: string): Promise<void> => {
    try {
      await groupsService.deleteGroup(groupId);
      setGroups(prev => prev.filter(group => group.id !== groupId));
    } catch (error) {
      console.error('Error deleting group:', error);
      throw error;
    }
  };

  const getUserGroups = async (userId: string): Promise<Group[]> => {
    try {
      return await groupsService.getUserGroups(userId);
    } catch (error) {
      console.error('Error fetching user groups:', error);
      throw error;
    }
  };

  const getPublicGroups = async (): Promise<Group[]> => {
    try {
      return await groupsService.getPublicGroups();
    } catch (error) {
      console.error('Error fetching public groups:', error);
      throw error;
    }
  };

  const searchGroups = async (query: string): Promise<Group[]> => {
    try {
      return await groupsService.searchGroups(query);
    } catch (error) {
      console.error('Error searching groups:', error);
      throw error;
    }
  };

  const updateMemberCount = async (groupId: string, count: number): Promise<Group> => {
    try {
      const updatedGroup = await groupsService.updateMemberCount(groupId, count);
      setGroups(prev => prev.map(group => 
        group.id === groupId ? updatedGroup : group
      ));
      return updatedGroup;
    } catch (error) {
      console.error('Error updating member count:', error);
      throw error;
    }
  };

  const incrementMemberCount = async (groupId: string): Promise<Group> => {
    try {
      const updatedGroup = await groupsService.incrementMemberCount(groupId);
      setGroups(prev => prev.map(group => 
        group.id === groupId ? updatedGroup : group
      ));
      return updatedGroup;
    } catch (error) {
      console.error('Error incrementing member count:', error);
      throw error;
    }
  };

  const decrementMemberCount = async (groupId: string): Promise<Group> => {
    try {
      const updatedGroup = await groupsService.decrementMemberCount(groupId);
      setGroups(prev => prev.map(group => 
        group.id === groupId ? updatedGroup : group
      ));
      return updatedGroup;
    } catch (error) {
      console.error('Error decrementing member count:', error);
      throw error;
    }
  };

  const updateGroupSettings = async (groupId: string, settings: Partial<Group['settings']>): Promise<Group> => {
    try {
      const updatedGroup = await groupsService.updateGroupSettings(groupId, settings);
      setGroups(prev => prev.map(group => 
        group.id === groupId ? updatedGroup : group
      ));
      return updatedGroup;
    } catch (error) {
      console.error('Error updating group settings:', error);
      throw error;
    }
  };

  const createPublicGroup = async (name: string, description?: string, avatar?: string): Promise<Group> => {
    try {
      return await createGroup({
        name,
        description,
        avatar,
        type: 'public',
      });
    } catch (error) {
      console.error('Error creating public group:', error);
      throw error;
    }
  };

  const createPrivateGroup = async (name: string, description?: string, avatar?: string): Promise<Group> => {
    try {
      return await createGroup({
        name,
        description,
        avatar,
        type: 'private',
      });
    } catch (error) {
      console.error('Error creating private group:', error);
      throw error;
    }
  };

  const createSecretGroup = async (name: string, description?: string, avatar?: string): Promise<Group> => {
    try {
      return await createGroup({
        name,
        description,
        avatar,
        type: 'secret',
      });
    } catch (error) {
      console.error('Error creating secret group:', error);
      throw error;
    }
  };

  return {
    groups,
    loading,
    getGroups,
    getGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    getUserGroups,
    getPublicGroups,
    searchGroups,
    updateMemberCount,
    incrementMemberCount,
    decrementMemberCount,
    updateGroupSettings,
    createPublicGroup,
    createPrivateGroup,
    createSecretGroup,
  };
}
