import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="inscription" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
      <Stack.Screen name="complated/welcom" options={{ headerShown: false }} />
      <Stack.Screen name="complated/gender-birth" options={{ headerShown: false }} />
      <Stack.Screen name="complated/location" options={{ headerShown: false }} />
      <Stack.Screen name="complated/preference" options={{ headerShown: false }} />
      <Stack.Screen name="complated/choose-room" options={{ headerShown: false }} />
    </Stack>
  );
}
