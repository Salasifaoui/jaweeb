# Authentication Troubleshooting Guide

## Overview

This guide helps diagnose and resolve common issues with the authentication system in the Jaweeb application.

## 🚨 Common Issues

### 1. Authentication State Issues

#### Problem: User appears logged out after app restart

**Symptoms:**
- User needs to login again after closing and reopening the app
- Authentication state is not persisting
- Session appears to be lost

**Possible Causes:**
- Session storage issues
- Appwrite configuration problems
- State management issues

**Solutions:**

```typescript
// Check session persistence
import { authService } from '@/src/features/auth/service/authService';

const checkSession = async () => {
  try {
    const session = await authService.getCurrentSession();
    const user = await authService.getCurrentUser();
    
    if (session && user) {
      console.log('Session is valid:', session.$id);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Session check failed:', error);
    return false;
  }
};
```

```typescript
// Ensure proper auth reload on app start
import { useAuth } from '@/src/features/auth/hooks/useAuth';

function App() {
  const { reload, isAuthenticated, loading } = useAuth();
  
  useEffect(() => {
    // Reload auth state on app start
    reload();
  }, []);
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return isAuthenticated ? <MainApp /> : <AuthFlow />;
}
```

#### Problem: Authentication state not updating

**Symptoms:**
- UI doesn't reflect authentication changes
- State appears stale
- Components not re-rendering

**Solutions:**

```typescript
// Check atom subscriptions
import { useAtom } from 'jotai';
import { userAtom, isAuthenticatedAtom } from '@/src/features/auth/store/authAtoms';

function MyComponent() {
  const [user, setUser] = useAtom(userAtom);
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  
  // Ensure atoms are properly subscribed
  console.log('Current user:', user);
  console.log('Is authenticated:', isAuthenticated);
}
```

```typescript
// Force state refresh
const refreshAuthState = async () => {
  try {
    await reload();
    // Force component re-render
    setRefreshKey(prev => prev + 1);
  } catch (error) {
    console.error('Failed to refresh auth state:', error);
  }
};
```

---

### 2. Profile Completion Issues

#### Problem: Profile completion loop

**Symptoms:**
- User gets stuck in completion flow
- Same screen keeps appearing
- Profile appears incomplete despite being filled

**Debugging Steps:**

```typescript
// Check profile completion logic
import { useCompletedProfile } from '@/src/features/profile/hooks';

function DebugProfileCompletion() {
  const { user } = useAuth();
  const { checkProfileCompletion } = useCompletedProfile();
  
  useEffect(() => {
    if (user) {
      const status = checkProfileCompletion(user);
      console.log('Profile completion status:', {
        isCompleted: status.isCompleted,
        missingFields: status.missingFields,
        nextScreen: status.nextScreen,
        userData: {
          birthday: user.birthday,
          gender: user.gender,
          location: user.location,
          interest: user.interest,
          genderPreference: user.genderPreference,
          ageRange: user.ageRange,
        }
      });
    }
  }, [user]);
}
```

**Common Solutions:**

```typescript
// Fix missing field validation
const checkProfileCompletion = (user: User | null): ProfileCompletionStatus => {
  if (!user) {
    return {
      isCompleted: false,
      missingFields: ['user'],
      nextScreen: '/(auth)/login'
    };
  }

  const missingFields: string[] = [];
  
  // Check for null, undefined, empty string, and empty arrays
  if (!user.birthday || user.birthday.trim() === '') {
    missingFields.push('birthday');
  }
  
  if (!user.gender || user.gender.trim() === '') {
    missingFields.push('gender');
  }
  
  if (!user.genderPreference || user.genderPreference.length === 0) {
    missingFields.push('genderPreference');
  }
  
  if (!user.interest || user.interest.length === 0) {
    missingFields.push('interest');
  }
  
  if (!user.location || user.location.trim() === '') {
    missingFields.push('location');
  }
  
  if (!user.ageRange || user.ageRange.trim() === '') {
    missingFields.push('ageRange');
  }

  // Rest of the logic...
};
```

#### Problem: Profile data not saving

**Symptoms:**
- Form submissions appear successful but data isn't saved
- Profile fields remain empty after completion
- Data loss during completion flow

**Debugging:**

