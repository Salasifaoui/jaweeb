import { Tabs } from 'expo-router';
import React from 'react';

import { CustomTabBarGluestack } from '@/components/custom-tab-bar-gluestack';

export default function TabLayout() {

  return (
    <Tabs
      tabBar={(props) => <CustomTabBarGluestack {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Camera',
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Me',
        }}
      />
    </Tabs>
  );
}
