import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  children,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const getButtonStyle = (): ViewStyle => {
    const baseStyle = [styles.button, styles[size]];
    
    switch (variant) {
      case 'outline':
        return [...baseStyle, styles.outline, isDisabled && styles.disabled];
      case 'text':
        return [...baseStyle, styles.text, isDisabled && styles.disabled];
      default:
        return [...baseStyle, styles.primary, isDisabled && styles.disabled];
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle = [styles.textBase, styles[`${size}Text`]];
    
    switch (variant) {
      case 'outline':
        return [...baseStyle, styles.outlineText, isDisabled && styles.disabledText];
      case 'text':
        return [...baseStyle, styles.textVariant, isDisabled && styles.disabledText];
      default:
        return [...baseStyle, styles.primaryText, isDisabled && styles.disabledText];
    }
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? '#fff' : '#007AFF'} 
          size="small" 
        />
      ) : (
        <>
          {children}
          {title && <Text style={[...getTextStyle(), textStyle]}>{title}</Text>}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  // Sizes
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 48,
  },
  large: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    minHeight: 56,
  },
  // Variants
  primary: {
    backgroundColor: '#007AFF',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  text: {
    backgroundColor: 'transparent',
  },
  // Text styles
  textBase: {
    fontWeight: '600',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  primaryText: {
    color: '#fff',
  },
  outlineText: {
    color: '#007AFF',
  },
  textVariant: {
    color: '#007AFF',
  },
  // Disabled states
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  },
});
