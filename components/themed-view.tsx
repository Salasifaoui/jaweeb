import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@/src/hooks/useAuth';
import { useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';

export type ThemedViewProps = ViewProps & {
  children?: React.ReactNode;
  lightColor?: string;
  darkColor?: string;
  authProtected?: boolean;
};

export function ThemedView({ style, lightColor, darkColor, authProtected = false, children, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const { isLoggedIn, session } = useAuth();
  const router = useRouter();

  const showContent = useMemo(
    () => !authProtected || isLoggedIn,
    [authProtected, isLoggedIn, session],
  );

  // Handle navigation in useEffect to avoid render-time side effects
  useEffect(() => {
    if (authProtected && !isLoggedIn && !session) {
      router.push("/(auth)/inscription");
    }
  }, [authProtected, isLoggedIn, router, session]);

  if (!showContent) {
    return null;
  }
  return <View style={[{ backgroundColor }, style]} {...otherProps} >{children}</View>;
}
