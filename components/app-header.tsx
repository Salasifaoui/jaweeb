import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Pressable } from './ui/pressable';


export interface AppHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
  elevation?: number;
  style?: any;
}

export function AppHeader({
  title,
  showBackButton = false,
  onBackPress,
  rightComponent,
  leftComponent,
  backgroundColor,
  textColor,
  iconColor,
  elevation = 0,
  style,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const themeBackgroundColor = useThemeColor({}, 'background');
  const themeTextColor = useThemeColor({}, 'text');
  const themeIconColor = useThemeColor({}, 'icon');

  const headerBackgroundColor = backgroundColor || themeBackgroundColor;
  const headerTextColor = textColor || themeTextColor;
  const headerIconColor = iconColor || themeIconColor;

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    }
  };

  return (
    <>
      <StatusBar
        barStyle={headerTextColor === '#ECEDEE' ? 'light-content' : 'dark-content'}
        backgroundColor={headerBackgroundColor}
      />

        <View className="flex-row items-center justify-between">
          {/* Left Section */}
          <View className="flex-row items-center">
            {leftComponent || (
              showBackButton && (
                <Pressable
                  onPress={handleBackPress}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name="chevron-back"
                    size={24}
                    color={headerIconColor}
                  />
                </Pressable>
              )
            )}
          </View>

          {/* Center Section - Title */}
          <View className="flex-1">
            {title && (
              <Text
                className="text-lg font-bold"
                style={{ color: headerTextColor }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {title}
              </Text>
            )}
          </View>

          {/* Right Section */}
          <View className="flex-row items-center">
            {rightComponent}
          </View>
        </View>
     
    </>
  );
}

