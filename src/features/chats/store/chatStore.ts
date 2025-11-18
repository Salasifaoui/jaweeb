import { ChatWithMembers, MessageWithSender } from '@/src/types/chat';
import { create } from 'zustand';
import { ChatService } from '../service/chatService';

interface ChatState {
  // State
  chats: ChatWithMembers[];
  currentChat: ChatWithMembers | null;
  messages: MessageWithSender[];
  loading: boolean;
  error: string | null;
  
  // Actions
  setChats: (chats: ChatWithMembers[]) => void;
  setCurrentChat: (chat: ChatWithMembers | null) => void;
  setMessages: (messages: MessageWithSender[]) => void;
  addMessage: (message: MessageWithSender) => void;
  updateMessage: (messageId: string, updates: Partial<MessageWithSender>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Async actions
  loadUserChats: (userId: string) => Promise<void>;
  loadChatMessages: (chatId: string) => Promise<void>;
  sendMessage: (data: {
    chat_id: string;
    sender_id: string;
    content: string;
    file_id?: string;
  }) => Promise<void>;
  createChat: (data: {
    name?: string;
    imageUrl?: string;
    is_group: boolean;
    members: string[];
    created_by: string;
  }) => Promise<void>;
  markMessageAsSeen: (messageId: string, userId: string) => Promise<void>;
  
  // Realtime subscriptions
  subscribeToChat: (chatId: string) => void;
  subscribeToUserChats: (userId: string) => void;
  unsubscribe: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  chats: [],
  currentChat: null,
  messages: [],
  loading: false,
  error: null,
  
  // Basic setters
  setChats: (chats) => set({ chats }),
  setCurrentChat: (chat) => set({ currentChat: chat }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  updateMessage: (messageId, updates) => set((state) => ({
    messages: state.messages.map(msg => 
      msg.$id === messageId ? { ...msg, ...updates } : msg
    )
  })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  // Async actions
  loadUserChats: async (userId) => {
    set({ loading: true, error: null });
    try {
      const chats = await ChatService.getUserChats(userId);
      // TODO: Fetch members data for each chat
      set({ chats: chats as ChatWithMembers[], loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load chats', loading: false });
    }
  },
  
  loadChatMessages: async (chatId) => {
    set({ loading: true, error: null });
    try {
      const messages = await ChatService.getChatMessages(chatId);
      // TODO: Fetch sender data for each message
      set({ messages: messages as MessageWithSender[], loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load messages', loading: false });
    }
  },
  
  sendMessage: async (data) => {
    try {
      const message = await ChatService.sendMessage(data);
      // TODO: Add sender data to message
      get().addMessage(message as MessageWithSender);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to send message' });
    }
  },
  
  createChat: async (data) => {
    set({ loading: true, error: null });
    try {
      const chat = await ChatService.createChat(data);
      // TODO: Add to chats list with members data
      set({ loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create chat', loading: false });
    }
  },
  
  markMessageAsSeen: async (messageId, userId) => {
    try {
      const message = await ChatService.markMessageAsSeen(messageId, userId);
      get().updateMessage(messageId, { seen_by: message.seen_by });
    } catch (error) {
      console.error('Failed to mark message as seen:', error);
    }
  },
  
  // Realtime subscriptions
  subscribeToChat: (chatId) => {
    const unsubscribe = ChatService.subscribeToChat(chatId, (payload) => {
      console.log('Chat updated:', payload);
      // Handle chat updates
    });
    
    const unsubscribeMessages = ChatService.subscribeToChatMessages(chatId, (payload) => {
      console.log('New message:', payload);
      // Handle new messages
      if (payload.events.includes('databases.*.collections.*.documents.*.create')) {
        // TODO: Add new message to state
      }
    });
    
    // Store unsubscribe functions
    set({ 
      // @ts-ignore - storing unsubscribe functions
      unsubscribeChat: unsubscribe,
      unsubscribeMessages: unsubscribeMessages 
    });
  },
  
  subscribeToUserChats: (userId) => {
    const unsubscribe = ChatService.subscribeToUserChats(userId, (payload) => {
      console.log('User chats updated:', payload);
      // Handle user chats updates
      if (payload.events.includes('databases.*.collections.*.documents.*.create')) {
        // TODO: Add new chat to state
      }
    });
    
    // Store unsubscribe function
    set({ 
      // @ts-ignore - storing unsubscribe function
      unsubscribeUserChats: unsubscribe 
    });
  },
  
  unsubscribe: () => {
    const state = get();
    // @ts-ignore - accessing stored unsubscribe functions
    if (state.unsubscribeChat) state.unsubscribeChat();
  },
}));
