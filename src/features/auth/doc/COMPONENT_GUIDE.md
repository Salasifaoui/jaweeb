# Authentication Components Guide

## Overview

This guide provides detailed information about each authentication component, their usage, customization options, and integration patterns.

## 🎨 UI Components

### 1. AuthModal (`ui/auth-modal.tsx`)

The main authentication entry point with multiple sign-in options.

#### Features
- **Multiple Authentication Methods**: Google, Email, Apple
- **Social Media Integration**: Facebook, Instagram, TikTok
- **Legal Compliance**: Terms of Use, Privacy Policy links
- **Branding**: ZixDev powered by section

#### Usage
```typescript
import { AuthModal } from '@/src/features/auth';

function App() {
  return (
    <View style={{ flex: 1 }}>
      <AuthModal />
    </View>
  );
}
```

#### Customization Options
```typescript
// Custom styling
const customStyles = {
  container: {
    backgroundColor: '#f5f5f5',
  },
  logoText: {
    color: '#your-brand-color',
  },
  primaryButton: {
    backgroundColor: '#your-primary-color',
  }
};
```

#### Event Handlers
- `handleEmailSignIn()`: Navigates to email login
- `handleGoogleSignIn()`: Google OAuth (placeholder)
- `handleAppleSignIn()`: Apple OAuth (placeholder)
- `handleFacebookSignIn()`: Facebook OAuth (placeholder)
- `handleTwitterSignIn()`: Twitter OAuth (placeholder)
- `handleVKSignIn()`: VK OAuth (placeholder)

#### Legal Links
- Terms of Use: `https://example.com/terms`
- Broadcaster Agreement: `https://example.com/broadcaster-agreement`
- Privacy Policy: `https://example.com/privacy`
- ZixDev: `https://zixdev.com`

---

### 2. LoginScreen (`ui/LoginScreen.tsx`)

Standard email/password authentication form.

#### Features
- **Form Validation**: Real-time validation using Zod
- **Loading States**: Button loading during authentication
- **Navigation**: Links to registration and password recovery
- **Internationalization**: Arabic language support
- **Error Handling**: User-friendly error messages

#### Usage
```typescript
import { LoginScreen } from '@/src/features/auth';

function AuthFlow() {
  return <LoginScreen />;
}
```

#### Form Fields
```typescript
interface LoginFormData {
  email: string;      // Required, email format
  password: string;   // Required, minimum length
}
```

#### Validation Rules
```typescript
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
```

#### Navigation Actions
- **Register**: Navigates to `/(auth)/register`
- **Forgot Password**: Navigates to `/(auth)/forgot-password`
- **Success**: Navigates to `/(tabs)` after successful login

#### Customization
```typescript
// Custom button styles
const customButtonStyles = {
  loginButton: {
    backgroundColor: '#your-primary-color',
    borderRadius: 8,
  },
  registerButton: {
    borderColor: '#your-secondary-color',
  }
};
```

---

### 3. RegisterScreen (`ui/RegisterScreen.tsx`)

User registration form with comprehensive validation.

#### Features
- **Multi-field Form**: Name, email, password, confirm password
- **Password Confirmation**: Ensures password matching
- **Real-time Validation**: Instant feedback on field changes
- **Error Display**: Comprehensive error messaging
- **Auto-login**: Automatically logs in after successful registration

#### Usage
```typescript
import { RegisterScreen } from '@/src/features/auth';

function RegistrationFlow() {
  return <RegisterScreen />;
}
```

#### Form Fields
```typescript
interface CreateUserFormData {
  username: string;        // Required, display name
  email: string;          // Required, valid email
  password: string;       // Required, minimum strength
  confirmPassword: string; // Required, must match password
}
```

#### Validation Rules
```typescript
const createUserSchema = z.object({
  username: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
```

#### Registration Flow
1. User fills form with validation
2. Form submission triggers registration
3. User account created in Appwrite
4. Profile created in database
5. Automatic login after success
6. Navigation to main app

#### Error Handling
```typescript
// Error display component
{errors && (
  <View style={styles.errorContainer}>
    <Text style={styles.errorTitle}>{errors}</Text>
    <Text style={styles.errorDescription}>{errors}</Text>
  </View>
)}
```

---

### 4. ForgotPasswordScreen (`ui/ForgetPassword.tsx`)

Password recovery functionality.

#### Features
- **Email Input**: Single field for password reset
- **Email Validation**: Format validation before submission
- **Loading States**: Button loading during request
- **Success Feedback**: Confirmation when email is sent
- **Navigation**: Back to login screen

