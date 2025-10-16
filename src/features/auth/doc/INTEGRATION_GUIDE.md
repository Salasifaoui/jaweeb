# Authentication Integration Guide

## Overview

This guide explains how to integrate the authentication system with other parts of the application, including navigation, state management, and external services.

## 🧭 Navigation Integration

### Route Structure

The authentication system uses Expo Router with the following route structure:

```
app/
├── (auth)/
│   ├── _layout.tsx              # Auth layout
│   ├── login.tsx               # Login screen
│   ├── register.tsx            # Registration screen
│   ├── forgot-password.tsx     # Password recovery
│   └── complated/              # Profile completion
│       ├── welcom.tsx          # Welcome screen
│       ├── gender-birth.tsx    # Gender & birthday
│       ├── location.tsx        # Location selection
│       ├── preference.tsx      # Preferences
│       └── choose-room.tsx     # Room selection
├── (tabs)/                     # Main app (protected)
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── camera.tsx
│   ├── community.tsx
│   ├── explore.tsx
│   └── profile.tsx
└── index.tsx                   # App entry point
```

### Navigation Flow

```typescript
// Authentication flow
AuthModal → LoginScreen/RegisterScreen → WelcomePage → Completion Screens → Main App

// Profile completion flow
WelcomePage → GenderBirthPage → LocationPage → PreferencePage → ChooseRoomPage → Main App
```

### Route Protection

```typescript
// app/_layout.tsx
import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { Redirect } from 'expo-router';

export default function RootLayout() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }
  
  return <Redirect href="/(tabs)" />;
}
```

### Dynamic Navigation

```typescript
// Profile completion navigation
import { useCompletedProfile } from '@/src/features/profile/hooks';

function WelcomePage() {
  const { profile } = useAuth();
  const { getNextIncompleteScreen } = useCompletedProfile();
  
  const handleNext = () => {
    const nextScreen = getNextIncompleteScreen(profile);
    if (nextScreen) {
      router.push(nextScreen);
    } else {
      router.push('/(tabs)');
    }
  };
}
```

---

## 🔄 State Management Integration

### Jotai Atoms

The authentication system uses Jotai for state management:

```typescript
// Core auth atoms
import { 
  userAtom, 
  sessionAtom, 
  isAuthenticatedAtom, 
  authLoadingAtom 
} from '@/src/features/auth/store/authAtoms';

// Profile update atoms
import { 
  profileUpdateLoadingAtom,
  profileUpdateErrorAtom,
  profileUpdateSuccessAtom 
} from '@/src/features/auth/store/authAtoms';
```

### Using Auth State

```typescript
import { useAtom } from 'jotai';
import { userAtom, isAuthenticatedAtom } from '@/src/features/auth/store/authAtoms';

function MyComponent() {
  const [user] = useAtom(userAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }
  
  return <UserContent user={user} />;
}
```

### Derived State

```typescript
// Create derived atoms for computed values
import { atom } from 'jotai';

const userDisplayNameAtom = atom((get) => {
  const user = get(userAtom);
  return user?.username || user?.email || 'Guest';
});

const isProfileCompleteAtom = atom((get) => {
  const user = get(userAtom);
  return user?.birthday && user?.gender && user?.location;
});
```

---

## 🎯 Profile System Integration

### Profile Completion Hook

```typescript
import { useCompletedProfile } from '@/src/features/profile/hooks';

function ProfileCompletionWrapper() {
  const { user } = useAuth();
  const { checkProfileCompletion } = useCompletedProfile();
  
  useEffect(() => {
    if (user) {
      const status = checkProfileCompletion(user);
      if (!status.isCompleted) {
        // Redirect to completion flow
        router.push(status.nextScreen);
      }
    }
  }, [user]);
}
```

### Profile Update Integration

```typescript
import { useUpdateProfile } from '@/src/features/profile/hooks';

function ProfileForm() {
  const { user } = useAuth();
  const { updateProfile, loading, error } = useUpdateProfile();
  
  const handleSave = async (data: ProfileData) => {
    try {
      await updateProfile(user.userId, data);
      // Profile updated successfully
    } catch (err) {
      // Handle error
    }
  };
}
```

### Profile Data Flow

```typescript
// Data flow for profile updates
User Input → Form Validation → useUpdateProfile → Profile Service → Database → Auth State Update
```

---

## 🔌 External Service Integration

### Appwrite Configuration

```typescript
// src/config/index.ts
export const APP_CONFIG = {
  DATABASE_ID: process.env.EXPO_PUBLIC_DATABASE_ID,
  USERS_COLLECTION: 'users',
  APP_URL: process.env.EXPO_PUBLIC_APP_URL,
};

// src/services/apiService.tsx
import { Client, Account, Databases } from 'react-native-appwrite';

const client = new Client();
client
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
```

### Environment Variables

```bash
# .env
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
EXPO_PUBLIC_DATABASE_ID=your-database-id
EXPO_PUBLIC_APP_URL=https://your-app-url.com
```

