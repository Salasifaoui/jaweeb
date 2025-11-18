import { Pressable } from '@/components/ui/pressable';
import { ScreenLayout } from '@/components/ui/screen-layout/screen-layout';
import { Text } from '@/components/ui/text';
import { Button } from '@/src/components/Button';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

export function ChooseRoomPage() {
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
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
    <ScreenLayout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-1">
          {/* Header */}
          <View className="flex-row items-center gap-2">
            <Text className="text-sm text-muted-foreground">Choose your rooms</Text>
            <Text className="text-sm text-muted-foreground">Join communities that interest you to start connecting</Text>
          </View>

          {/* Selected Rooms Summary */}
          {selectedRooms.length > 0 && (
            <View className="flex-row items-center gap-2">
              <Text className="text-sm text-muted-foreground">
                {selectedRooms.length} room{selectedRooms.length !== 1 ? 's' : ''} selected
              </Text>
            </View>
          )}

          {/* Room Categories */}
          {roomCategories.map((category) => (
            <View key={category.id} className="flex-row items-center gap-2">
              <View className="flex-row items-center gap-2">
                <Text className="text-sm text-muted-foreground">{category.emoji}</Text>
                <View className="flex-row items-center gap-2">
                  <Text className="text-sm text-muted-foreground">{category.title}</Text>
                  <Text className="text-sm text-muted-foreground">{category.description}</Text>
                </View>
              </View>
              
              <View className="flex-row items-center gap-2">
                {category.rooms.map((room) => (
                  <Pressable
                    key={room.id}
                    className={`flex-row items-center gap-2 ${selectedRooms.includes(room.id) ? 'bg-primary-500' : ''}`}
                   
                    onPress={() => toggleRoom(room.id)}
                  >
                    <View className="flex-row items-center gap-2">
                      <Text className="text-sm text-muted-foreground">{room.name}</Text>
                      <Text className="text-sm text-muted-foreground">{room.members} members</Text>
                    </View>
                    <View className={`flex-row items-center gap-2 ${selectedRooms.includes(room.id) ? 'bg-primary-500' : ''}`}
                    >
                      {selectedRooms.includes(room.id) && (
                        <Text className="text-sm text-muted-foreground">✓</Text>
                      )}
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          ))}

          {/* Action Buttons */}
          <View className="flex-row items-center gap-2">
            <Button
              title="Start Chatting"
              onPress={handleStart}
              variant="primary"
              size="large"
            />
            <Button
              title="Skip for now"
              onPress={handleSkip}
              variant="text"
              size="large"
            />
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}
