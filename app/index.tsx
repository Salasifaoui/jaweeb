import { useAuth } from '@/src/hooks/useAuth';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { isLoggedIn, isLoading,  } = useAuth();
  const [isReady, setIsReady] = useState(false);

  // Set ready state after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Only navigate when not loading and component is ready
      if (!isLoading && isReady) {
        router.replace("/(tabs)");
        }

    
      }, [router, isLoading, isReady])
  );
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

