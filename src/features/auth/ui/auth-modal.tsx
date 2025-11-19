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
        <VStack className="flex-1 justify-center" space="lg">

        
        {/* Logo Section */}
        <HStack className="items-center justify-center">
          <IconsList.jaweeb width={40} height={40} />
          <Text size="2xl" bold>{APP_NAME}</Text>
        </HStack>

        {/* Main Content */}
        <VStack className="items-center justify-center" space="lg">
          <Text size="lg" bold>
            Sign in to experience complete functions
          </Text>

          {/* Primary Sign In Buttons */}
          <VStack className="items-center" space="lg">
            <GoogleSignInButton onPress={handleGoogleSignIn} />

            <EmailSignInButton onPress={handleEmailSignIn} />

            <AppleSignInButton onPress={handleAppleSignIn} />
            
          </VStack>

          {/* OR Separator */}
          <VStack className="items-center" space="sm">
            <Text size="lg" bold>OR</Text>
          </VStack>

          {/* Social Media Icons */}
          <HStack className="items-center" space="xl">
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
        <VStack className="justify-center items-center pb-11" space="3xl">
            <HStack className="items-center" space="sm">
            <Text size="lg" bold>
            By continuing, you agree to our{' '}
            </Text>
              <Pressable className="items-center" onPress={handleTermsOfUse}>
                <Text size="lg" bold className="text-primary-500">Terms of use</Text>
              </Pressable>
              </HStack>
              <HStack className="items-center" space="sm">
              <Pressable className="items-center" onPress={handleBroadcasterAgreement}>
                <Text size="lg" bold className="text-primary-500">Broadcaster Agreement</Text>
              </Pressable>
              <Text size="lg" bold>
            and
            </Text>
            <Pressable className="items-center" onPress={handlePrivacyPolicy}>
                <Text size="lg" bold className="text-primary-500">Privacy Policy</Text>
              </Pressable>
            </HStack>
            <HStack className="items-center justify-center" space="sm">
            
              <Text size="sm" bold>
              powered by
              </Text>
              <Pressable className="items-center" onPress={handleZixDev}>
                  <Text size="sm" bold className="text-primary-500">ZixDev</Text>
                </Pressable>
            </HStack>
          </VStack>
      </ScreenLayout>

  );
}
