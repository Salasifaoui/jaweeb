import { chatService } from '@/src/services/chatService';
import type { Chat, CreateGroupData, Message, UpdateGroupData, User } from '@/src/types';
import { useState } from 'react';

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);

  const getChats = async (): Promise<Chat[]> => {
    setLoading(true);
    try {
      const userChats = await chatService.getChats();
      setChats(userChats);
      return userChats;
    } catch (error) {
      console.error('Error fetching chats:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getChat = async (chatId: string): Promise<Chat> => {
    try {
      return await chatService.getChat(chatId);
    } catch (error) {
      console.error('Error fetching chat:', error);
      throw error;
    }
  };

  const createGroup = async (groupData: CreateGroupData): Promise<string> => {
    try {
      const chatId = await chatService.createGroup(groupData);
      await getChats(); // Refresh chats list
      return chatId;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  };

  const updateGroup = async (chatId: string, updateData: UpdateGroupData): Promise<void> => {
    try {
      await chatService.updateGroup(chatId, updateData);
      await getChats(); // Refresh chats list
    } catch (error) {
      console.error('Error updating group:', error);
      throw error;
    }
  };

  const deleteChat = async (chatId: string): Promise<void> => {
    try {
      await chatService.deleteChat(chatId);
      setChats(prev => prev.filter(chat => chat.id !== chatId));
    } catch (error) {
      console.error('Error deleting chat:', error);
      throw error;
    }
  };

  const addMember = async (chatId: string, userId: string): Promise<void> => {
    try {
      await chatService.addMember(chatId, userId);
      await getChats(); // Refresh chats list
    } catch (error) {
      console.error('Error adding member:', error);
      throw error;
    }
  };

  const removeMember = async (chatId: string, userId: string): Promise<void> => {
    try {
      await chatService.removeMember(chatId, userId);
      await getChats(); // Refresh chats list
    } catch (error) {
      console.error('Error removing member:', error);
      throw error;
    }
  };

  const getMessages = async (chatId: string): Promise<Message[]> => {
    try {
      return await chatService.getMessages(chatId);
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  };

  const sendMessage = async (chatId: string, content: string): Promise<Message> => {
    try {
      const message = await chatService.sendMessage(chatId, content);
      await getChats(); // Refresh chats list to update last message
      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const getUsers = async (): Promise<User[]> => {
    try {
      return await chatService.getUsers();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };

  const getChatInfo = async (chatId: string): Promise<Chat> => {
    try {
      return await chatService.getChat(chatId);
    } catch (error) {
      console.error('Error fetching chat info:', error);
      throw error;
    }
  };

  return {
    chats,
    loading,
    getChats,
    getChat,
    createGroup,
    updateGroup,
    deleteChat,
    addMember,
    removeMember,
    getMessages,
    sendMessage,
    getUsers,
    getChatInfo,
  };
}
