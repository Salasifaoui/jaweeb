import { AppHeader } from '@/components/app-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
export function HomeScreen() {
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
              <IconSymbol name="person.fill" size={20} color="#007AFF" />
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
              <IconSymbol name="person.fill" size={20} color="#34C759" />
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
              <IconSymbol name="person.2.fill" size={20} color="#FF9500" />
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
              <IconSymbol name="plus.circle.fill" size={24} color="#007AFF" />
              <ThemedText style={styles.actionText}>New Group</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <IconSymbol name="person.badge.plus" size={24} color="#34C759" />
              <ThemedText style={styles.actionText}>Add Contact</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <IconSymbol name="camera.fill" size={24} color="#FF9500" />
              <ThemedText style={styles.actionText}>Scan QR</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
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
      fontSize: 28,
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
      backgroundColor: '#F2F2F7',
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
      color: '#8E8E93',
    },
    chatMessage: {
      fontSize: 14,
      color: '#8E8E93',
    },
    unreadBadge: {
      backgroundColor: '#007AFF',
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 6,
    },
    unreadText: {
      color: '#fff',
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
      backgroundColor: '#F2F2F7',
      borderRadius: 12,
      minWidth: 80,
    },
    actionText: {
      fontSize: 12,
      marginTop: 8,
      textAlign: 'center',
    },
  });