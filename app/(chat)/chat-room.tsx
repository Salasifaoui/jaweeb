import { IconSymbol } from '@/components/ui/icon-symbol';
import { Button } from '@/src/components/Button';
import { InputField } from '@/src/components/InputField';
import { MessageBubble } from '@/src/components/MessageBubble';
import { useChats } from '@/src/hooks/useChats';
import { useGroups } from '@/src/hooks/useGroups';
import { useRealtime } from '@/src/hooks/useRealtime';
import type { Message } from '@/src/types';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

export default function ChatRoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const { getGroup } = useGroups();
  
  const { getMessages, sendMessage } = useChats();
  const { subscribeToMessages } = useRealtime();

  useEffect(() => {
    if (id) {
      loadMessages();
      subscribeToChat();
    }
  }, [id]);

  const loadMessages = async () => {
    try {
      const chatMessages = await getMessages(id);
      setMessages(chatMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToChat = () => {
    subscribeToMessages(id, (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
      // Auto scroll to bottom when new message arrives
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      await sendMessage(id, newMessage.trim());
      loadMessages();
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageBubble
      message={item}
      isOwn={item.senderId === 'current-user-id'} // This should come from auth context
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>جاري تحميل المحادثة...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Button
          variant="text"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <IconSymbol name="chevron.left" size={24} color="#007AFF" />
        </Button>
        <Text style={styles.headerTitle}>المحادثة</Text>
        <Button
          variant="text"
          onPress={() => router.push(`/(profile)/profile?chatId=${id}`)}
          style={styles.moreButton}
        >
          <IconSymbol name="ellipsis" size={24} color="#007AFF" />
        </Button>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={styles.inputContainer}>
        <InputField
          placeholder="اكتب رسالة..."
          value={newMessage}
          onChangeText={setNewMessage}
          style={styles.messageInput}
          multiline
          maxLength={1000}
        />
        <Button
          onPress={handleSendMessage}
          disabled={!newMessage.trim() || sending}
          style={styles.sendButton}
        >
          <IconSymbol 
            name="paperplane.fill" 
            size={20} 
            color={newMessage.trim() ? "#fff" : "#ccc"} 
          />
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 24,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  moreButton: {
    padding: 8,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  messageInput: {
    flex: 1,
    width: '100%',
    marginRight: 12,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
