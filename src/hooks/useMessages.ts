import {
    messagesService,
    type CreateMessageData,
    type UpdateMessageData
} from '@/src/services/messagesService';
import type { Message } from '@/src/types';
import { useState } from 'react';

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const getMessages = async (): Promise<Message[]> => {
    setLoading(true);
    try {
      const messageList = await messagesService.getMessages();
      setMessages(messageList);
      return messageList;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getMessage = async (messageId: string): Promise<Message> => {
    try {
      return await messagesService.getMessage(messageId);
    } catch (error) {
      console.error('Error fetching message:', error);
      throw error;
    }
  };

  const createMessage = async (messageData: CreateMessageData): Promise<Message> => {
    try {
      const newMessage = await messagesService.createMessage(messageData);
      setMessages(prev => [newMessage, ...prev]);
      return newMessage;
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  };

  const updateMessage = async (messageId: string, messageData: UpdateMessageData): Promise<Message> => {
    try {
      const updatedMessage = await messagesService.updateMessage(messageId, messageData);
      setMessages(prev => prev.map(message => 
        message.id === messageId ? updatedMessage : message
      ));
      return updatedMessage;
    } catch (error) {
      console.error('Error updating message:', error);
      throw error;
    }
  };

  const deleteMessage = async (messageId: string): Promise<void> => {
    try {
      await messagesService.deleteMessage(messageId);
      setMessages(prev => prev.filter(message => message.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  };

  const getGroupMessages = async (groupId: string, limit: number = 50, offset: number = 0): Promise<Message[]> => {
    try {
      return await messagesService.getGroupMessages(groupId, limit, offset);
    } catch (error) {
      console.error('Error fetching group messages:', error);
      throw error;
    }
  };

  const getUserMessages = async (userId: string): Promise<Message[]> => {
    try {
      return await messagesService.getUserMessages(userId);
    } catch (error) {
      console.error('Error fetching user messages:', error);
      throw error;
    }
  };

  const markMessageAsRead = async (messageId: string): Promise<Message> => {
    try {
      const updatedMessage = await messagesService.markMessageAsRead(messageId);
      setMessages(prev => prev.map(message => 
        message.id === messageId ? updatedMessage : message
      ));
      return updatedMessage;
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  };

  const markMessageAsDelivered = async (messageId: string): Promise<Message> => {
    try {
      const updatedMessage = await messagesService.markMessageAsDelivered(messageId);
      setMessages(prev => prev.map(message => 
        message.id === messageId ? updatedMessage : message
      ));
      return updatedMessage;
    } catch (error) {
      console.error('Error marking message as delivered:', error);
      throw error;
    }
  };

  const searchMessages = async (query: string, groupId?: string): Promise<Message[]> => {
    try {
      return await messagesService.searchMessages(query, groupId);
    } catch (error) {
      console.error('Error searching messages:', error);
      throw error;
    }
  };

  const deleteUserMessages = async (userId: string): Promise<void> => {
    try {
      await messagesService.deleteUserMessages(userId);
      setMessages(prev => prev.filter(message => message.senderId !== userId));
    } catch (error) {
      console.error('Error deleting user messages:', error);
      throw error;
    }
  };

  const deleteGroupMessages = async (groupId: string): Promise<void> => {
    try {
      await messagesService.deleteGroupMessages(groupId);
      setMessages(prev => prev.filter(message => message.chatId !== groupId));
    } catch (error) {
      console.error('Error deleting group messages:', error);
      throw error;
    }
  };

  const sendTextMessage = async (content: string, senderId: string, groupId: string, replyTo?: string): Promise<Message> => {
    try {
      return await createMessage({
        content,
        senderId,
        groupId,
        type: 'text',
        replyTo,
      });
    } catch (error) {
      console.error('Error sending text message:', error);
      throw error;
    }
  };

  const sendFileMessage = async (content: string, senderId: string, groupId: string, attachments: string[], replyTo?: string): Promise<Message> => {
    try {
      return await createMessage({
        content,
        senderId,
        groupId,
        type: 'file',
        attachments,
        replyTo,
      });
    } catch (error) {
      console.error('Error sending file message:', error);
      throw error;
    }
  };

  return {
    messages,
    loading,
    getMessages,
    getMessage,
    createMessage,
    updateMessage,
    deleteMessage,
    getGroupMessages,
    getUserMessages,
    markMessageAsRead,
    markMessageAsDelivered,
    searchMessages,
    deleteUserMessages,
    deleteGroupMessages,
    sendTextMessage,
    sendFileMessage,
  };
}
