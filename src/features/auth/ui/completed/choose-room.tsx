import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { ScreenLayout } from '@/components/ui/screen-layout/screen-layout';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import ButtonAction from '@/src/components/ButtonAction';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView } from 'react-native';

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
        <VStack className="flex-1 py-10" space="xl">
          {/* Header */}
          <VStack className="items-center justify-center" space="sm">
            <Text size="2xl" bold>Choose your rooms</Text>
            <Text size="sm" className="text-muted-foreground text-center">
              Join communities that interest you to start connecting
            </Text>
          </VStack>

          {/* Selected Rooms Summary */}
          {selectedRooms.length > 0 && (
            <Box className="w-full items-center">
              <Text size="sm" className="text-muted-foreground">
                {selectedRooms.length} room{selectedRooms.length !== 1 ? 's' : ''} selected
              </Text>
            </Box>
          )}

          {/* Room Categories */}
          <VStack className="w-full" space="lg">
            {roomCategories.map((category) => (
              <Box key={category.id} className="w-full">
                <VStack space="sm">
                  {/* Category Header */}
                  <HStack className="items-center" space="sm">
                    <Text size="lg">{category.emoji}</Text>
                    <VStack space="xs">
                      <Text size="lg" bold>{category.title}</Text>
                      <Text size="sm" className="text-muted-foreground">
                        {category.description}
                      </Text>
                    </VStack>
                  </HStack>
                  
                  {/* Rooms Grid */}
                  <Box className="flex-row flex-wrap gap-2">
                    {category.rooms.map((room) => (
                      <Pressable
                        key={room.id}
                        className={`p-3 rounded-lg border items-center justify-center min-w-[120px] ${
                          selectedRooms.includes(room.id) 
                            ? 'bg-primary-500 border-primary-500' 
                            : 'bg-background-0 border-outline-200'
                        }`}
                        onPress={() => toggleRoom(room.id)}
                      >
                        <VStack className="items-center" space="xs">
                          <Text 
                            size="sm" 
                            className={selectedRooms.includes(room.id) ? 'text-white' : 'text-typography-700'}
                            bold
                          >
                            {room.name}
                          </Text>
                          <Text 
                            size="xs" 
                            className={selectedRooms.includes(room.id) ? 'text-white/80' : 'text-muted-foreground'}
                          >
                            {room.members} members
                          </Text>
                          {selectedRooms.includes(room.id) && (
                            <Text size="sm" className="text-white">✓</Text>
                          )}
                        </VStack>
                      </Pressable>
                    ))}
                  </Box>
                </VStack>
              </Box>
            ))}
          </VStack>

          {/* Action Buttons */}
          <VStack className="w-full mb-4" space="sm">
            <ButtonAction
              text="Start Chatting"
              onPress={handleStart}
              action="primary"
              variant="solid"
            />
            <ButtonAction
              text="Skip for now"
              onPress={handleSkip}
              action="secondary"
              variant="outline"
            />
          </VStack>
        </VStack>
      </ScrollView>
    </ScreenLayout>
  );
}
