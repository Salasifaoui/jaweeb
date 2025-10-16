import { AppHeader } from '@/components/app-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Icon } from '@/components/ui/icon';
import { APP_NAME } from '@/constants/variables';
import { THEME } from '@/src/theme/theme';
import { ArrowUpRight, ChevronRight, Heart, Lightbulb, MessageCircle, Star, User } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';

export function CommunityScreen() {
  const colorScheme = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const styles = createStyles(theme);
  return (
    <ThemedView style={styles.container}>
      <AppHeader
        title="Community"
        showBackButton={false}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Trending Topics
          </ThemedText>
          
          <TouchableOpacity style={styles.topicCard}>
            <Icon as={Star} size={20} color="#FFD700" />
            <View style={styles.topicContent}>
              <ThemedText style={styles.topicText}>New Feature Discussion</ThemedText>
              <ThemedText style={styles.topicSubtext}>1.2k posts • 5.4k likes</ThemedText>
            </View>
            <Icon as={ChevronRight} size={16} color="#C7C7CC" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.topicCard}>
            <Icon as={Heart} size={20} color="#FF6B6B" />
            <View style={styles.topicContent}>
              <ThemedText style={styles.topicText}>Community Feedback</ThemedText>
              <ThemedText style={styles.topicSubtext}>856 posts • 2.1k likes</ThemedText>
            </View>
            <Icon as={ChevronRight} size={16} color="#C7C7CC" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.topicCard}>
            <Icon as={Lightbulb} size={20} color="#FF9500" />
            <View style={styles.topicContent}>
              <ThemedText style={styles.topicText}>Feature Requests</ThemedText>
              <ThemedText style={styles.topicSubtext}>432 posts • 1.8k likes</ThemedText>
            </View>
            <Icon as={ChevronRight} size={16} color="#C7C7CC" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Recent Posts
          </ThemedText>
          
          <TouchableOpacity style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.postAvatar}>
                <Icon as={User} size={20} color="#007AFF" />
              </View>
              <View style={styles.postInfo}>
                <ThemedText style={styles.postAuthor}>Ahmed Ali</ThemedText>
                <ThemedText style={styles.postTime}>2 hours ago</ThemedText>
              </View>
            </View>
            <ThemedText style={styles.postTitle}>Welcome to {APP_NAME} Community!</ThemedText>
            <ThemedText style={styles.postContent}>
              Join the conversation and share your thoughts with other users. Let&apos;s build something amazing together!
            </ThemedText>
            <View style={styles.postActions}>
              <TouchableOpacity style={styles.postAction}>
                <Icon as={Heart} size={16} color="#FF6B6B" />
                <ThemedText style={styles.postActionText}>24</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.postAction}>
                <Icon as={MessageCircle} size={16} color="#007AFF" />
                <ThemedText style={styles.postActionText}>8</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.postAction}>
                <Icon as={ArrowUpRight} size={16} color="#34C759" />
                <ThemedText style={styles.postActionText}>Share</ThemedText>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.postAvatar}>
                <Icon as={User} size={20} color="#34C759" />
              </View>
              <View style={styles.postInfo}>
                <ThemedText style={styles.postAuthor}>Sara Mohamed</ThemedText>
                <ThemedText style={styles.postTime}>5 hours ago</ThemedText>
              </View>
            </View>
            <ThemedText style={styles.postTitle}>Tips for Better Communication</ThemedText>
            <ThemedText style={styles.postContent}>
              Here are some tips I&apos;ve learned about effective communication in our community...
            </ThemedText>
            <View style={styles.postActions}>
              <TouchableOpacity style={styles.postAction}>
                <Icon as={Heart} size={16} color="#FF6B6B" />
                <ThemedText style={styles.postActionText}>42</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.postAction}>
                <Icon as={MessageCircle} size={16} color="#007AFF" />
                <ThemedText style={styles.postActionText}>12</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.postAction}>
                <Icon as={ArrowUpRight} size={16} color="#34C759" />
                <ThemedText style={styles.postActionText}>Share</ThemedText>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Community Stats
          </ThemedText>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Icon as={User} size={24} color="#007AFF" />
              <ThemedText style={styles.statNumber}>1,234</ThemedText>
              <ThemedText style={styles.statLabel}>Members</ThemedText>
            </View>
            
            <View style={styles.statCard}>
              <Icon as={MessageCircle} size={24} color="#34C759" />
              <ThemedText style={styles.statNumber}>5,678</ThemedText>
              <ThemedText style={styles.statLabel}>Posts</ThemedText>
            </View>
            
            <View style={styles.statCard}>
              <Icon as={Heart} size={24} color="#FF6B6B" />
              <ThemedText style={styles.statNumber}>12,345</ThemedText>
              <ThemedText style={styles.statLabel}>Likes</ThemedText>
            </View>
          </View>
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
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.border,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  topicContent: {
    flex: 1,
    marginLeft: 10,
  },
  topicText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  topicSubtext: {
    fontSize: 12,
    color: theme.mutedForeground,
  },
  postCard: {
    backgroundColor: theme.border,
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  postInfo: {
    flex: 1,
  },
  postAuthor: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  postTime: {
    fontSize: 12,
    color: theme.mutedForeground,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.mutedForeground,
    marginBottom: 15,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postActionText: {
    fontSize: 12,
    marginLeft: 4,
    color: theme.mutedForeground,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.border,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.mutedForeground,
  },
});
