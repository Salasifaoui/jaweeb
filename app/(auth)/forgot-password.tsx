import { Button } from '@/src/components/Button';
import { InputField } from '@/src/components/InputField';
import { useAuth } from '@/src/hooks/useAuth';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('خطأ', 'يرجى إدخال البريد الإلكتروني');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      Alert.alert(
        'تم إرسال رابط إعادة تعيين كلمة المرور',
        'تحقق من بريدك الإلكتروني واتبع التعليمات',
        [
          {
            text: 'حسناً',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('خطأ', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>نسيت كلمة المرور؟</Text>
      <Text style={styles.subtitle}>
        أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور
      </Text>
      
      <InputField
        placeholder="البريد الإلكتروني"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <Button
        title="إرسال رابط إعادة التعيين"
        onPress={handleResetPassword}
        loading={loading}
        style={styles.resetButton}
      />
      
      <Button
        title="العودة لتسجيل الدخول"
        onPress={() => router.back()}
        variant="outline"
        style={styles.backButton}
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
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
    lineHeight: 24,
  },
  resetButton: {
    marginTop: 20,
  },
  backButton: {
    marginTop: 10,
  },
});