#### Usage
```typescript
import { ForgotPasswordScreen } from '@/src/features/auth';

function PasswordRecoveryFlow() {
  return <ForgotPasswordScreen />;
}
```

#### Email Validation
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  Alert.alert("Error", "Please enter a valid email address");
  return;
}
```

#### Password Reset Flow
1. User enters email address
2. Email format validation
3. Reset request sent to backend
4. Success confirmation displayed
5. Option to return to login

#### Customization
```typescript
// Custom reset URL
const resetUrl = `${APP_CONFIG.APP_URL}/auth/reset-password`;

// Custom email template
const emailTemplate = {
  subject: 'Password Reset Request',
  body: 'Click the link to reset your password...'
};
```

---

## 🚀 Profile Completion Components

### 1. WelcomePage (`ui/completed/welcom.tsx`)

Welcome screen with profile completion logic.

#### Features
- **Profile Completion Check**: Automatically checks if profile is complete
- **Avatar Selection**: User can choose or upload avatar
- **Smart Navigation**: Redirects based on missing profile fields
- **Feature Highlights**: Shows app benefits
- **Branding**: App logo and name display

#### Usage
```typescript
import { WelcomePage } from '@/src/features/auth';

function OnboardingFlow() {
  return <WelcomePage />;
}
```

#### Profile Completion Logic
```typescript
useEffect(() => {
  if (profile) {
    const completionStatus = checkProfileCompletion(profile);
    if (completionStatus.isCompleted) {
      router.push('/(tabs)');
    }
  }
}, [profile, checkProfileCompletion]);
```

#### Avatar Selection
```typescript
// Avatar selection with gallery
{isOpen && (
  <ListAvatars 
    userProfile={profile} 
    setShowGallery={setIsOpen} 
  />
)}
```

#### Navigation Logic
```typescript
const handleNext = () => {
  if (profile) {
    const nextScreen = getNextIncompleteScreen(profile);
    if (nextScreen) {
      router.push(nextScreen);
    } else {
      router.push('/(tabs)');
    }
  }
};
```

---

### 2. GenderBirthPage (`ui/completed/gender-birth.tsx`)

Gender and birthday selection with age validation.

#### Features
- **Gender Selection**: Multiple gender options with emojis
- **Date Picker**: Modal date picker for birthday
- **Age Validation**: Ensures minimum age of 13
- **Data Persistence**: Saves to user profile
- **Skip Option**: Allows skipping this step

#### Usage
```typescript
import { GenderBirthPage } from '@/src/features/auth';

function ProfileCompletionFlow() {
  return <GenderBirthPage />;
}
```

#### Gender Options
```typescript
const genders = [
  { id: 'male', label: 'Male', emoji: '👨' },
  { id: 'female', label: 'Female', emoji: '👩' },
  { id: 'non-binary', label: 'Non-binary', emoji: '🧑' },
  { id: 'prefer-not-to-say', label: 'Prefer not to say', emoji: '🤐' },
];
```

#### Age Validation
```typescript
const isAgeValid = (birthDateString: string): boolean => {
  const [day, month, year] = birthDateString.split("/").map(Number);
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age >= 13;
};
```

#### Date Picker Configuration
```typescript
<DateTimePickerModal
  isVisible={isDatePickerVisible}
  mode="date"
  onConfirm={(date) => {
    const maximumDate = new Date(
      new Date().setFullYear(new Date().getFullYear() - 13)
    );
    
    if (date.toDateString() === new Date().toDateString()) {
      date = maximumDate;
    }
    
    setSelectedDate(date);
    setDatePickerVisibility(false);
  }}
  maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 13))}
/>
```

#### Data Persistence
```typescript
const handleNext = async () => {
  if (!selectedGender) {
    Alert.alert('Gender Required', 'Please select your gender to continue.');
    return;
  }

  try {
    const birthdayString = selectedDate.toISOString().split('T')[0];
    
    await updateProfile(profile.userId, {
      gender: selectedGender,
      birthday: birthdayString,
    });

    router.push('/(auth)/complated/location');
  } catch (err) {
    Alert.alert('Error', 'Failed to update profile. Please try again.');
  }
};
```

---

### 3. LocationPage (`ui/completed/location.tsx`)

Location selection with popular cities and custom input.

#### Features
- **Popular Locations**: Grid of major cities
- **Custom Location**: Text input for custom locations
- **Location Validation**: Ensures location is selected
- **Data Persistence**: Saves location to profile
- **Skip Option**: Allows skipping location

#### Usage
```typescript
import { LocationPage } from '@/src/features/auth';