### Service Layer Integration

```typescript
// Authentication service
import { authService } from '@/src/features/auth/service/authService';

// Profile service
import { profileService } from '@/src/features/profile/service/profileService';

// Media service
import { mediaService } from '@/src/services/mediaService';
```

---

## 🎨 UI Component Integration

### Themed Components

```typescript
import { ThemedView, ThemedText } from '@/components/themed-view';
import { Button } from '@/src/components/Button';
import { InputField } from '@/src/components/InputField';

function AuthForm() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Sign In</ThemedText>
      <InputField placeholder="Email" />
      <Button title="Sign In" />
    </ThemedView>
  );
}
```

### Custom Components

```typescript
// Avatar selection integration
import { ListAvatars } from '@/components/ui/list-avatars/list-avatars';
import { UserAvatar } from '@/components/ui/user-avatar/user-avatar';

function ProfileSetup() {
  const { profile } = useAuth();
  
  return (
    <View>
      <UserAvatar user={profile} size={100} />
      <ListAvatars userProfile={profile} setShowGallery={setIsOpen} />
    </View>
  );
}
```

### Icon Integration

```typescript
import { IconsList } from '@/components/icons/icons';

function SocialLogin() {
  return (
    <View>
      <IconsList.google width={24} height={24} />
      <IconsList.apple width={24} height={24} />
      <IconsList.facebook width={24} height={24} />
    </View>
  );
}
```

---

## 📱 Form Integration

### Zod Validation

```typescript
import { useZodForm } from '@/src/hooks/useZodForm';
import { loginSchema } from '@/src/validation/schemas';

function LoginForm() {
  const {
    values,
    errors,
    setValue,
    setFieldTouched,
    validateField,
    handleSubmit,
  } = useZodForm({
    schema: loginSchema,
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      await login(values.email, values.password);
    },
  });
  
  return (
    <View>
      <InputField
        value={values.email}
        onChangeText={(value) => setValue('email', value)}
        onBlur={() => setFieldTouched('email')}
        error={errors.email}
      />
      <Button onPress={handleSubmit} title="Sign In" />
    </View>
  );
}
```

### Form Schemas

```typescript
// src/validation/schemas.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  username: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
```

---

## 🔐 Security Integration

### Session Management

```typescript
// Automatic session validation
import { useAuth } from '@/src/features/auth/hooks/useAuth';

function App() {
  const { isAuthenticated, loading, reload } = useAuth();
  
  useEffect(() => {
    // Reload auth state on app focus
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        reload();
      }
    };
    
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [reload]);
}
```

### Input Sanitization

```typescript
// Sanitize user inputs
import { z } from 'zod';

const sanitizeInput = (input: string) => {
  return input.trim().replace(/[<>]/g, '');
};

const userInputSchema = z.string()
  .transform(sanitizeInput)
  .min(1, 'Input is required');
```

### Error Handling

```typescript
// Global error handling
import { Alert } from 'react-native';

const handleAuthError = (error: Error) => {
  if (error.message.includes('Invalid credentials')) {
    Alert.alert('Error', 'Invalid email or password');
  } else if (error.message.includes('Network')) {
    Alert.alert('Error', 'Network connection failed');
  } else {
    Alert.alert('Error', 'An unexpected error occurred');
  }
};
```

---

## 🎯 Custom Hook Integration

### Creating Custom Auth Hooks

```typescript
// Custom hook for auth state
import { useAuth } from '@/src/features/auth/hooks/useAuth';

export function useAuthState() {
  const { user, isAuthenticated, loading } = useAuth();
  
  return {
    isLoggedIn: isAuthenticated,
    user,
    isLoading: loading,
    isGuest: user?.email === '',
  };
}

// Custom hook for profile completion
export function useProfileCompletion() {
  const { user } = useAuth();
  const { checkProfileCompletion } = useCompletedProfile();
  
  const completionStatus = useMemo(() => {
    return checkProfileCompletion(user);
  }, [user, checkProfileCompletion]);
  
  return {
    isComplete: completionStatus.isCompleted,
    missingFields: completionStatus.missingFields,
    nextScreen: completionStatus.nextScreen,
  };
}
```

### Hook Composition

```typescript
// Compose multiple hooks
function useAuthWithProfile() {
  const auth = useAuth();
  const profile = useUserService(auth.user?.userId || '');
  const completion = useProfileCompletion();
  
  return {
    ...auth,
    profile: profile.userProfile,
    isProfileComplete: completion.isComplete,
  };
}
```

---

## 🚀 Performance Optimization

### Lazy Loading

```typescript
// Lazy load auth components
import { lazy, Suspense } from 'react';

const AuthModal = lazy(() => import('@/src/features/auth/ui/auth-modal'));
const LoginScreen = lazy(() => import('@/src/features/auth/ui/LoginScreen'));

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AuthModal />
    </Suspense>
  );
}
```

