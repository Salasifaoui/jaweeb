import { ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router';
import '../global.css';

import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { AuthProvider } from '@/src/providers/AuthProvider';
import { NAV_THEME } from '@/src/theme/theme';
import { Provider as JotaiProvider } from 'jotai';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  return (
    <JotaiProvider>
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
    </JotaiProvider>
  );
}


const StackLayout = () => {
  const router = useRouter();
  const segments = useSegments();
  const { user, session, loading, isAuthenticated } = useAuth();
  
  // Handle navigation after auth data is loaded and navigation is ready
  useEffect(() => {
   if (!loading) {
      // Only navigate if we're at the root
      const isAtRoot = segments.length === (0 as number);
      if (isAtRoot) {
        if (isAuthenticated && user && session) {
          // User is authenticated, go to main app
          router.replace("/(auth)/complated/welcom");
        } else {
          // User is not authenticated, go to auth flow
          router.replace("/(auth)/inscription");
        }
        
        setTimeout(() => {
          SplashScreen.hideAsync();
        }, 500);
      }
     }
  }, [loading, isAuthenticated, user, session, segments, router]);

  return (
    <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(profile)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
  );
};

function RootLayoutNav() {
  const { colorScheme } = useColorScheme();

  return (
        <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
          <StackLayout />
          {/* <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} /> */}
        </ThemeProvider>

  );
}
