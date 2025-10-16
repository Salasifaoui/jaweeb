import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/src/components/Button';
import { THEME } from '@/src/theme/theme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';

export function ChooseRoomPage() {
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const colorScheme = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const styles = createStyles(theme);
  const roomCategories = [
    {
      id: 'gaming',
      title: 'Gaming',
      emoji: '🎮',
      description: 'Connect with fellow gamers',
      rooms: [
        { id: 'general-gaming', name: 'General Gaming', members: '2.3k' },
        { id: 'fortnite', name: 'Fortnite', members: '1.8k' },
        { id: 'valorant', name: 'Valorant', members: '1.2k' },
        { id: 'minecraft', name: 'Minecraft', members: '956' },
      ]
    },
    {
      id: 'music',
      title: 'Music',
      emoji: '🎵',
      description: 'Share your favorite tunes',
      rooms: [
        { id: 'pop-music', name: 'Pop Music', members: '3.1k' },
        { id: 'hip-hop', name: 'Hip Hop', members: '2.7k' },
        { id: 'rock', name: 'Rock', members: '1.9k' },
        { id: 'electronic', name: 'Electronic', members: '1.4k' },
      ]
    },
    {
      id: 'lifestyle',
      title: 'Lifestyle',
      emoji: '🌟',
      description: 'Daily life and experiences',
      rooms: [
        { id: 'fitness', name: 'Fitness & Health', members: '2.8k' },
        { id: 'food', name: 'Food & Cooking', members: '2.1k' },
        { id: 'travel', name: 'Travel', members: '1.7k' },
        { id: 'fashion', name: 'Fashion', members: '1.5k' },
      ]
    },
    {
      id: 'tech',
      title: 'Technology',
      emoji: '💻',
      description: 'Tech enthusiasts unite',
      rooms: [
        { id: 'programming', name: 'Programming', members: '2.9k' },
        { id: 'ai', name: 'AI & Machine Learning', members: '1.8k' },
        { id: 'gadgets', name: 'Gadgets', members: '1.3k' },
        { id: 'startups', name: 'Startups', members: '987' },
      ]
    },
  ];

  const toggleRoom = (roomId: string) => {
    setSelectedRooms(prev => 
      prev.includes(roomId) 
        ? prev.filter(id => id !== roomId)
        : [...prev, roomId]
    );
  };

  const handleStart = () => {
    if (selectedRooms.length === 0) {
      Alert.alert(
        'No Rooms Selected',
        'Please select at least one room to get started, or you can skip and explore later.',
        [
          { text: 'OK', style: 'default' }
        ]
      );
      return;
    }

    // Save selected rooms and complete onboarding
    console.log('Selected Rooms:', selectedRooms);
    
    // Navigate to main app
    router.replace('/(tabs)');
  };

  const handleSkip = () => {
    // Complete onboarding without selecting rooms
    router.replace('/(tabs)');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText style={styles.title}>Choose your rooms</ThemedText>
            <ThemedText style={styles.subtitle}>
              Join communities that interest you to start connecting
            </ThemedText>
          </View>

          {/* Selected Rooms Summary */}
          {selectedRooms.length > 0 && (
            <View style={styles.selectedSummary}>
              <ThemedText style={styles.selectedCount}>
                {selectedRooms.length} room{selectedRooms.length !== 1 ? 's' : ''} selected
              </ThemedText>
            </View>
          )}

          {/* Room Categories */}
          {roomCategories.map((category) => (
            <View key={category.id} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <ThemedText style={styles.categoryEmoji}>{category.emoji}</ThemedText>
                <View style={styles.categoryInfo}>
                  <ThemedText style={styles.categoryTitle}>{category.title}</ThemedText>
                  <ThemedText style={styles.categoryDescription}>{category.description}</ThemedText>
                </View>
              </View>
              
              <View style={styles.roomsContainer}>
                {category.rooms.map((room) => (
                  <TouchableOpacity
                    key={room.id}
                    style={[
                      styles.roomOption,
                      selectedRooms.includes(room.id) && styles.selectedRoomOption,
                    ]}
                    onPress={() => toggleRoom(room.id)}
                  >
                    <View style={styles.roomInfo}>
                      <ThemedText
                        style={[
                          styles.roomName,
                          selectedRooms.includes(room.id) && styles.selectedRoomName,
                        ]}
                      >
                        {room.name}
                      </ThemedText>
                      <ThemedText
                        style={[
                          styles.roomMembers,
                          selectedRooms.includes(room.id) && styles.selectedRoomMembers,
                        ]}
                      >
                        {room.members} members
                      </ThemedText>
                    </View>
                    <View style={[
                      styles.roomCheckbox,
                      selectedRooms.includes(room.id) && styles.selectedRoomCheckbox,
                    ]}>
                      {selectedRooms.includes(room.id) && (
                        <ThemedText style={styles.checkmark}>✓</ThemedText>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* Action Buttons */}
          <View style={styles.buttonSection}>
            <Button
              title="Start Chatting"
              onPress={handleStart}
              variant="primary"
              size="large"
              style={styles.startButton}
            />
            <Button
              title="Skip for now"
              onPress={handleSkip}
              variant="text"
              size="large"
              style={styles.skipButton}
            />
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const createStyles = (theme: typeof THEME.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: theme.foreground,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.mutedForeground,
    textAlign: 'center',
    lineHeight: 24,
  },
  selectedSummary: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.primary,
  },
  selectedCount: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.primaryForeground,
    textAlign: 'center',
  },
  categorySection: {
    marginBottom: 32,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.foreground,
    marginBottom: 2,
  },
  categoryDescription: {
    fontSize: 14,
    color: theme.mutedForeground,
  },
  roomsContainer: {
    gap: 8,
  },
  roomOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedRoomOption: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.foreground,
    marginBottom: 2,
  },
  selectedRoomName: {
    color: '#fff',
  },
  roomMembers: {
    fontSize: 14,
    color: theme.mutedForeground,
  },
  selectedRoomMembers: {
    color: theme.primaryForeground,
    opacity: 0.8,
  },
  roomCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRoomCheckbox: {
    backgroundColor: theme.primaryForeground,
    borderColor: theme.primaryForeground,
  },
  checkmark: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.primary,
  },
  buttonSection: {
    marginTop: 20,
  },
  startButton: {
    backgroundColor: theme.primary,
    marginBottom: 12,
  },
  skipButton: {
    backgroundColor: 'transparent',
  },
});
