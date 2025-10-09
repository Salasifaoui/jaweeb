import { Image } from 'expo-image';
import React from 'react';
import { ImageSourcePropType, Text, View } from 'react-native';

interface AvatarProps {
  source?: ImageSourcePropType | string;
  name?: string;
  size?: number;
  style?: any;
}

export function Avatar({ source, name, size = 50, style }: AvatarProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getBackgroundColor = (name: string) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  if (source) {
    return (
      <Image
        source={source}
        style={[avatarStyle, style]}
        contentFit="cover"
      />
    );
  }

  return (
    <View
      style={[
        avatarStyle,
        {
          backgroundColor: name ? getBackgroundColor(name) : '#ccc',
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
    >
      <Text
        style={{
          color: '#fff',
          fontSize: size * 0.4,
          fontWeight: '600',
        }}
      >
        {name ? getInitials(name) : '?'}
      </Text>
    </View>
  );
}
