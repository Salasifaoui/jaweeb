import { useEmailSignIn } from '@/src/appwrite/account/useEmailSignIn';
import { useEmailSignUp } from '@/src/appwrite/account/useEmailSignUp';
import { parseErrorMessage } from '@/src/appwrite/exceptions/parseErrorMessage';
import { Button } from '@/src/components/Button';
import { InputField } from '@/src/components/InputField';
import { usersService } from '@/src/services/usersService';
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
        onSuccess: async (user) => {
            setErrorMessage(null); // Clear any previous errors
            try {
                // Create user profile in database using the Appwrite user ID
                await usersService.createUser({
                    username: name.trim(),
                    email: email.trim(),
                    status: 'online',
                    bio: '',
                }, user.$id);
                
                // After successful registration and profile creation, sign in the user
                emailSignIn.mutate({ email, password });
            } catch (profileError) {
                console.error("Profile creation error:", profileError);
                setErrorMessage({
                    title: "خطأ في إنشاء الملف الشخصي",
                    description: "تم إنشاء الحساب بنجاح ولكن فشل في إنشاء الملف الشخصي. يرجى المحاولة مرة أخرى."
                });
                setIsLoading(false);
            }
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

    const handleInputChange = (text: string, setter: (value: string) => void) => {
        setter(text);
        if (errorMessage) {
            setErrorMessage(null); // Clear error when user starts typing
        }
    };

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) return;

        // Validate password confirmation
        if (password !== confirmPassword) {
            setErrorMessage({
                title: "خطأ في كلمة المرور",
                description: "كلمة المرور وتأكيد كلمة المرور غير متطابقين."
            });
            return;
        }

        setErrorMessage(null); // Clear any previous errors
        setIsLoading(true);
        emailSignUp.mutate({
            name: name.trim(),
            email: email.trim(),
            password
        });
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>إنشاء حساب جديد</Text>
      
      {errorMessage && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>{errorMessage.title}</Text>
          <Text style={styles.errorDescription}>{errorMessage.description}</Text>
        </View>
      )}
      
      <InputField
        placeholder="الاسم الكامل"
        value={name}
        onChangeText={(text) => handleInputChange(text, setName)}
        autoCapitalize="words"
      />
      
      <InputField
        placeholder="البريد الإلكتروني"
        value={email}
        onChangeText={(text) => handleInputChange(text, setEmail)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <InputField
        placeholder="كلمة المرور"
        value={password}
        onChangeText={(text) => handleInputChange(text, setPassword)}
        secureTextEntry
      />
      
      <InputField
        placeholder="تأكيد كلمة المرور"
        value={confirmPassword}
        onChangeText={(text) => handleInputChange(text, setConfirmPassword)}
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
  errorContainer: {
    backgroundColor: '#FFE6E6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 4,
  },
  errorDescription: {
    fontSize: 14,
    color: '#FF3B30',
    lineHeight: 20,
  },
  registerButton: {
    marginTop: 20,
  },
  loginButton: {
    marginTop: 10,
  },
});
