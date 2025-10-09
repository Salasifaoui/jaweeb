import { useEmailSignIn } from '@/src/appwrite/account/useEmailSignIn';
import { parseErrorMessage } from '@/src/appwrite/exceptions/parseErrorMessage';
import { Button } from '@/src/components/Button';
import { InputField } from '@/src/components/InputField';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<{ title: string; description: string } | null>(null);

    const emailSignIn = useEmailSignIn({
        onSuccess: () => {
            setErrorMessage(null); // Clear any previous errors
            router.replace("/");
        },
        onError: (error: any) => {
            const parsedError = parseErrorMessage(error);
            setErrorMessage(parsedError);
            console.error("Login error:", error);
            setIsLoading(false);
        }
    });

    const handleEmailChange = (text: string) => {
        setEmail(text);
        if (errorMessage) {
            setErrorMessage(null); // Clear error when user starts typing
        }
    };

    const handlePasswordChange = (text: string) => {
        setPassword(text);
        if (errorMessage) {
            setErrorMessage(null); // Clear error when user starts typing
        }
    };

    const handleEmailLogin = async () => {
        if (!email || !password) return;

        setErrorMessage(null); // Clear any previous errors
        setIsLoading(true);
        emailSignIn.mutate({ email, password });
    };

    const handleForgotPassword = () => {
        // if (email) {
        //     router.push(`/(auth)/forgot-password?email=${email}`);
        // } else {
            router.push("/(auth)/forgot-password");
        // }
    };

    const handleAppleLogin = () => {
        // Implement Apple login
        console.log("Apple login pressed");
    };

    const handleGoogleLogin = () => {
        // Implement Google login
        console.log("Google login pressed");
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>تسجيل الدخول</Text>
      
      <InputField
        placeholder="البريد الإلكتروني"
        value={email}
        onChangeText={handleEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <InputField
        placeholder="كلمة المرور"
        value={password}
        onChangeText={handlePasswordChange}
        secureTextEntry
      />
      
      <Button
        title="تسجيل الدخول"
        onPress={handleEmailLogin}
        loading={isLoading}
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
        onPress={handleForgotPassword}
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