### Memoization

```typescript
// Memoize expensive computations
import { useMemo } from 'react';

function ProfileCompletionStatus() {
  const { user } = useAuth();
  const { checkProfileCompletion } = useCompletedProfile();
  
  const completionStatus = useMemo(() => {
    return checkProfileCompletion(user);
  }, [user, checkProfileCompletion]);
  
  return <CompletionIndicator status={completionStatus} />;
}
```

### State Optimization

```typescript
// Optimize state updates
import { useCallback } from 'react';

function AuthForm() {
  const { login } = useAuth();
  
  const handleLogin = useCallback(async (email: string, password: string) => {
    try {
      await login(email, password);
    } catch (error) {
      // Handle error
    }
  }, [login]);
  
  return <LoginForm onLogin={handleLogin} />;
}
```

---

## 🧪 Testing Integration

### Mock Authentication

```typescript
// Mock auth service for testing
const mockAuthService = {
  login: jest.fn().mockResolvedValue({ $id: 'test-user' }),
  register: jest.fn().mockResolvedValue({ $id: 'test-user' }),
  logout: jest.fn().mockResolvedValue(undefined),
  getCurrentUser: jest.fn().mockResolvedValue({ $id: 'test-user' }),
};

// Mock auth hook
const mockUseAuth = () => ({
  user: { $id: 'test-user', email: 'test@example.com' },
  isAuthenticated: true,
  loading: false,
  login: mockAuthService.login,
  register: mockAuthService.register,
  logout: mockAuthService.logout,
});
```

### Component Testing

```typescript
// Test auth components
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '@/src/features/auth/ui/LoginScreen';

test('should login with valid credentials', async () => {
  const mockLogin = jest.fn();
  const { getByPlaceholderText, getByText } = render(
    <LoginScreen onLogin={mockLogin} />
  );
  
  fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
  fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
  fireEvent.press(getByText('Sign In'));
  
  await waitFor(() => {
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });
});
```

---

## 🔧 Configuration Management

### Environment-based Configuration

```typescript
// Environment-specific configs
const config = {
  development: {
    APPWRITE_ENDPOINT: 'http://localhost:8080/v1',
    APP_URL: 'http://localhost:3000',
  },
  production: {
    APPWRITE_ENDPOINT: 'https://cloud.appwrite.io/v1',
    APP_URL: 'https://your-app.com',
  },
};

export const APP_CONFIG = config[process.env.NODE_ENV || 'development'];
```

### Feature Flags

```typescript
// Feature flag integration
const FEATURE_FLAGS = {
  ENABLE_SOCIAL_LOGIN: process.env.EXPO_PUBLIC_ENABLE_SOCIAL_LOGIN === 'true',
  ENABLE_GUEST_MODE: process.env.EXPO_PUBLIC_ENABLE_GUEST_MODE === 'true',
  ENABLE_BIOMETRIC_AUTH: process.env.EXPO_PUBLIC_ENABLE_BIOMETRIC_AUTH === 'true',
};

function AuthModal() {
  return (
    <View>
      {FEATURE_FLAGS.ENABLE_SOCIAL_LOGIN && <SocialLoginButtons />}
      {FEATURE_FLAGS.ENABLE_GUEST_MODE && <GuestLoginButton />}
    </View>
  );
}
```

---

## 📊 Analytics Integration

### Auth Event Tracking

```typescript
// Track authentication events
import { analytics } from '@/src/services/analytics';

const trackAuthEvent = (event: string, properties?: any) => {
  analytics.track(event, {
    timestamp: new Date().toISOString(),
    ...properties,
  });
};

// Usage in auth service
export const authService = {
  login: async (email: string, password: string) => {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      trackAuthEvent('user_login', { method: 'email' });
      return session;
    } catch (error) {
      trackAuthEvent('login_failed', { error: error.message });
      throw error;
    }
  },
};
```

### Profile Completion Tracking

```typescript
// Track profile completion progress
const trackProfileCompletion = (step: string, completed: boolean) => {
  analytics.track('profile_completion_step', {
    step,
    completed,
    timestamp: new Date().toISOString(),
  });
};

// Usage in completion screens
function GenderBirthPage() {
  const handleNext = async () => {
    await updateProfile(userId, data);
    trackProfileCompletion('gender_birth', true);
    router.push('/(auth)/complated/location');
  };
}
```

---

## 🚀 Deployment Considerations

### Build Configuration

```typescript
// app.json
{
  "expo": {
    "name": "Jaweeb",
    "slug": "jaweeb",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.jaweeb.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": "com.jaweeb.app"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

### Environment Variables

```bash
# Production environment
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=production-project-id
EXPO_PUBLIC_DATABASE_ID=production-database-id
EXPO_PUBLIC_APP_URL=https://jaweeb.com
```

---

*This integration guide is maintained alongside the codebase. Please update it when making changes to the authentication system.*
