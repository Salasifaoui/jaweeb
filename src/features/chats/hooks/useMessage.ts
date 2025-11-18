import { MessageWithSender } from '@/src/types/chat';
import { useCallback } from 'react';
import { useChatStore } from '../store/chatStore';

export const useMessage = () => {
  const {
    messages,
    loading,
    error,
    loadChatMessages,
    sendMessage,
    addMessage,
    updateMessage,
    markMessageAsSeen,
    subscribeToChat,
    unsubscribe,
  } = useChatStore();

  const loadMessages = useCallback(async (chatId: string) => {
    await loadChatMessages(chatId);
  }, [loadChatMessages]);

  const sendNewMessage = useCallback(async (data: {
    chat_id: string;
    sender_id: string;
    content: string;
    file_id?: string;
  }) => {
    await sendMessage(data);
  }, [sendMessage]);

  const markAsSeen = useCallback(async (messageId: string, userId: string) => {
    await markMessageAsSeen(messageId, userId);
  }, [markMessageAsSeen]);

  const subscribeToMessages = useCallback((chatId: string) => {
    subscribeToChat(chatId);
  }, [subscribeToChat]);

  const unsubscribeFromMessages = useCallback(() => {
    unsubscribe();
  }, [unsubscribe]);

  const addNewMessage = useCallback((message: MessageWithSender) => {
    addMessage(message);
  }, [addMessage]);

  const updateExistingMessage = useCallback((messageId: string, updates: Partial<MessageWithSender>) => {
    updateMessage(messageId, updates);
  }, [updateMessage]);

  return {
    // State
    messages,
    loading,
    error,
    
    // Actions
    loadMessages,
    sendNewMessage,
    markAsSeen,
    subscribeToMessages,
    unsubscribeFromMessages,
    addNewMessage,
    updateExistingMessage,
  };
};