function LocationSelectionFlow() {
  return <LocationPage />;
}
```

#### Popular Locations
```typescript
const popularLocations = [
  { id: 'new-york', label: 'New York, NY', emoji: '🗽' },
  { id: 'los-angeles', label: 'Los Angeles, CA', emoji: '🌴' },
  { id: 'chicago', label: 'Chicago, IL', emoji: '🏙️' },
  { id: 'houston', label: 'Houston, TX', emoji: '🤠' },
  // ... more locations
];
```

#### Location Selection Logic
```typescript
const handleLocationSelect = (locationId: string) => {
  setSelectedLocation(locationId);
  setShowCustomInput(false);
  setCustomLocation('');
};

const handleCustomLocation = () => {
  setShowCustomInput(true);
  setSelectedLocation('');
};
```

#### Data Persistence
```typescript
const handleNext = async () => {
  const location = selectedLocation || customLocation;
  if (!location) {
    Alert.alert('Location Required', 'Please select or enter your location to continue.');
    return;
  }

  try {
    let locationLabel = location;
    if (selectedLocation) {
      const locationObj = popularLocations.find(loc => loc.id === selectedLocation);
      locationLabel = locationObj ? locationObj.label : location;
    } else {
      locationLabel = customLocation;
    }

    await updateProfile(profile.userId, {
      location: locationLabel,
    });

    router.push('/(auth)/complated/preference');
  } catch (err) {
    Alert.alert('Error', 'Failed to update location. Please try again.');
  }
};
```

---

### 4. PreferencePage (`ui/completed/preference.tsx`)

Interests, age range, and gender preferences selection.

#### Features
- **Interest Selection**: Multiple choice interests with emojis
- **Age Range**: Age preference selection
- **Gender Preference**: Gender preference selection
- **Data Persistence**: Saves preferences to profile
- **Skip Option**: Allows skipping preferences

#### Usage
```typescript
import { PreferencePage } from '@/src/features/auth';

function PreferenceSelectionFlow() {
  return <PreferencePage />;
}
```

#### Interest Categories
```typescript
const interests = [
  { id: 'gaming', label: 'Gaming', emoji: '🎮' },
  { id: 'music', label: 'Music', emoji: '🎵' },
  { id: 'sports', label: 'Sports', emoji: '⚽' },
  { id: 'movies', label: 'Movies', emoji: '🎬' },
  { id: 'books', label: 'Books', emoji: '📚' },
  { id: 'travel', label: 'Travel', emoji: '✈️' },
  { id: 'food', label: 'Food', emoji: '🍕' },
  { id: 'fitness', label: 'Fitness', emoji: '💪' },
  { id: 'art', label: 'Art', emoji: '🎨' },
  { id: 'technology', label: 'Technology', emoji: '💻' },
  { id: 'photography', label: 'Photography', emoji: '📸' },
  { id: 'fashion', label: 'Fashion', emoji: '👗' },
];
```

#### Age Range Options
```typescript
const ageRanges = [
  { id: '13-17', label: '13-17' },
  { id: '18-20', label: '18-20' },
  { id: '18-25', label: '18-25' },
  { id: '26-35', label: '26-35' },
  { id: '36-45', label: '36-45' },
  { id: '46-55', label: '46-55' },
  { id: '55+', label: '55+' },
];
```

#### Gender Preferences
```typescript
const genderPreferences = [
  { id: 'male', label: 'Male', emoji: '👨' },
  { id: 'female', label: 'Female', emoji: '👩' },
  { id: 'all', label: 'All', emoji: '👥' },
];
```

#### Interest Toggle Logic
```typescript
const toggleInterest = (interestId: string) => {
  setSelectedInterests(prev => 
    prev.includes(interestId) 
      ? prev.filter(id => id !== interestId)
      : [...prev, interestId]
  );
};
```

#### Data Persistence
```typescript
const handleNext = async () => {
  try {
    const updateData: any = {};
    
    if (selectedInterests.length > 0) {
      updateData.interest = selectedInterests;
    }
    
    if (selectedAgeRange) {
      updateData.ageRange = selectedAgeRange;
    }
    
    if (selectedGenderPreference) {
      updateData.genderPreference = [selectedGenderPreference];
    }

    await updateProfile(profile.userId, updateData);
    router.push('/(auth)/complated/choose-room');
  } catch (err) {
    Alert.alert('Error', 'Failed to update preferences. Please try again.');
  }
};
```

---

### 5. ChooseRoomPage (`ui/completed/choose-room.tsx`)

Final step for room selection and profile completion.

#### Features
- **Room Categories**: Organized by interest categories
- **Multiple Selection**: Users can select multiple rooms
- **Member Counts**: Shows room popularity
- **Room Descriptions**: Brief descriptions for each room
- **Final Completion**: Last step before entering main app

#### Usage
```typescript
import { ChooseRoomPage } from '@/src/features/auth';