```typescript
// Check profile update service
import { profileService } from '@/src/features/profile/service/profileService';

const debugProfileUpdate = async (userId: string, data: any) => {
  try {
    console.log('Updating profile:', { userId, data });
    const result = await profileService.updateUserProfile(userId, data);
    console.log('Profile update result:', result);
    return result;
  } catch (error) {
    console.error('Profile update failed:', error);
    throw error;
  }
};
```

**Solutions:**

```typescript
// Ensure proper data formatting
const handleProfileUpdate = async (userId: string, data: any) => {
  try {
    // Validate and format data
    const formattedData = {
      ...data,
      // Ensure arrays are properly formatted
      genderPreference: Array.isArray(data.genderPreference) 
        ? data.genderPreference 
        : [data.genderPreference],
      interest: Array.isArray(data.interest) 
        ? data.interest 
        : [data.interest],
    };
    
    await updateProfile(userId, formattedData);
    
    // Verify the update
    const updatedProfile = await profileService.getUserProfile(userId);
    console.log('Profile updated successfully:', updatedProfile);
  } catch (error) {
    console.error('Profile update error:', error);
    Alert.alert('Error', 'Failed to update profile. Please try again.');
  }
};
```

---

### 3. Navigation Issues

#### Problem: Navigation to wrong screen

**Symptoms:**
- User navigates to incorrect completion screen
- Navigation logic not working as expected
- Infinite navigation loops

**Debugging:**

```typescript
// Debug navigation logic
const debugNavigation = (user: User) => {
  const status = checkProfileCompletion(user);
  
  console.log('Navigation debug:', {
    user: {
      birthday: user.birthday,
      gender: user.gender,
      location: user.location,
      interest: user.interest,
      genderPreference: user.genderPreference,
      ageRange: user.ageRange,
    },
    status: {
      isCompleted: status.isCompleted,
      missingFields: status.missingFields,
      nextScreen: status.nextScreen,
    }
  });
  
  return status;
};
```

**Solutions:**

```typescript
// Fix navigation logic
const getNextIncompleteScreen = (user: User | null): string | null => {
  if (!user) return '/(auth)/login';
  
  const status = checkProfileCompletion(user);
  
  // Priority order for completion screens
  if (status.missingFields.includes('birthday') || status.missingFields.includes('gender')) {
    return '/(auth)/complated/gender-birth';
  }
  
  if (status.missingFields.includes('location')) {
    return '/(auth)/complated/location';
  }
  
  if (status.missingFields.includes('genderPreference') || 
      status.missingFields.includes('interest') || 
      status.missingFields.includes('ageRange')) {
    return '/(auth)/complated/preference';
  }
  
  // If all required fields are present, go to main app
  return null;
};
```

#### Problem: Route not found errors

**Symptoms:**
- "Route not found" errors
- Navigation fails with invalid route
- App crashes on navigation

**Solutions:**

```typescript
// Verify route definitions
// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="register" options={{ title: 'Register' }} />
      <Stack.Screen name="forgot-password" options={{ title: 'Forgot Password' }} />
      <Stack.Screen name="complated/welcom" options={{ title: 'Welcome' }} />
      <Stack.Screen name="complated/gender-birth" options={{ title: 'Profile Setup' }} />
      <Stack.Screen name="complated/location" options={{ title: 'Location' }} />
      <Stack.Screen name="complated/preference" options={{ title: 'Preferences' }} />
      <Stack.Screen name="complated/choose-room" options={{ title: 'Choose Room' }} />
    </Stack>
  );
}
```

```typescript
// Safe navigation with error handling
const safeNavigate = (route: string) => {
  try {
    router.push(route);
  } catch (error) {
    console.error('Navigation error:', error);
    // Fallback navigation
    router.push('/(auth)/login');
  }
};
```

---

### 4. Form Validation Issues

#### Problem: Form validation not working

**Symptoms:**
- Invalid data is submitted
- Validation errors not displayed
- Form submission fails silently

**Debugging:**

```typescript
// Debug form validation
import { useZodForm } from '@/src/hooks/useZodForm';

function DebugForm() {
  const {
    values,
    errors,
    setValue,
    validateField,
    handleSubmit,
  } = useZodForm({
    schema: loginSchema,
    initialValues: { email: '', password: '' },
    onSubmit: async (values) => {
      console.log('Form submitted with values:', values);
    },
  });
  
  console.log('Form state:', { values, errors });
  
  return (
    <View>
      <InputField
        value={values.email}
        onChangeText={(value) => setValue('email', value)}
        onBlur={() => validateField('email', values.email)}
        error={errors.email}
      />
    </View>
  );
}
```

