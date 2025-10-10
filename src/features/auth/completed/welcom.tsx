import { IconsList } from '@/components/icons/icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { APP_NAME } from '@/constants/variables';
import { Button } from '@/src/components/Button';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function WelcomePage() {
  const handleNext = () => {
    router.push('/(auth)/complated/gender-birth');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <IconsList.jaweeb width={80} height={80} />
          <ThemedText style={styles.logoText}>{APP_NAME}</ThemedText>
        </View>

        {/* Welcome Content */}
        <View style={styles.welcomeSection}>
          <ThemedText style={styles.title}>Welcome to {APP_NAME}!</ThemedText>
          <ThemedText style={styles.subtitle}>
            Let&apos;s get you set up with a few quick steps to personalize your experience.
          </ThemedText>
        </View>

        {/* Features List */}
        <View style={styles.featuresSection}>
          <View style={styles.featureItem}>
            <ThemedText style={styles.featureText}>🎯 Connect with like-minded people</ThemedText>
          </View>
          <View style={styles.featureItem}>
            <ThemedText style={styles.featureText}>💬 Join exciting chat rooms</ThemedText>
          </View>
          <View style={styles.featureItem}>
            <ThemedText style={styles.featureText}>🌟 Discover new communities</ThemedText>
          </View>
        </View>

        {/* Next Button */}
        <View style={styles.buttonSection}>
          <Button
            title="Get Started"
            onPress={handleNext}
            variant="primary"
            size="large"
            style={styles.nextButton}
          />
        </View>
      </View>
    </ThemedView>
  );
}

// const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginTop: 16,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featuresSection: {
    marginBottom: 40,
  },
  featureItem: {
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  featureText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  buttonSection: {
    paddingHorizontal: 20,
  },
  nextButton: {
    backgroundColor: '#FF6B6B',
  },
});
