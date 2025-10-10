import { useAccount } from '@/src/appwrite/account';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const { data: account, isLoading } = useAccount();

  useEffect(() => {
    if (!isLoading) {
      if (account) {
        router.replace('/(auth)/inscription');
      } else {
        router.replace('/(tabs)');
      }
    }
  }, [account, isLoading]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jaweeb</Text>
      <Text style={styles.subtitle}>جاري التحميل...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

