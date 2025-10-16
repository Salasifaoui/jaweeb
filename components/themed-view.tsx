import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  children?: React.ReactNode;
  lightColor?: string;
  darkColor?: string;
  authProtected?: boolean;
};

export function ThemedView({ style, lightColor, darkColor, authProtected = false, children, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  // const { user } = useAuth();
  // const router = useRouter();
// console.log("user ThemedView", user);
//   useEffect(() => {
//     if (authProtected &&  user?.name === 'Guest User') {
//       console.log("authProtected ThemedView", authProtected);
//       console.log("user ThemedView", user);
//       router.push("/(auth)/inscription");
//     }
//   }, [authProtected,  user]);

//   if (user?.name === 'Guest User' && authProtected) {
//     return null;
//   }
  return <View style={[{ backgroundColor }, style]} {...otherProps} >{children}</View>;
}
