import { ChatWithMembers } from '@/src/types/chat';
import { useCallback } from 'react';
import { ChatService } from '../service/chatService';
import { useChatStore } from '../store/chatStore';

export const useChat = () => {
  const {
    chats,
    currentChat,
    loading,
    error,
    loadUserChats,
    createChat,
    setCurrentChat,
    subscribeToUserChats,
    unsubscribe,
  } = useChatStore();

  const loadChats = useCallback(async (userId: string) => {
    await loadUserChats(userId);
  }, [loadUserChats]);

  const startChat = useCallback(async (data: {
    name?: string;
    imageUrl?: string;
    is_group: boolean;
    members: string[];
    created_by: string;
  }) => {
    await createChat(data);
  }, [createChat]);

  const selectChat = useCallback((chat: ChatWithMembers | null) => {
    setCurrentChat(chat);
  }, [setCurrentChat]);

  const subscribeToChats = useCallback((userId: string) => {
    subscribeToUserChats(userId);
  }, [subscribeToUserChats]);

  const unsubscribeFromChats = useCallback(() => {
    unsubscribe();
  }, [unsubscribe]);
  const getAllChats = useCallback(async () => {
    const allChats = await ChatService.getAllChats();
    return allChats;
  }, []);

  return {
    // State
    chats,
    currentChat,
    loading,
    error,
    getAllChats,
    // Actions
    loadChats,
    startChat,
    selectChat,
    subscribeToChats,
    unsubscribeFromChats,
  };
};
