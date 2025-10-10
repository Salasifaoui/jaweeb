import { IconsList } from '@/components/icons/icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const EmailSignInButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
        <View style={styles.logoContainer}>
        <IconsList.email width={24} height={24} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Sign in with Email</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  logoContainer: {
    width: 60,
    height: 20,
    marginRight: 10,
    backgroundColor: '#ffffff',
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  text: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default EmailSignInButton;
