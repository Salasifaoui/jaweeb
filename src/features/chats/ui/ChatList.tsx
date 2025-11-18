import { Chat, ChatWithMembers } from '@/src/types/chat';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useChat } from '../hooks/useChat';

interface ChatListProps {
  userId: string;
  onChatSelect: (chat: ChatWithMembers) => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  userId,
  onChatSelect,
}) => {
  const { loading, error, getAllChats } = useChat();
  const [allChats, setAllChats] = useState<Chat[]>([]);

  useEffect(() => {
    const fetchAllChats = async () => {
      const allChats = await getAllChats();
      setAllChats(allChats);
    };
    fetchAllChats();
  }, [getAllChats]);
  
  console.log('ChatList allChats', JSON.stringify(allChats, null, 2));
  const renderChatItem = ({ item, index }: { item: ChatWithMembers; index: number }) => {
    // Add special tiles for Multi-Guests and gift box
    const isMultiGuests = index === allChats.length - 2;
    const isGiftBox = index === allChats.length - 1;
    
    
    if (isMultiGuests) {
      return (
        <TouchableOpacity style={styles.chatItem}>
          <View style={styles.imageContainer}>
            <View style={[styles.avatar, { backgroundColor: '#228B22' }]}>
              <Text style={styles.plantIcon}>🌿</Text>
            </View>
            <View style={styles.overlayContainer}>
              <View style={styles.multiGuestsBadge}>
                <Ionicons name="grid" size={12} color="white" />
                <Text style={styles.badgeText}>Multi-Guests</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    
    if (isGiftBox) {
      return (
        <TouchableOpacity style={styles.chatItem}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.avatar}
            />
            <View style={styles.overlayContainer}>
              <View style={styles.giftBoxBadge}>
                <Ionicons name="gift" size={16} color="white" />
                <Ionicons name="checkmark" size={12} color="white" style={styles.checkmark} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    
    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => onChatSelect(item)}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.avatar}
          />
          
          {/* Overlay badges */}
          <View style={styles.overlayContainer}>
            {/* Magnifying glass badge with number */}
            <View style={styles.magnifyBadge}>
              <Ionicons name="search" size={12} color="white" />
              <Text style={styles.badgeText}>20</Text>
            </View>
            
            {/* Gender symbol */}
            <View style={styles.genderBadge}>
              <Ionicons name="male" size={16} color="white" />
            </View>
            
            {/* Fruit icon */}
            <View style={styles.fruitBadge}>
              <Text style={styles.fruitIcon}>🍇</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading chats...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#FF3B30" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (allChats.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="chatbubbles-outline" size={64} color="#C7C7CC" />
        <Text style={styles.emptyTitle}>No chats yet</Text>
        <Text style={styles.emptySubtitle}>
          Start a conversation with someone
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={allChats as unknown as ChatWithMembers[]}
      keyExtractor={(item) => item.$id}
      renderItem={renderChatItem}
      style={styles.list}
      showsVerticalScrollIndicator={false}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
    />
  );
};

const { width } = Dimensions.get('window');
const itemSize = (width - 58) / 2; // 2 columns with padding

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    // paddingHorizontal: 16,
  },
  chatItem: {
    width: itemSize,
    height: itemSize,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    backgroundColor: '#E5E5EA',
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  magnifyBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: '#FF69B4',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  genderBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#87CEEB',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fruitBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fruitIcon: {
    fontSize: 16,
  },
  plantIcon: {
    fontSize: 32,
  },
  multiGuestsBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  giftBoxBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  checkmark: {
    position: 'absolute',
    top: -2,
    right: -2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#FFFFFF',
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
  columnWrapper: {
    gap: 16,
  },
});
