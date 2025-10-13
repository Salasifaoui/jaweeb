import { Button } from '@/src/components/Button';
import { InputField } from '@/src/components/InputField';
import { useAuth } from '@/src/hooks/useAuth';
import { useZodForm } from "@/src/hooks/useZodForm";
import { LoginFormData, loginSchema } from "@/src/validation/schemas";
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';



export default function LoginScreen() {
  const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { signIn, isLoading } = useAuth();
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
          await signIn(values.email, values.password);
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
