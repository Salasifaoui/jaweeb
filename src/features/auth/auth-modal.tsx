import { AppHeader } from '@/components/app-header';
import { IconsList } from '@/components/icons/icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { APP_NAME } from '@/constants/variables';
import AppleSignInButton from '@/src/components/AppleSignInButton';
import EmailSignInButton from '@/src/components/EmailSignInButton';
import GoogleSignInButton from '@/src/components/GoogleSignInButton';
import { router } from 'expo-router';
import React from 'react';
import {
  Alert,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

export function AuthModal() {
  

  const handleEmailSignIn = () => {
    // Navigate to phone sign in
    router.push('/(auth)/login');
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
      <ThemedView style={styles.container}>
        <AppHeader
          title=""
          showBackButton={true}
            onBackPress={() => {
              router.replace('/(tabs)');
            }}
        />

        {/* Logo Section */}
        <View style={styles.logoSection}>
          <IconsList.jaweeb width={40} height={40} />
          <ThemedText style={styles.logoText}>{APP_NAME}</ThemedText>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <ThemedText style={styles.title}>
            Sign in to experience complete functions
          </ThemedText>

          {/* Primary Sign In Buttons */}
          <View style={styles.primaryButtons}>
            <GoogleSignInButton onPress={handleGoogleSignIn} />

            <EmailSignInButton onPress={handleEmailSignIn} />

            <AppleSignInButton onPress={handleAppleSignIn} />
            
          </View>

          {/* OR Separator */}
          <View style={styles.separator}>
            <View style={styles.separatorLine} />
            <ThemedText style={styles.separatorText}>OR</ThemedText>
            <View style={styles.separatorLine} />
          </View>

          {/* Social Media Icons */}
          <View style={styles.socialIcons}>
            <TouchableOpacity style={styles.socialIcon} onPress={handleFacebookSignIn}>
              <IconsList.facebook width={24} height={24} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialIcon} onPress={handleTwitterSignIn}>
              <IconsList.instagram width={24} height={24} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialIcon} onPress={handleVKSignIn}>
              <IconsList.tiktok width={24} height={24} />
            </TouchableOpacity>
          </View>

          {/* Legal Text */}
          <View style={styles.legalSection}>
            <ThemedText style={styles.legalText}>
            By continuing, you agree to our{' '}
            </ThemedText>
              <TouchableOpacity onPress={handleTermsOfUse}>
                <ThemedText style={styles.legalLink}>Terms of use</ThemedText>
              </TouchableOpacity>
              <ThemedText style={styles.legalText}>
              ,{' '}
            </ThemedText>
              <TouchableOpacity onPress={handleBroadcasterAgreement}>
                <ThemedText style={styles.legalLink}>Broadcaster Agreement</ThemedText>
              </TouchableOpacity>
              <ThemedText style={styles.legalText}>
            and
            </ThemedText>
              <TouchableOpacity onPress={handlePrivacyPolicy}>
                <ThemedText style={styles.legalLink}>Privacy Policy</ThemedText>
              </TouchableOpacity>
            
          </View>
          <View style={styles.productSection}>
            <ThemedText style={styles.legalText}>
            powered by
            </ThemedText>
            <TouchableOpacity onPress={handleZixDev}>
                <ThemedText style={styles.legalLink}>ZixDev</ThemedText>
              </TouchableOpacity>
          </View>
        </View>
      </ThemedView>

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 180,
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
    lineHeight: 24,
  },
  primaryButtons: {
    marginBottom: 30,
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#FF6B6B',
    marginBottom: 12,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appleButton: {
    backgroundColor: '#000',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5EA',
  },
  separatorText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  socialIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  vkText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0077FF',
  },
  legalSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  productSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  legalText: {
    fontSize: 12,
    paddingHorizontal: 5,
    textAlign: 'center',
    color: '#8E8E93',
    lineHeight: 18,
  },
  legalLink: {
    color: '#FF6B6B',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});
