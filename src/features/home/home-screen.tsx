import { NavBar } from '@/components/ui/nav-bar';
import { ScreenLayout } from '@/components/ui/screen-layout/screen-layout';
import { TabList } from '@/components/ui/tab-list';
import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { ChatList } from '@/src/features/chats';
import { ChatWithMembers } from '@/src/types/chat';
import React, { useState } from 'react';
import { View } from 'react-native';
export function HomeScreen() {
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
    <ScreenLayout>

      <NavBar showSearchButton showNotificationButton>
        <TabList 
        tabs={tabs} 
        textStyle={[{ fontSize: 24, fontWeight: 'bold' }]} 
        color="text-muted-foreground" 
        colorSelected="text-primary" 
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
        textStyle={[{ fontSize: 16, fontWeight: 'bold' }]} 
        color="text-muted-foreground" 
        colorSelected="text-primary" 
        activeTab={sousTabSelected} 
        onTabChange={(tab) => setSousTabSelected(tab)} 
        showIndicator={false} 
        backgroundColor="bg-secondary" 
        backgroundColorSelected="bg-primary-foreground" />
      </NavBar>
    
      <View className="flex-1">
        {tabSelected === 'Chat' && sousTabSelected === 'All' && user?.userId && (
          <ChatList 
            userId={user.userId} 
            onChatSelect={handleChatSelect}
          />
        )}
      </View>
    </ScreenLayout>
  );
}
