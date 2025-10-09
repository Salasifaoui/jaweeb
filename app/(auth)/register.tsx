import { useEmailSignIn } from '@/src/appwrite/account/useEmailSignIn';
import { useEmailSignUp } from '@/src/appwrite/account/useEmailSignUp';
import { parseErrorMessage } from '@/src/appwrite/exceptions/parseErrorMessage';
import { Button } from '@/src/components/Button';
import { InputField } from '@/src/components/InputField';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function RegisterScreen() {
  const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<{ title: string; description: string } | null>(null);

    const emailSignUp = useEmailSignUp({
        onSuccess: async () => {
            setErrorMessage(null); // Clear any previous errors
            // After successful registration, sign in the user
            emailSignIn.mutate({ email, password });
        },
        onError: (error) => {
            const parsedError = parseErrorMessage(error);
            console.error("Registration error:", error);
            setErrorMessage(parsedError);
            setIsLoading(false);
        }
    });

    const emailSignIn = useEmailSignIn({
        onSuccess: () => {
            setErrorMessage(null); // Clear any previous errors
            router.replace("/");
        },
        onError: (error) => {
            const parsedError = parseErrorMessage(error);
            setErrorMessage(parsedError);
            console.error("Auto sign-in error:", error);
            setIsLoading(false);
        }
    });

    const handleNameChange = (text: string) => {
        setName(text);
        if (errorMessage) {
            setErrorMessage(null); // Clear error when user starts typing
        }
    };

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

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) return;

        setErrorMessage(null); // Clear any previous errors
        setIsLoading(true);
        emailSignUp.mutate({
            name: name.trim(),
            email: email.trim(),
            password
        });
    };

    const handleAppleSignUp = () => {
        // Implement Apple sign up
        console.log("Apple sign up pressed");
    };

    const handleGoogleSignUp = () => {
        // Implement Google sign up
        console.log("Google sign up pressed");
    };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>إنشاء حساب جديد</Text>
      
      <InputField
        placeholder="الاسم الكامل"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
      
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
      
      <InputField
        placeholder="تأكيد كلمة المرور"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      
      <Button
        title="إنشاء الحساب"
        onPress={handleRegister}
        loading={isLoading}
        style={styles.registerButton}
      />
      
      <Button
        title="لديك حساب بالفعل؟ تسجيل الدخول"
        onPress={() => router.back()}
        variant="outline"
        style={styles.loginButton}
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
  registerButton: {
    marginTop: 20,
  },
  loginButton: {
    marginTop: 10,
  },
});
