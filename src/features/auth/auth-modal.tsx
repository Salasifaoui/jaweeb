import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Linking,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

export function AuthModal() {
    const [showAuthModal, setShowAuthModal] = useState(true);
  const handleGoogleSignIn = () => {
    // Implement Google sign in
    console.log('Google sign in pressed');
    setShowAuthModal(false);
    Alert.alert('Google Sign In', 'Google sign in functionality will be implemented');
  };

  const handlePhoneSignIn = () => {
    // Navigate to phone sign in
    router.push('/(auth)/login');
    setShowAuthModal(false);
  };

  const handleAppleSignIn = () => {
    // Implement Apple sign in
    console.log('Apple sign in pressed');
    setShowAuthModal(false);
    Alert.alert('Apple Sign In', 'Apple sign in functionality will be implemented');
  };

  const handleFacebookSignIn = () => {
    // Implement Facebook sign in
    console.log('Facebook sign in pressed');
    setShowAuthModal(false);
    Alert.alert('Facebook Sign In', 'Facebook sign in functionality will be implemented');
  };

  const handleTwitterSignIn = () => {
    // Implement Twitter sign in
    console.log('Twitter sign in pressed');
    setShowAuthModal(false);
    Alert.alert('Twitter Sign In', 'Twitter sign in functionality will be implemented');
  };

  const handleVKSignIn = () => {
    // Implement VK sign in
    console.log('VK sign in pressed');
    setShowAuthModal(false);
    Alert.alert('VK Sign In', 'VK sign in functionality will be implemented');
  };

  const handleTermsOfUse = () => {
    // Open terms of use
    setShowAuthModal(false);
    Linking.openURL('https://example.com/terms');
  };

  const handleBroadcasterAgreement = () => {
    // Open broadcaster agreement
    setShowAuthModal(false);
    Linking.openURL('https://example.com/broadcaster-agreement');
  };

  const handlePrivacyPolicy = () => {
    // Open privacy policy
    Linking.openURL('https://example.com/privacy');
  };

  return (
    <Modal
      visible={showAuthModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => {
        setShowAuthModal(false);
        router.replace('/(tabs)');
      }}
    >
      <ThemedView style={styles.container}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={() => {
          setShowAuthModal(false);
          router.replace('/(tabs)');
        }}>
          <IconSymbol name="xmark" size={24} color="#8E8E93" />
        </TouchableOpacity>

        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <IconSymbol name="gamecontroller.fill" size={40} color="#FF6B6B" />
          </View>
          <ThemedText style={styles.logoText}>Jaweeb</ThemedText>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <ThemedText style={styles.title}>
            Sign in to experience complete functions
          </ThemedText>

          {/* Primary Sign In Buttons */}
          <View style={styles.primaryButtons}>
            

            <Button
              onPress={handlePhoneSignIn}
              className="bg-primary"
            >
              <IconSymbol name="phone.fill" size={20} color="#fff" />
              <ThemedText className="text-primary-foreground ml-2">Sign in with Phone</ThemedText>
            </Button>

            <Button
              onPress={handleAppleSignIn}
              className="bg-black"
            >
              <IconSymbol name="applelogo" size={20} color="#fff" />
              <ThemedText className="text-white ml-2">Sign in with Apple</ThemedText>
            </Button>
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
              <IconSymbol name="facebook" size={24} color="#1877F2" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialIcon} onPress={handleTwitterSignIn}>
              <IconSymbol name="bird" size={24} color="#1DA1F2" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialIcon} onPress={handleVKSignIn}>
              <ThemedText style={styles.vkText}>VK</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Legal Text */}
          <View style={styles.legalSection}>
            <ThemedText style={styles.legalText}>
              By continuing, you agree to our{' '}
              <TouchableOpacity onPress={handleTermsOfUse}>
                <ThemedText style={styles.legalLink}>Terms of use</ThemedText>
              </TouchableOpacity>
              ,{' '}
              <TouchableOpacity onPress={handleBroadcasterAgreement}>
                <ThemedText style={styles.legalLink}>Broadcaster Agreement</ThemedText>
              </TouchableOpacity>
              , and{' '}
              <TouchableOpacity onPress={handlePrivacyPolicy}>
                <ThemedText style={styles.legalLink}>Privacy Policy</ThemedText>
              </TouchableOpacity>
            </ThemedText>
          </View>
        </View>
      </ThemedView>
    </Modal>
  );
}

const { width } = Dimensions.get('window');

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
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
    lineHeight: 24,
  },
  primaryButtons: {
    marginBottom: 30,
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
    paddingHorizontal: 20,
  },
  legalText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#8E8E93',
    lineHeight: 18,
  },
  legalLink: {
    color: '#FF6B6B',
    textDecorationLine: 'underline',
  },
});