function RoomSelectionFlow() {
  return <ChooseRoomPage />;
}
```

#### Room Categories
```typescript
const roomCategories = [
  {
    id: 'gaming',
    title: 'Gaming',
    emoji: '🎮',
    description: 'Connect with fellow gamers',
    rooms: [
      { id: 'general-gaming', name: 'General Gaming', members: '2.3k' },
      { id: 'fortnite', name: 'Fortnite', members: '1.8k' },
      { id: 'valorant', name: 'Valorant', members: '1.2k' },
      { id: 'minecraft', name: 'Minecraft', members: '956' },
    ]
  },
  // ... more categories
];
```

#### Room Selection Logic
```typescript
const toggleRoom = (roomId: string) => {
  setSelectedRooms(prev => 
    prev.includes(roomId) 
      ? prev.filter(id => id !== roomId)
      : [...prev, roomId]
  );
};
```

#### Completion Flow
```typescript
const handleComplete = () => {
  // Save selected rooms to user profile
  // Navigate to main app
  router.push('/(tabs)');
};
```

---

## 🎨 Styling and Theming

### Common Style Patterns

#### Container Styles
```typescript
const containerStyles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
};
```

#### Button Styles
```typescript
const buttonStyles = {
  primaryButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingVertical: 16,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
};
```

#### Form Styles
```typescript
const formStyles = {
  inputField: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  errorContainer: {
    backgroundColor: '#FFE6E6',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
};
```

### Customization Options

#### Theme Colors
```typescript
const theme = {
  primary: '#FF6B6B',
  secondary: '#F8F9FA',
  text: '#333',
  textSecondary: '#666',
  border: '#E5E5EA',
  error: '#FF3B30',
  success: '#34C759',
};
```

#### Typography
```typescript
const typography = {
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  body: {
    fontSize: 14,
    color: '#333',
  },
};
```

---

## 🔧 Integration Patterns

### Navigation Integration
```typescript
import { router } from 'expo-router';

// Navigate to completion screens
router.push('/(auth)/complated/gender-birth');
router.push('/(auth)/complated/location');
router.push('/(auth)/complated/preference');
router.push('/(auth)/complated/choose-room');

// Navigate to main app
router.push('/(tabs)');
```

### State Management Integration
```typescript
import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { useUpdateProfile } from '@/src/features/profile/hooks';

function MyComponent() {
  const { user, profile } = useAuth();
  const { updateProfile } = useUpdateProfile();
  
  // Use auth state and profile updates
}
```

### Form Validation Integration
```typescript
import { useZodForm } from '@/src/hooks/useZodForm';
import { loginSchema } from '@/src/validation/schemas';

function LoginForm() {
  const { values, setValue, handleSubmit } = useZodForm({
    schema: loginSchema,
    onSubmit: async (values) => {
      // Handle form submission
    },
  });
}
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Navigation Errors
```typescript
// Ensure proper route definitions
router.push('/(auth)/complated/gender-birth'); // ✅ Correct
router.push('/auth/complated/gender-birth');   // ❌ Incorrect
```

#### 2. Form Validation Issues
```typescript
// Check schema definitions
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Ensure field names match
<InputField
  value={values.email}           // ✅ Matches schema
  onChangeText={(value) => setValue('email', value)}
/>
```

#### 3. State Management Issues
```typescript
// Use hooks properly
const { user, profile } = useAuth(); // ✅ Correct
const user = userAtom.get();         // ❌ Don't access atoms directly
```

#### 4. Profile Completion Loop
```typescript
// Check completion logic
const status = checkProfileCompletion(profile);
if (status.isCompleted) {
  router.push('/(tabs)');
} else {
  router.push(status.nextScreen);
}
```

---

## 📱 Responsive Design

### Screen Size Considerations
```typescript
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const responsiveStyles = {
  container: {
    paddingHorizontal: width > 768 ? 40 : 24,
  },
  button: {
    width: width > 768 ? 'auto' : '100%',
  },
};
```

### Orientation Handling
```typescript
import { useDeviceOrientation } from '@react-native-community/hooks';

function ResponsiveComponent() {
  const orientation = useDeviceOrientation();
  
  const styles = orientation.portrait ? portraitStyles : landscapeStyles;
  
  return <View style={styles.container} />;
}
```

---

*This component guide is maintained alongside the codebase. Please update it when making changes to authentication components.*
