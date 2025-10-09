import { useAppwrite } from '@/src/appwrite/AppwriteProvider';
import type { Message } from '@/src/types';
import { APPWRITE_CONFIG, REALTIME_EVENTS } from '@/src/utils/constants';
import { useEffect, useRef } from 'react';

export function useRealtime() {
  const { client } = useAppwrite();
  const subscriptions = useRef<any[]>([]);

  useEffect(() => {
    return () => {
      // Cleanup subscriptions on unmount
      subscriptions.current.forEach(subscription => {
        if (typeof subscription === 'function') {
          subscription();
        }
      });
    };
  }, [client]);

  const subscribeToMessages = (chatId: string, callback: (message: Message) => void) => {
    const channel = `databases.${APPWRITE_CONFIG.DATABASE_ID}.collections.${APPWRITE_CONFIG.COLLECTIONS.MESSAGES}.documents`;
    
    const subscription = client.subscribe([channel], (response: any) => {
      if (response.events.includes(REALTIME_EVENTS.MESSAGE_CREATED)) {
        const payload = response.payload as any;
        const message: Message = {
          id: payload.$id,
          content: payload.content,
          senderId: payload.senderId,
          chatId: payload.chatId,
          createdAt: payload.$createdAt,
          updatedAt: payload.$updatedAt,
          type: payload.type,
          status: payload.status,
          replyTo: payload.replyTo,
          attachments: payload.attachments,
        };
        callback(message);
      }
    });

    subscriptions.current.push(subscription);
    return subscription;
  };

  const subscribeToChatUpdates = (chatId: string, callback: (chat: any) => void) => {
    const channel = `databases.${APPWRITE_CONFIG.DATABASE_ID}.collections.${APPWRITE_CONFIG.COLLECTIONS.CHATS}.documents`;
    
    const subscription = client.subscribe([channel], (response: any) => {
      if (response.events.includes(REALTIME_EVENTS.CHAT_UPDATED) && 
          response.payload.$id === chatId) {
        callback(response.payload);
      }
    });

    subscriptions.current.push(subscription);
    return subscription;
  };

  const subscribeToUserStatus = (callback: (user: any) => void) => {
    const channel = `databases.${APPWRITE_CONFIG.DATABASE_ID}.collections.${APPWRITE_CONFIG.COLLECTIONS.USERS}.documents`;
    
    const subscription = client.subscribe([channel], (response: any) => {
      if (response.events.includes(REALTIME_EVENTS.USER_ONLINE) || 
          response.events.includes(REALTIME_EVENTS.USER_OFFLINE)) {
        callback(response.payload);
      }
    });

    subscriptions.current.push(subscription);
    return subscription;
  };

  const subscribeToTyping = (chatId: string, callback: (typingData: any) => void) => {
    const channel = `chat.${chatId}.typing`;
    
    const subscription = client.subscribe([channel], (response: any) => {
      if (response.events.includes(REALTIME_EVENTS.USER_TYPING)) {
        callback(response.payload);
      }
    });

    subscriptions.current.push(subscription);
    return subscription;
  };

  const unsubscribe = (subscription: any) => {
    // Note: Appwrite client doesn't have a direct unsubscribe method
    // The subscription will be cleaned up when the component unmounts
    subscriptions.current = subscriptions.current.filter(sub => sub !== subscription);
  };

  const unsubscribeAll = () => {
    // Clear all subscriptions from our tracking array
    // The actual cleanup happens on component unmount
    subscriptions.current = [];
  };

  return {
    subscribeToMessages,
    subscribeToChatUpdates,
    subscribeToUserStatus,
    subscribeToTyping,
    unsubscribe,
    unsubscribeAll,
  };
}