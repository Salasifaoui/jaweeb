import { Button } from '@/src/components/Button';
import { InputField } from '@/src/components/InputField';
import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { useZodForm } from "@/src/hooks/useZodForm";
import { THEME } from '@/src/theme/theme';
import { LoginFormData, loginSchema } from "@/src/validation/schemas";
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, useColorScheme, View } from 'react-native';



export function LoginScreen() {
  const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, loading } = useAuth();
    const colorScheme = useColorScheme();
    const theme = THEME[colorScheme ?? 'light'];
    const styles = createStyles(theme);
    const {
      values: formData,
      setValue,
      setFieldTouched,
      validateField,
      handleSubmit,
    } = useZodForm<LoginFormData>({
      schema: loginSchema,
      initialValues: {
        email: "",
        password: "",
      },
      onSubmit: async (values) => {
        try {
          await login(values.email, values.password);
          router.replace("/(tabs)");
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to sign in";
          Alert.alert(errorMessage, "error");
          throw error;
        }
      },
    });

    const handleInputChange = (field: keyof LoginFormData, value: string) => {
      setValue(field, value);
    };
  
    const handleInputBlur = (field: keyof LoginFormData) => {
      setFieldTouched(field);
      validateField(field, formData[field]);
    };
  
    useEffect(() => {
      setEmail(formData.email);
      setPassword(formData.password);
    }, [formData, setEmail, setPassword]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>تسجيل الدخول</Text>
      
      <InputField
        placeholder="البريد الإلكتروني"
        value={email}
        onChangeText={(value) => handleInputChange("email", value)}
        onBlur={() => handleInputBlur("email")}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <InputField
        placeholder="كلمة المرور"
        value={password}
        onChangeText={(value) => handleInputChange("password", value)}
        onBlur={() => handleInputBlur("password")}
        secureTextEntry
      />
      
      <Button
        title="تسجيل الدخول"
        onPress={handleSubmit}
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

const createStyles = (theme: typeof THEME.light) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: theme.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: theme.foreground,
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
