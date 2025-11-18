import { IconsList } from '@/components/icons/icons';
import { ScreenLayout } from '@/components/ui/screen-layout/screen-layout';
import { Text } from '@/components/ui/text';
import { UserAvatar } from '@/components/ui/user-avatar/user-avatar';
import { APP_NAME } from '@/constants/variables';
import { ListAvatars } from '@/src/components/list-avatars/list-avatars';
import { useCompletedProfile } from '@/src/features/profile/hooks';
import { useUserService } from '@/src/features/profile/hooks/userProfile';

import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import ButtonAction from '@/src/components/ButtonAction';
import { router } from 'expo-router';
import { ChevronDownCircle, ChevronUpCircle } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
export  function WelcomePage() {
  const { user } = useAuth();
  const {userProfile: profile} = useUserService(user?.userId || '');
  const { checkProfileCompletion, getNextIncompleteScreen } = useCompletedProfile();
  const [isOpen, setIsOpen] = useState(false);

  // Check profile completion on component mount
  useEffect(() => {
    if (profile) {
      const completionStatus = checkProfileCompletion(profile);
      if (completionStatus.isCompleted) {
        router.push('/(tabs)');
      }
    }
  }, []);

  const handleNext = () => {
    if (profile) {
      const nextScreen = getNextIncompleteScreen(profile);
      if (nextScreen) {
        router.push(nextScreen as any);
      } else {
        // If profile is complete, go to main app
        router.push('/(tabs)');
      }
    } else {
      // Default fallback
      router.push('/(auth)/complated/gender-birth');
    }
  };

  return (
    <ScreenLayout>
      <VStack className="flex-1 items-center justify-between py-10">
        {/* Logo Section */}
        <HStack className=" items-center gap-2">
          <IconsList.jaweeb width={80} height={80} />
          <Text className="text-2xl font-bold">{APP_NAME}</Text>
        </HStack>

        {/* Welcome Content */}
        <VStack className="items-center justify-center gap-2">
          <Text className="text-2xl font-bold">Welcome to {APP_NAME}!</Text>
          <Text className="text-sm text-muted-foreground text-center">
            Let&apos;s get you set up with a few quick steps to personalize your experience.
          </Text>
        </VStack>
         <VStack className=" items-center gap-2">
           <UserAvatar 
             user={profile} 
             size={100} 
             showInitials={true}
           />
           <HStack className=" items-center gap-2">
            <Text className="text-sm text-muted-foreground">Select your avatar or upload a new one</Text>
           
           {!isOpen ? (
            <TouchableOpacity
              onPress={() => setIsOpen(true)}
            >
              <ChevronDownCircle
                size={20}
                color="white"
                fill="#007AFF"
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setIsOpen(false)}
            >
              <ChevronUpCircle
                size={20}
                color="white"
                fill="#007AFF"
              />
            </TouchableOpacity>
          )}
          </HStack>
          
         </VStack>
         {isOpen && <ListAvatars userProfile={profile} setShowGallery={setIsOpen} />}
        {/* Features List */}
        <VStack className=" items-center gap-3">
          <View className="flex-row items-center gap-2">
            <Text className="text-sm text-muted-foreground">🎯 Connect with like-minded people</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-sm text-muted-foreground">💬 Join exciting chat rooms</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-sm text-muted-foreground">🌟 Discover new communities</Text>
          </View>
        </VStack>

        {/* Next Button */}
        
      </VStack>
      <HStack className=" items-center gap-2 justify-center pb-10">
          <ButtonAction
            text="Get Started"
            onPress={handleNext}
            action="primary"
            variant="solid"
          />
        </HStack>
    </ScreenLayout>
  );
}
