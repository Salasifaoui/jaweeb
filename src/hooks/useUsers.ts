import { usersService, type CreateUserData, type UpdateUserData } from '@/src/services/usersService';
import type { User } from '@/src/types';
import { useState } from 'react';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const getUsers = async (): Promise<User[]> => {
    setLoading(true);
    try {
      const userList = await usersService.getUsers();
      setUsers(userList);
      return userList;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getUser = async (userId: string): Promise<User> => {
    try {
      return await usersService.getUser(userId);
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  };

  const createUser = async (userData: CreateUserData): Promise<User> => {
    try {
      const newUser = await usersService.createUser(userData);
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  const updateUser = async (userId: string, userData: UpdateUserData): Promise<User> => {
    try {
      const updatedUser = await usersService.updateUser(userId, userData);
      setUsers(prev => prev.map(user => user.id === userId ? updatedUser : user));
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const deleteUser = async (userId: string): Promise<void> => {
    try {
      await usersService.deleteUser(userId);
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  const searchUsers = async (query: string): Promise<User[]> => {
    try {
      return await usersService.searchUsers(query);
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  };

  const updateUserStatus = async (userId: string, isOnline: boolean): Promise<void> => {
    try {
      await usersService.updateUserStatus(userId, isOnline);
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, isOnline, lastSeen: new Date().toISOString() }
          : user
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  };

  return {
    users,
    loading,
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    searchUsers,
    updateUserStatus,
  };
}
