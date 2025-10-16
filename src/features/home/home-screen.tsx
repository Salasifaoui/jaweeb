import { AppHeader } from '@/components/app-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Icon } from '@/components/ui/icon';
import { THEME } from '@/src/theme/theme';
import { router } from 'expo-router';
import { Camera, Plus, User } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
export function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const styles = createStyles(theme);
  return (
    <ThemedView style={styles.container}>
      <AppHeader
      title='Home'
      showBackButton={false}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Recent Chats
          </ThemedText>
          
          <TouchableOpacity 
            style={styles.chatItem}
            onPress={() => router.push('/(chat)/chat-room')}
          >
            <View style={styles.avatar}>
              <Icon as={User} size={20} color="#007AFF" />
            </View>
            <View style={styles.chatContent}>
              <View style={styles.chatHeader}>
                <ThemedText style={styles.chatName}>Ahmed Ali</ThemedText>
                <ThemedText style={styles.chatTime}>2m</ThemedText>
              </View>
              <ThemedText style={styles.chatMessage} numberOfLines={1}>
                مرحبا! كيف حالك؟
              </ThemedText>
            </View>
            <View style={styles.unreadBadge}>
              <ThemedText style={styles.unreadText}>2</ThemedText>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.chatItem}>
            <View style={styles.avatar}>
              <Icon as={User} size={20} color="#34C759" />
            </View>
            <View style={styles.chatContent}>
              <View style={styles.chatHeader}>
                <ThemedText style={styles.chatName}>Sara Mohamed</ThemedText>
                <ThemedText style={styles.chatTime}>1h</ThemedText>
              </View>
              <ThemedText style={styles.chatMessage} numberOfLines={1}>
                شكراً لك على المساعدة
              </ThemedText>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.chatItem}>
            <View style={styles.avatar}>
              <Icon as={User} size={20} color="#FF9500" />
            </View>
            <View style={styles.chatContent}>
              <View style={styles.chatHeader}>
                <ThemedText style={styles.chatName}>فريق العمل</ThemedText>
                <ThemedText style={styles.chatTime}>3h</ThemedText>
              </View>
              <ThemedText style={styles.chatMessage} numberOfLines={1}>
                اجتماع غداً في الساعة 10 صباحاً
              </ThemedText>
            </View>
            <View style={styles.unreadBadge}>
              <ThemedText style={styles.unreadText}>5</ThemedText>
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
              <Icon as={Plus} size={24} color="#34C759" />
              <ThemedText style={styles.actionText}>New Group</ThemedText>
            </TouchableOpacity>
            
              <TouchableOpacity style={styles.actionButton}>
                <Icon as={Plus} size={24} color="#34C759" />
              <ThemedText style={styles.actionText}>Add Contact</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Icon as={Camera} size={24} color="#FF9500" />
              <ThemedText style={styles.actionText}>Scan QR</ThemedText>
            </TouchableOpacity>
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
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 20,
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
    },
    searchButton: {
      padding: 8,
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
    chatItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 0,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.border,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    chatContent: {
      flex: 1,
    },
    chatHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    chatName: {
      fontSize: 16,
      fontWeight: '600',
    },
    chatTime: {
      fontSize: 12,
      color: theme.mutedForeground,
    },
    chatMessage: {
      fontSize: 14,
      color: theme.mutedForeground,
    },
    unreadBadge: {
      backgroundColor: theme.primary,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 6,
    },
    unreadText: {
      color: theme.primaryForeground,
      fontSize: 12,
      fontWeight: 'bold',
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
  });