import type { Chat, Message } from '@/src/types';
import { create } from 'zustand';

interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  messages: { [chatId: string]: Message[] };
  loading: boolean;
  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  updateChat: (chatId: string, updates: Partial<Chat>) => void;
  removeChat: (chatId: string) => void;
  setCurrentChat: (chat: Chat | null) => void;
  setMessages: (chatId: string, messages: Message[]) => void;
  addMessage: (chatId: string, message: Message) => void;
  updateMessage: (chatId: string, messageId: string, updates: Partial<Message>) => void;
  removeMessage: (chatId: string, messageId: string) => void;
  setLoading: (loading: boolean) => void;
  clearChats: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  currentChat: null,
  messages: {},
  loading: false,
  
  setChats: (chats) => set({ chats }),
  
  addChat: (chat) => set((state) => ({
    chats: [chat, ...state.chats]
  })),
  
  updateChat: (chatId, updates) => set((state) => ({
    chats: state.chats.map(chat => 
      chat.id === chatId ? { ...chat, ...updates } : chat
    ),
    currentChat: state.currentChat?.id === chatId 
      ? { ...state.currentChat, ...updates }
      : state.currentChat
  })),
  
  removeChat: (chatId) => set((state) => ({
    chats: state.chats.filter(chat => chat.id !== chatId),
    currentChat: state.currentChat?.id === chatId ? null : state.currentChat,
    messages: Object.fromEntries(
      Object.entries(state.messages).filter(([id]) => id !== chatId)
    )
  })),
  
  setCurrentChat: (chat) => set({ currentChat: chat }),
  
  setMessages: (chatId, messages) => set((state) => ({
    messages: {
      ...state.messages,
      [chatId]: messages
    }
  })),
  
  addMessage: (chatId, message) => set((state) => ({
    messages: {
      ...state.messages,
      [chatId]: [...(state.messages[chatId] || []), message]
    }
  })),
  
  updateMessage: (chatId, messageId, updates) => set((state) => ({
    messages: {
      ...state.messages,
      [chatId]: (state.messages[chatId] || []).map(message =>
        message.id === messageId ? { ...message, ...updates } : message
      )
    }
  })),
  
  removeMessage: (chatId, messageId) => set((state) => ({
    messages: {
      ...state.messages,
      [chatId]: (state.messages[chatId] || []).filter(message => message.id !== messageId)
    }
  })),
  
  setLoading: (loading) => set({ loading }),
  
  clearChats: () => set({
    chats: [],
    currentChat: null,
    messages: {}
  }),
}));
