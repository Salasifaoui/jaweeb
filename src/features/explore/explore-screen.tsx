import { AppHeader } from '@/components/app-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Icon } from '@/components/ui/icon';
import { APP_NAME } from '@/constants/variables';
import { THEME } from '@/src/theme/theme';
import { router } from 'expo-router';
import { Building, Calendar, FireExtinguisher, GalleryThumbnails, PlusCircle, QrCode, Star, User, UserPlus } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';

export function ExploreScreen() {
  const colorScheme = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const styles = createStyles(theme);
  return (
    <ThemedView style={styles.container}>
      <AppHeader
        title="Explore"
        showBackButton={false}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Discover
          </ThemedText>
          
          <View style={styles.discoverGrid}>
            <TouchableOpacity style={styles.discoverCard}>
              <Icon as={User} size={30} color="#007AFF" />
              <ThemedText style={styles.discoverText}>Find Friends</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.discoverCard}>
              <Icon as={Building} size={30} color="#34C759" />
              <ThemedText style={styles.discoverText}>Nearby Places</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.discoverCard}>
              <Icon as={Calendar} size={30} color="#FF9500" />
              <ThemedText style={styles.discoverText}>Events</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.discoverCard}>
              <Icon as={GalleryThumbnails} size={30} color="#FF3B30" />
              <ThemedText style={styles.discoverText}>Games</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Trending Now
          </ThemedText>
          
          <TouchableOpacity style={styles.trendingCard}>
            <View style={styles.trendingHeader}>
              <Icon as={FireExtinguisher} size={20} color="#FF6B6B" />
              <ThemedText style={styles.trendingTitle}>#{APP_NAME}Challenge</ThemedText>
            </View>
            <ThemedText style={styles.trendingContent}>
              Join thousands of users in the latest {APP_NAME} challenge!
            </ThemedText>
            <View style={styles.trendingStats}>
              <ThemedText style={styles.trendingStat}>12.5k participants</ThemedText>
              <ThemedText style={styles.trendingStat}>•</ThemedText>
              <ThemedText style={styles.trendingStat}>2.3k posts</ThemedText>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.trendingCard}>
            <View style={styles.trendingHeader}>
              <Icon as={Star} size={20} color="#FFD700" />
              <ThemedText style={styles.trendingTitle}>#NewFeatures</ThemedText>
            </View>
            <ThemedText style={styles.trendingContent}>
              Check out the latest features and updates in {APP_NAME}
            </ThemedText>
            <View style={styles.trendingStats}>
              <ThemedText style={styles.trendingStat}>8.9k views</ThemedText>
              <ThemedText style={styles.trendingStat}>•</ThemedText>
              <ThemedText style={styles.trendingStat}>456 likes</ThemedText>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Quick Actions
          </ThemedText>
          
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/(chat)/new-group')}
            >
              <Icon as={PlusCircle} size={24} color="#007AFF" />
              <ThemedText style={styles.actionText}>Create Group</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Icon as={QrCode} size={24} color="#34C759" />
              <ThemedText style={styles.actionText}>Scan QR</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Icon as={UserPlus} size={24} color="#FF9500" />
              <ThemedText style={styles.actionText}>Add Contact</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Recommended for You
          </ThemedText>
          
          <TouchableOpacity style={styles.recommendationCard}>
            <View style={styles.recommendationHeader}>
              <View style={styles.recommendationAvatar}>
                <Icon as={User} size={20} color="#007AFF" />
              </View>
              <View style={styles.recommendationInfo}>
                <ThemedText style={styles.recommendationName}>Tech Enthusiasts Group</ThemedText>
                <ThemedText style={styles.recommendationSubtext}>1.2k members • Technology</ThemedText>
              </View>
              <TouchableOpacity style={styles.joinButton}>
                <ThemedText style={styles.joinButtonText}>Join</ThemedText>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.recommendationCard}>
            <View style={styles.recommendationHeader}>
              <View style={styles.recommendationAvatar}>
                <Icon as={User} size={20} color="#34C759" />
              </View>
              <View style={styles.recommendationInfo}>
                <ThemedText style={styles.recommendationName}>Local Community</ThemedText>
                <ThemedText style={styles.recommendationSubtext}>856 members • Local</ThemedText>
              </View>
              <TouchableOpacity style={styles.joinButton}>
                <ThemedText style={styles.joinButtonText}>Join</ThemedText>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const createStyles = (theme: typeof THEME.light) => StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  discoverGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  discoverCard: {
    width: '48%',
    backgroundColor: theme.border,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  discoverText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  trendingCard: {
    backgroundColor: theme.border,
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },
  trendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  trendingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  trendingContent: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.mutedForeground,
    marginBottom: 12,
  },
  trendingStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendingStat: {
    fontSize: 12,
    color: theme.mutedForeground,
    marginRight: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: theme.border,
    borderRadius: 12,
    minWidth: 80,
  },
  actionText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  recommendationCard: {
    backgroundColor: theme.border,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendationAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recommendationInfo: {
    flex: 1,
  },
  recommendationName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  recommendationSubtext: {
    fontSize: 12,
    color: theme.mutedForeground,
  },
  joinButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  joinButtonText: {
    color: theme.primaryForeground,
    fontSize: 12,
    fontWeight: '600',
  },
});
