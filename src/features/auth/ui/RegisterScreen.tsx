import { NavBar } from '@/components/ui/nav-bar';
import { ScreenLayout } from '@/components/ui/screen-layout/screen-layout';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import ButtonAction from '@/src/components/ButtonAction';
import ButtonArrowBack from '@/src/components/ButtonArrowBack';
import { InputField } from '@/src/components/InputField';
import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { useZodForm } from '@/src/hooks/useZodForm';
import { CreateUserFormData, createUserSchema } from '@/src/validation/schemas';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export function RegisterScreen() {
  const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { register, login, loading } = useAuth();
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
    <ScreenLayout>
      <NavBar>
        <ButtonArrowBack />
      </NavBar>
      <VStack className=" flex-1 gap-4 justify-center ">
      <Text className="text-2xl font-bold text-center">إنشاء حساب جديد</Text>
      
      {/* {errors && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>{errors}</Text>
          <Text style={styles.errorDescription}>{errors}</Text>
        </View>
      )} */}
      
      <InputField
        placeholder="الاسم الكامل"
        value={name}
        onChangeText={(value) => handleInputChange("username", value)}
        onBlur={() => handleInputBlur("username")}
        autoCapitalize="words"
        textAlign='right'
      />
      
      <InputField
        placeholder="البريد الإلكتروني"
        value={email}
        onChangeText={(value) => handleInputChange("email", value)}
        onBlur={() => handleInputBlur("email")}
        keyboardType="email-address"
        autoCapitalize="none"
        textAlign='right'
      />
      
      <InputField
        placeholder="كلمة المرور"
        value={password}
        onChangeText={(value) => handleInputChange("password", value)}
        onBlur={() => handleInputBlur("password")}
        secureTextEntry
        textAlign='right'
      />
      
      <InputField
        placeholder="تأكيد كلمة المرور"
        value={confirmPassword}
        onChangeText={(value) => handleInputChange("confirmPassword", value)}
        onBlur={() => handleInputBlur("confirmPassword")}
        secureTextEntry
        textAlign='right'
      />
      
      <ButtonAction
        text="إنشاء الحساب"
        onPress={handleSubmit}
        loading={loading}
        variant="solid"
        action="primary"
      />
      
      <ButtonAction
        text="لديك حساب بالفعل؟ تسجيل الدخول"
        onPress={() => router.back()}
        variant="outline"
        action="primary"
      />
      </VStack>
    </ScreenLayout>
  );
}
