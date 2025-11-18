import { NavBar } from '@/components/ui/nav-bar';
import { ScreenLayout } from '@/components/ui/screen-layout/screen-layout';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import ButtonAction from '@/src/components/ButtonAction';
import ButtonArrowBack from '@/src/components/ButtonArrowBack';
import { InputField } from '@/src/components/InputField';
import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { useZodForm } from "@/src/hooks/useZodForm";
import { LoginFormData, loginSchema } from "@/src/validation/schemas";
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';



export function LoginScreen() {
  const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, loading } = useAuth();
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
    <ScreenLayout>
      <NavBar>
        <ButtonArrowBack />
      </NavBar>
      <VStack className=" flex-1 gap-4 justify-center ">
      <Text className="text-2xl font-bold text-center">تسجيل الدخول</Text>
      
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
        className='w-full'
      />
      
      <VStack className='gap-2'>
      <ButtonAction
        text="تسجيل الدخول"
        onPress={handleSubmit}
        loading={loading}
        variant="solid"
        action="primary"
      />
      <ButtonAction
        text="إنشاء حساب جديد"
        onPress={() => router.push('/(auth)/register')}
        variant="outline"
        action="primary"
      />
      </VStack>
      
     
      
      <ButtonAction
        text="نسيت كلمة المرور؟"
        onPress={() => router.push('/(auth)/forgot-password')}
        variant="link"
        action="secondary"
      />
      </VStack>
    </ScreenLayout>
  );
}
