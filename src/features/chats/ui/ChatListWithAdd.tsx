import { ChatWithMembers } from '@/src/types/chat';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useChat } from '../hooks/useChat';
import { formatLastMessageTime } from '../utils/date';
import { AddChatButton } from './AddChatButton';

interface ChatListWithAddProps {
  userId: string;
  onChatSelect: (chat: ChatWithMembers) => void;
}

export const ChatListWithAdd: React.FC<ChatListWithAddProps> = ({
  userId,
  onChatSelect,
}) => {
  const { chats, loading, error, loadChats, subscribeToChats } = useChat();

  useEffect(() => {
    loadChats(userId);
    subscribeToChats(userId);
    
    return () => {
      // Cleanup subscriptions
    };
  }, [userId, loadChats, subscribeToChats]);

  const handleChatCreated = () => {
    // Reload chats when a new one is created
    loadChats(userId);
  };

  const renderChatItem = ({ item }: { item: ChatWithMembers }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => onChatSelect(item)}
    >
      <View style={styles.avatarContainer}>
        {item.is_group ? (
          <View style={styles.groupAvatar}>
            {item.imageUrl ? (
              <Ionicons name="image" size={24} color="#666" />
            ) : (
              <Ionicons name="people" size={24} color="#666" />
            )}
          </View>
        ) : (
          <View style={styles.avatar}>
            <Ionicons name="person" size={24} color="#666" />
          </View>
        )}
      </View>
      
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName} numberOfLines={1}>
            {item.is_group ? item.name : 'Direct Message'}
          </Text>
          <Text style={styles.lastMessageTime}>
            {item.last_message ? formatLastMessageTime(item.last_message.created_at) : ''}
          </Text>
        </View>
        
        <View style={styles.chatFooter}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.last_message ? item.last_message.content : 'No messages yet'}
          </Text>
          {item.last_message && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>1</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubbles-outline" size={64} color="#C7C7CC" />
      <Text style={styles.emptyTitle}>No chats yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap the + button to start a conversation
      </Text>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.loadingText}>Loading chats...</Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle" size={48} color="#FF3B30" />
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        {renderLoadingState()}
        <AddChatButton userId={userId} onChatCreated={handleChatCreated} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        {renderErrorState()}
        <AddChatButton userId={userId} onChatCreated={handleChatCreated} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.$id}
        renderItem={renderChatItem}
        style={styles.list}
        contentContainerStyle={chats.length === 0 ? styles.emptyListContainer : undefined}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
      <AddChatButton userId={userId} onChatCreated={handleChatCreated} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  list: {
    flex: 1,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  lastMessageTime: {
    fontSize: 12,
    color: '#8E8E93',
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#8E8E93',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8E8E93',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  emptySubtitle: {
    marginTop: 8,
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
});
