import { Button } from '@/src/components/Button';
import { InputField } from '@/src/components/InputField';
import { useAuth } from '@/src/hooks/useAuth';
import { useZodForm } from '@/src/hooks/useZodForm';
import { CreateUserFormData, createUserSchema } from '@/src/validation/schemas';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

export default function RegisterScreen() {
  const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { signUp, signIn, isLoading, error: errorMessage } = useAuth();
    const {
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
          await signUp(values.email, values.password, values.username);
  
          Alert.alert("Account created successfully!", "success");
       
          await signIn(values.email, values.password);
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
      
      {errorMessage && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>{errorMessage}</Text>
          <Text style={styles.errorDescription}>{errorMessage}</Text>
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