**Solutions:**

```typescript
// Fix validation schema
const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long'),
});

// Ensure proper error handling
const handleFormSubmit = async (values: any) => {
  try {
    // Validate before submission
    const validatedData = loginSchema.parse(values);
    await login(validatedData.email, validatedData.password);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      console.error('Validation errors:', error.errors);
    } else {
      // Handle other errors
      console.error('Login error:', error);
    }
  }
};
```

#### Problem: Date picker not working

**Symptoms:**
- Date picker doesn't open
- Selected date not updating
- Age validation failing

**Solutions:**

```typescript
// Fix date picker implementation
import DateTimePickerModal from "react-native-modal-datetime-picker";

function DatePickerComponent() {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  
  const handleConfirm = (date: Date) => {
    // Validate age
    const age = calculateAge(date);
    if (age < 13) {
      Alert.alert('Error', 'You must be at least 13 years old');
      return;
    }
    
    setSelectedDate(date);
    hideDatePicker();
  };
  
  return (
    <View>
      <TouchableOpacity onPress={showDatePicker}>
        <Text>{formatDate(selectedDate)}</Text>
      </TouchableOpacity>
      
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 13))}
      />
    </View>
  );
}

const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};
```

---

### 5. Network and API Issues

#### Problem: API requests failing

**Symptoms:**
- Network errors during authentication
- API calls timing out
- Appwrite service unavailable

**Debugging:**

```typescript
// Debug API connectivity
const testAPIConnection = async () => {
  try {
    console.log('Testing API connection...');
    const user = await authService.getCurrentUser();
    console.log('API connection successful:', !!user);
    return true;
  } catch (error) {
    console.error('API connection failed:', error);
    return false;
  }
};
```

**Solutions:**

```typescript
// Add retry logic
const retryAPICall = async (apiCall: () => Promise<any>, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      console.error(`API call attempt ${i + 1} failed:`, error);
      
      if (i === maxRetries - 1) {
        throw error;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

// Usage
const loginWithRetry = async (email: string, password: string) => {
  return retryAPICall(() => authService.login(email, password));
};
```

```typescript
// Add network status checking
import NetInfo from '@react-native-community/netinfo';

const checkNetworkStatus = async () => {
  const netInfo = await NetInfo.fetch();
  
  if (!netInfo.isConnected) {
    Alert.alert('No Internet', 'Please check your internet connection');
    return false;
  }
  
  return true;
};

const handleLogin = async (email: string, password: string) => {
  if (!(await checkNetworkStatus())) {
    return;
  }
  
  try {
    await login(email, password);
  } catch (error) {
    Alert.alert('Login Failed', 'Please check your credentials and try again');
  }
};
```

---

### 6. Performance Issues

#### Problem: Slow authentication flow

**Symptoms:**
- Long loading times
- UI freezing during auth operations
- Poor user experience

**Solutions:**

```typescript
// Optimize auth state loading
const useOptimizedAuth = () => {
  const [authState, setAuthState] = useState({
    user: null,
    isAuthenticated: false,
    loading: true,
  });
  
  useEffect(() => {
    let isMounted = true;
    
    const loadAuthState = async () => {
      try {
        const [user, session] = await Promise.all([
          authService.getCurrentUser(),
          authService.getCurrentSession(),
        ]);
        
        if (isMounted) {
          setAuthState({
            user,
            isAuthenticated: !!(user && session),
            loading: false,
          });
        }
      } catch (error) {
        if (isMounted) {
          setAuthState({
            user: null,
            isAuthenticated: false,
            loading: false,
          });
        }
      }
    };
    
    loadAuthState();
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  return authState;
};
```

```typescript
// Memoize expensive operations
const useMemoizedProfileCompletion = (user: User | null) => {
  return useMemo(() => {
    if (!user) return { isCompleted: false, missingFields: [], nextScreen: null };
    
    return checkProfileCompletion(user);
  }, [user?.birthday, user?.gender, user?.location, user?.interest, user?.genderPreference, user?.ageRange]);
};
```

---

## 🔧 Debugging Tools

### Debug Logging

