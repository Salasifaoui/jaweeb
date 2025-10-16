import { Icon } from "@/components/ui/icon";
import { Button } from "@/src/components/Button";
import { InputField } from "@/src/components/InputField";
import { THEME } from "@/src/theme/theme";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";

export function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const colorScheme = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const styles = createStyles(theme);
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
    <View style={styles.container}>
      <Pressable onPress={handleBackToLogin} className="mb-8 lg:mb-8">
        <Icon as={ChevronLeft} size={24} color="#007AFF" />
      </Pressable>
      <Text style={styles.title}>نسيت كلمة المرور؟</Text>
      <Text style={styles.subtitle}>
        أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور
      </Text>

      <InputField
        placeholder="البريد الإلكتروني"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Button
        title="إرسال رابط إعادة التعيين"
        onPress={handleSendResetEmail}
        loading={loading}
        style={styles.resetButton}
      />

      <Button
        title="العودة لتسجيل الدخول"
        onPress={handleBackToLogin}
        variant="outline"
        style={styles.backButton}
      />
    </View>
  );
}

const createStyles = (theme: typeof THEME.light) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: theme.background,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: theme.foreground,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    color: theme.mutedForeground,
    lineHeight: 24,
  },
  resetButton: {
    marginTop: 20,
  },
  backButton: {
    marginTop: 10,
  },
});
