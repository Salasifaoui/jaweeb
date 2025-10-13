import { ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router';
import '../global.css';

import { useAuth } from '@/src/hooks/useAuth';
import { Provider } from '@/src/provider/Provider';
import { NAV_THEME } from '@/src/theme/theme';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  return (
    <Providers>
      <RootLayoutNav />
    </Providers>
  );
}

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <Provider value={undefined}>{children}</Provider>;
};

const StackLayout = () => {
  const router = useRouter();
  const segments = useSegments();
  const { isLoggedIn, isLoading, fetchAuthData, session, user } = useAuth();
  
  // Initialize auth data on mount
  useEffect(() => {
    if(isLoggedIn){
    fetchAuthData();
    }
  }, [fetchAuthData, isLoggedIn]);

  // Handle navigation after auth data is loaded and navigation is ready
  useEffect(() => {
    if (!isLoading) {
      // TODO: We may add this check to (auth) layout
      if (segments.length === (0 as number)) {
        if (session) {
          if (!user) {
            router.replace("/(auth)/inscription");
          } else {
            router.replace("/(tabs)");
          }
        }
        setTimeout(() => {
          SplashScreen.hideAsync();
        }, 500);
      }
    }
  }, [isLoading, user, session, segments, router]);
  return (
    <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(chat)" options={{ headerShown: false }} />
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
