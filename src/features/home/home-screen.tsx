import { ThemedView } from '@/components/themed-view';
import { NavBar } from '@/components/ui/nav-bar';
import { TabList } from '@/components/ui/tab-list';
import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { ChatList } from '@/src/features/chats';
import { THEME } from '@/src/theme/theme';
import { ChatWithMembers } from '@/src/types/chat';
import React, { useState } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
export function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const styles = createStyles(theme);
  const { user } = useAuth();
  const tabs = ['Nearby', 'Popular', 'Chat'];
  const sousTabs = {
    Nearby: ['Match', 'Live', 'Meet'],
    Popular: ['All', 'Hot'],
    Chat: ['Fellow', 'All', 'Live']
  };
  const [tabSelected, setTabSelected] = useState('Nearby');
  const [sousTabSelected, setSousTabSelected] = useState('Match');

  const handleChatSelect = (chat: ChatWithMembers) => {
    // Handle chat selection - you can navigate to chat screen here
    console.log('Selected chat:', chat);
  };
  return (
    <ThemedView style={styles.container}>

      <NavBar showSearchButton showNotificationButton>
        <TabList 
        tabs={tabs} 
        textStyle={styles.title} 
        color={theme.mutedForeground} 
        colorSelected={theme.primary} 
        activeTab={tabSelected} 
        onTabChange={(tab) => {
          setTabSelected(tab);
          setSousTabSelected(sousTabs[tab as keyof typeof sousTabs][0]); // Reset sous tab on main tab change
        }} 
        showIndicator={true} 
        />
      </NavBar>
      <NavBar showAboutButton>
      <TabList 
        tabs={sousTabs[tabSelected as keyof typeof sousTabs] || [] as string[]}  
        textStyle={styles.sousTitle} 
        color={theme.mutedForeground} 
        colorSelected={theme.primary} 
        activeTab={sousTabSelected} 
        onTabChange={(tab) => setSousTabSelected(tab)} 
        showIndicator={false} 
        backgroundColor={theme.secondary} 
        backgroundColorSelected={theme.primaryForeground} />
      </NavBar>
    
      <View style={styles.content}>
        {tabSelected === 'Chat' && sousTabSelected === 'All' && user?.userId && (
          <ChatList 
            userId={user.userId} 
            onChatSelect={handleChatSelect}
          />
        )}
      </View>
    </ThemedView>
  );
}

const createStyles = (theme: typeof THEME.light) => StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 60,
    },
    header: {
      flexDirection: 'column',
      gap: 10,
      backgroundColor: theme.primaryForeground,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
    },
    sousTitle: {
      fontSize: 14,
      fontWeight: '600',
    },
    searchButton: {
      padding: 8,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    sousTabsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
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