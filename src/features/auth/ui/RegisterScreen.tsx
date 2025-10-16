import { Button } from '@/src/components/Button';
import { InputField } from '@/src/components/InputField';
import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { useZodForm } from '@/src/hooks/useZodForm';
import { THEME } from '@/src/theme/theme';
import { CreateUserFormData, createUserSchema } from '@/src/validation/schemas';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, useColorScheme, View } from 'react-native';

export function RegisterScreen() {
  const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { register, login, loading } = useAuth();
    const colorScheme = useColorScheme();
    const theme = THEME[colorScheme ?? 'light'];
    const styles = createStyles(theme);
    const {
      errors,
      values: formData,
      setValue,
      setFieldTouched,
      validateField,
      handleSubmit,

    } = useZodForm<CreateUserFormData>({
      schema: createUserSchema,
      initialValues: {
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      },
      onSubmit: async (values) => {
        try {
          const user = await register(values.username, values.email, values.password);
       if(user) {
        await login(values.email, values.password);
        router.replace("/(tabs)");
       }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to create account";
          Alert.alert(errorMessage, "error");
          throw error;
        }
      },
    });



    const handleInputChange = (
      field: keyof CreateUserFormData,
      value: string
    ) => {
      setValue(field, value);
    };
  
    const handleInputBlur = (field: keyof CreateUserFormData) => {
      setFieldTouched(field);
      validateField(field, formData[field]);
    };
  
    useEffect(() => {
      setEmail(formData.email);
      setName(formData.username);
      setPassword(formData.password);
      setConfirmPassword(formData.confirmPassword);
    }, [formData, setEmail, setName, setPassword, setConfirmPassword]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>إنشاء حساب جديد</Text>
      
      {errors && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>{errors}</Text>
          <Text style={styles.errorDescription}>{errors}</Text>
        </View>
      )}
      
      <InputField
        placeholder="الاسم الكامل"
        value={name}
        onChangeText={(value) => handleInputChange("username", value)}
        onBlur={() => handleInputBlur("username")}
        autoCapitalize="words"
      />
      
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
      
      <InputField
        placeholder="تأكيد كلمة المرور"
        value={confirmPassword}
        onChangeText={(value) => handleInputChange("confirmPassword", value)}
        onBlur={() => handleInputBlur("confirmPassword")}
        secureTextEntry
      />
      
      <Button
        title="إنشاء الحساب"
        onPress={handleSubmit}
        loading={loading}
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
  errorContainer: {
    backgroundColor: theme.border,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: theme.primary,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 4,
  },
  errorDescription: {
    fontSize: 14,
    color: theme.primary,
    lineHeight: 20,
  },
  registerButton: {
    marginTop: 20,
  },
  loginButton: {
    marginTop: 10,
  },
});
