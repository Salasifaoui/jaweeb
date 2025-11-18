import { IconsList } from '@/components/icons/icons';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { ScreenLayout } from '@/components/ui/screen-layout/screen-layout';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { APP_NAME } from '@/constants/variables';
import AppleSignInButton from '@/src/components/AppleSignInButton';
import EmailSignInButton from '@/src/components/EmailSignInButton';
import GoogleSignInButton from '@/src/components/GoogleSignInButton';
import { router } from 'expo-router';
import React from 'react';
import {
  Alert,
  Linking
} from 'react-native';
export function AuthModal() {

  const handleEmailSignIn = () => {
    // Navigate to phone sign in
    router.replace('/(auth)/login');
  };

  const handleGoogleSignIn = () => {
    Alert.alert('Google sign in pressed');
  };

  const handleAppleSignIn = () => {
    Alert.alert('Apple sign in pressed');
  };

  const handleFacebookSignIn = () => {
    // Navigate to onboarding flow after successful sign in
    Alert.alert('Facebook sign in pressed');
  };

  const handleTwitterSignIn = () => {
    Alert.alert('Twitter sign in pressed');
  };

  const handleVKSignIn = () => {
    // Implement VK sign in
    console.log('VK sign in pressed');
    // Navigate to onboarding flow after successful sign in
    Alert.alert('VK sign in pressed');
  };

  const handleTermsOfUse = () => {
    Linking.openURL('https://example.com/terms');
  };

  const handleBroadcasterAgreement = () => {
    Linking.openURL('https://example.com/broadcaster-agreement');
  };

  const handlePrivacyPolicy = () => {
    // Open privacy policy
    Linking.openURL('https://example.com/privacy');
  };

  const handleZixDev = () => {
    // Open ZixDev
    Linking.openURL('https://zixdev.com');
  };

  return (
      <ScreenLayout>
        <VStack className="flex-1 gap-4 justify-center">

        
        {/* Logo Section */}
        <HStack className=" items-center justify-center">
          <IconsList.jaweeb width={40} height={40} />
          <Text className="text-2xl font-bold">{APP_NAME}</Text>
        </HStack>

        {/* Main Content */}
        <VStack className="gap-4 items-center justify-center  ">
          <Text className="text-lg font-bold">
            Sign in to experience complete functions
          </Text>

          {/* Primary Sign In Buttons */}
          <VStack className="items-center gap-4">
            <GoogleSignInButton onPress={handleGoogleSignIn} />

            <EmailSignInButton onPress={handleEmailSignIn} />

            <AppleSignInButton onPress={handleAppleSignIn} />
            
          </VStack>

          {/* OR Separator */}
          <VStack className="items-center gap-2">
            <Text className="text-lg font-bold">OR</Text>
          </VStack>

          {/* Social Media Icons */}
          <HStack className="items-center gap-5">
            <Pressable className="flex-row items-center" onPress={handleFacebookSignIn}>
              <IconsList.facebook width={24} height={24} />
            </Pressable>

            <Pressable className="flex-row items-center" onPress={handleTwitterSignIn}>
              <IconsList.instagram width={24} height={24} />
            </Pressable>

            <Pressable className="flex-row items-center" onPress={handleVKSignIn}>
              <IconsList.tiktok width={24} height={24} />
            </Pressable>
          </HStack>

          
      
        </VStack>

        
        </VStack>
        {/* Legal Text */}
        <VStack className="justify-center items-center gap-6 pb-11">
            <HStack className="items-center gap-2">
            <Text className="text-lg font-bold">
            By continuing, you agree to our{' '}
            </Text>
              <Pressable className="items-center" onPress={handleTermsOfUse}>
                <Text className="text-lg font-bold text-primary-500">Terms of use</Text>
              </Pressable>
              </HStack>
              <HStack className="items-center gap-2">
              <Pressable className="items-center" onPress={handleBroadcasterAgreement}>
                <Text className="text-lg font-bold text-primary-500">Broadcaster Agreement</Text>
              </Pressable>
              <Text className="text-lg font-bold">
            and
            </Text>
            <Pressable className="items-center" onPress={handlePrivacyPolicy}>
                <Text className="text-lg font-bold text-primary-500">Privacy Policy</Text>
              </Pressable>
            </HStack>
            <HStack className="items-center justify-center gap-2">
            
              <Text className="text-sm font-bold">
              powered by
              </Text>
              <Pressable className="items-center" onPress={handleZixDev}>
                  <Text className="text-sm font-bold text-primary-500">ZixDev</Text>
                </Pressable>
            </HStack>
          </VStack>
      </ScreenLayout>

  );
}
