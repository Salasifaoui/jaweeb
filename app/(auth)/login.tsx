import { Button } from '@/src/components/Button';
import { InputField } from '@/src/components/InputField';
import { useAuth } from '@/src/hooks/useAuth';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.replace('/(chat)/chat-list');
    } catch (error) {
      Alert.alert('خطأ في تسجيل الدخول', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>تسجيل الدخول</Text>
      
      <InputField
        placeholder="البريد الإلكتروني"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <InputField
        placeholder="كلمة المرور"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <Button
        title="تسجيل الدخول"
        onPress={handleLogin}
        loading={loading}
        style={styles.loginButton}
      />
      
      <Button
        title="إنشاء حساب جديد"
        onPress={() => router.push('/(auth)/register')}
        variant="outline"
        style={styles.registerButton}
      />
      
      <Button
        title="نسيت كلمة المرور؟"
        onPress={() => router.push('/(auth)/forgot-password')}
        variant="text"
        style={styles.forgotButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
  },
  loginButton: {
    marginTop: 20,
  },
  registerButton: {
    marginTop: 10,
  },
  forgotButton: {
    marginTop: 10,
  },
});
