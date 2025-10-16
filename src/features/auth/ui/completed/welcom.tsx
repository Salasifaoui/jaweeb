import { IconsList } from '@/components/icons/icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ListAvatars } from '@/components/ui/list-avatars/list-avatars';
import { UserAvatar } from '@/components/ui/user-avatar/user-avatar';
import { APP_NAME } from '@/constants/variables';
import { Button } from '@/src/components/Button';
import { useCompletedProfile } from '@/src/features/profile/hooks';
import { useUserService } from '@/src/features/profile/hooks/userProfile';
import { THEME } from '@/src/theme/theme';
import { router } from 'expo-router';
import { ChevronDownCircle, ChevronUpCircle } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
export  function WelcomePage() {
  const { user } = useAuth();
  const {userProfile: profile} = useUserService(user?.userId || '');
  const { checkProfileCompletion, getNextIncompleteScreen } = useCompletedProfile();
  const [isOpen, setIsOpen] = useState(false);
  const colorScheme = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const styles = createStyles(theme);
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
         <View style={styles.avatarSection}>
           <UserAvatar 
             user={profile} 
             size={100} 
             backgroundColor={theme.primary}
             textColor={theme.primaryForeground}
             showInitials={true}
           />
           <View style={styles.containerChevron}>
            <ThemedText style={styles.textChevron}>Select your avatar or upload a new one</ThemedText>
           
           {!isOpen ? (
            <TouchableOpacity
              onPress={() => setIsOpen(true)}
            >
              <ChevronDownCircle
                size={20}
                color={theme.primary}
                fill={theme.primaryForeground}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setIsOpen(false)}
            >
              <ChevronUpCircle
                size={20}
                color={theme.primary}
                fill={theme.primaryForeground}
              />
            </TouchableOpacity>
          )}
          </View>
          
         </View>
         {isOpen && <ListAvatars userProfile={profile} setShowGallery={setIsOpen} />}
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

const createStyles = (theme: typeof THEME.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
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
    color: theme.primary,
    marginTop: 16,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.foreground,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: theme.mutedForeground,
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
    color: theme.mutedForeground,
    textAlign: 'center',
  },
  buttonSection: {
    paddingHorizontal: 20,
  },
  nextButton: {
    backgroundColor: theme.primary,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 10,
  },
  containerChevron: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
  },
  textChevron: {
    fontSize: 16,
    color: theme.foreground,
    textAlign: 'center',
  },
  
});
