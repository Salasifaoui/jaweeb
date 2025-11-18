import { NavBar } from "@/components/ui/nav-bar";
import { ScreenLayout } from "@/components/ui/screen-layout/screen-layout";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import ButtonAction from "@/src/components/ButtonAction";
import ButtonArrowBack from "@/src/components/ButtonArrowBack";
import { InputField } from "@/src/components/InputField";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert } from "react-native";

export function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  // const createRecovery = useCreateRecovery({
  //   onSuccess: () => {
  //     setLoading(false);
  //     setIsEmailSent(true);
  //   },
  //   onError: (error) => {
  //     console.error("Password recovery error:", error);
  //     setLoading(false);
  //     Alert.alert(
  //       "Error",
  //       "Failed to send password reset email. Please check your email address and try again.",
  //       [{ text: "OK" }]
  //     );
  //   },
  // });

  const handleSendResetEmail = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address", [{ text: "OK" }]);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address", [
        { text: "OK" },
      ]);
      return;
    }

    setLoading(true);

    // createRecovery.mutate({
    //   email,
    //   url: APP_CONFIG.APP_URL + "/auth/reset-password",
    // });
  };

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <ScreenLayout>
      <NavBar>
        <ButtonArrowBack />
      </NavBar>
      <VStack className=" flex-1 gap-4 justify-center ">
      
      <Text className="text-2xl font-bold text-center">نسيت كلمة المرور؟</Text>
      <Text className="text-lg font-bold text-right">
        أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور
      </Text>

      <InputField
        placeholder="البريد الإلكتروني"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        textAlign='right'
      />

      <ButtonAction
        text="إرسال رابط إعادة التعيين"
        onPress={handleSendResetEmail}
        loading={loading}
      />

      <ButtonAction
        text="العودة لتسجيل الدخول"
        onPress={handleBackToLogin}
        variant="outline"
        action="primary"
      />
      </VStack>
    </ScreenLayout>
  );
}