```typescript
// Enable debug logging
const DEBUG_AUTH = __DEV__;

const debugLog = (message: string, data?: any) => {
  if (DEBUG_AUTH) {
    console.log(`[AUTH DEBUG] ${message}`, data);
  }
};

// Usage in auth service
export const authService = {
  login: async (email: string, password: string) => {
    debugLog('Login attempt', { email });
    
    try {
      const session = await account.createEmailPasswordSession(email, password);
      debugLog('Login successful', { sessionId: session.$id });
      return session;
    } catch (error) {
      debugLog('Login failed', { error: error.message });
      throw error;
    }
  },
};
```

### State Inspector

```typescript
// Component to inspect auth state
const AuthStateInspector = () => {
  const { user, session, isAuthenticated, loading } = useAuth();
  
  if (!__DEV__) return null;
  
  return (
    <View style={{ position: 'absolute', top: 50, right: 10, backgroundColor: 'rgba(0,0,0,0.8)', padding: 10 }}>
      <Text style={{ color: 'white', fontSize: 12 }}>
        Auth State:
        {'\n'}User: {user ? '✓' : '✗'}
        {'\n'}Session: {session ? '✓' : '✗'}
        {'\n'}Authenticated: {isAuthenticated ? '✓' : '✗'}
        {'\n'}Loading: {loading ? '✓' : '✗'}
      </Text>
    </View>
  );
};
```

### Network Monitor

```typescript
// Monitor network requests
const NetworkMonitor = () => {
  const [requests, setRequests] = useState<any[]>([]);
  
  useEffect(() => {
    const originalFetch = global.fetch;
    
    global.fetch = async (...args) => {
      const startTime = Date.now();
      const response = await originalFetch(...args);
      const endTime = Date.now();
      
      setRequests(prev => [...prev, {
        url: args[0],
        method: args[1]?.method || 'GET',
        status: response.status,
        duration: endTime - startTime,
        timestamp: new Date().toISOString(),
      }]);
      
      return response;
    };
    
    return () => {
      global.fetch = originalFetch;
    };
  }, []);
  
  if (!__DEV__) return null;
  
  return (
    <View style={{ position: 'absolute', bottom: 50, left: 10, backgroundColor: 'rgba(0,0,0,0.8)', padding: 10 }}>
      <Text style={{ color: 'white', fontSize: 10 }}>
        Recent Requests:
        {requests.slice(-3).map((req, i) => (
          <Text key={i}>
            {'\n'}{req.method} {req.status} ({req.duration}ms)
          </Text>
        ))}
      </Text>
    </View>
  );
};
```

---

## 📋 Checklist for Common Issues

### Authentication Issues
- [ ] Check Appwrite configuration
- [ ] Verify environment variables
- [ ] Test network connectivity
- [ ] Check session persistence
- [ ] Verify user permissions

### Profile Completion Issues
- [ ] Validate profile data structure
- [ ] Check field validation logic
- [ ] Verify data persistence
- [ ] Test navigation logic
- [ ] Check completion status

### Form Issues
- [ ] Verify Zod schema definitions
- [ ] Check form field names
- [ ] Test validation rules
- [ ] Verify error handling
- [ ] Check form submission

### Navigation Issues
- [ ] Verify route definitions
- [ ] Check navigation logic
- [ ] Test route parameters
- [ ] Verify fallback routes
- [ ] Check navigation state

### Performance Issues
- [ ] Check for memory leaks
- [ ] Optimize state updates
- [ ] Use memoization
- [ ] Implement lazy loading
- [ ] Monitor network requests

---

## 🆘 Getting Help

### Log Collection

When reporting issues, collect the following information:

```typescript
const collectDebugInfo = () => {
  return {
    timestamp: new Date().toISOString(),
    appVersion: '1.0.0',
    platform: Platform.OS,
    authState: {
      user: !!user,
      session: !!session,
      isAuthenticated,
      loading,
    },
    profileState: {
      birthday: user?.birthday,
      gender: user?.gender,
      location: user?.location,
      interest: user?.interest?.length || 0,
      genderPreference: user?.genderPreference?.length || 0,
      ageRange: user?.ageRange,
    },
    networkStatus: NetInfo.fetch(),
    errors: recentErrors,
  };
};
```

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid credentials" | Wrong email/password | Check user input |
| "Network request failed" | No internet/API down | Check connectivity |
| "Session expired" | Token expired | Re-authenticate |
| "User not found" | Profile not created | Check registration |
| "Validation failed" | Invalid form data | Check input format |

---

*This troubleshooting guide is maintained alongside the codebase. Please update it when new issues are discovered or resolved.*
