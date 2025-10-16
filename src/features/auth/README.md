# Authentication Module Documentation

## Overview

The Authentication module (`src/features/auth/`) provides a comprehensive authentication system for the Jaweeb application. It handles user registration, login, profile completion, and session management using Appwrite as the backend service.

## 📁 Folder Structure

```
src/features/auth/
├── doc/                          # Documentation files
├── hooks/                        # Custom React hooks
│   └── useAuth.ts               # Main authentication hook
├── service/                      # Authentication services
│   └── authService.ts           # Appwrite authentication service
├── store/                        # State management
│   └── authAtoms.ts             # Jotai atoms for auth state
├── ui/                          # User interface components
│   ├── auth-modal.tsx           # Main authentication modal
│   ├── LoginScreen.tsx          # Login form component
│   ├── RegisterScreen.tsx       # Registration form component
│   ├── ForgetPassword.tsx       # Password recovery component
│   └── completed/               # Profile completion screens
│       ├── welcom.tsx           # Welcome/onboarding screen
│       ├── gender-birth.tsx     # Gender and birthday selection
│       ├── location.tsx         # Location selection
│       ├── preference.tsx       # Interests and preferences
│       └── choose-room.tsx      # Room selection
├── index.ts                     # Module exports
└── types.ts                     # TypeScript type definitions
```

## 🔧 Core Components

### 1. Authentication Service (`service/authService.ts`)

The authentication service handles all backend communication with Appwrite:

#### Key Methods:
- **`register(name, email, password)`**: Creates a new user account and profile
- **`login(email, password)`**: Authenticates user and creates session
- **`loginAsGuest()`**: Creates a guest session for anonymous users
- **`logout()`**: Terminates current session
- **`getCurrentUser()`**: Retrieves current authenticated user
- **`getCurrentSession()`**: Gets current session information

#### Example Usage:
```typescript
import { authService } from '@/src/features/auth/service/authService';

// Register new user
const user = await authService.register('John Doe', 'john@example.com', 'password123');

// Login user
const session = await authService.login('john@example.com', 'password123');

// Get current user
const currentUser = await authService.getCurrentUser();
```

### 2. Authentication Hook (`hooks/useAuth.ts`)

The main authentication hook provides a clean interface for components to interact with authentication:

#### Features:
- User state management
- Session handling
- Profile data management
- Loading states
- Error handling

#### Returns:
```typescript
{
  user: User | null;           // Appwrite user object
  profile: User | null;        // Extended user profile
  loading: boolean;            // Loading state
  login: (email, password) => Promise<void>;
  register: (name, email, password) => Promise<User | null>;
  logout: () => Promise<void>;
  reload: () => Promise<void>;
  loginAsGuest: () => Promise<void>;
  session: Session | null;
  isAuthenticated: boolean;
}
```

#### Example Usage:
```typescript
import { useAuth } from '@/src/features/auth/hooks/useAuth';

function LoginComponent() {
  const { login, loading, user, isAuthenticated } = useAuth();
  
  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      // User is now authenticated
    } catch (error) {
      // Handle login error
    }
  };
  
  return (
    // Your login UI
  );
}
```

### 3. State Management (`store/authAtoms.ts`)

Uses Jotai for state management with the following atoms:

#### Core Atoms:
- **`userAtom`**: Current user data
- **`sessionAtom`**: Current session information
- **`isAuthenticatedAtom`**: Authentication status
- **`authLoadingAtom`**: Loading state for auth operations

#### Derived Atoms:
- **`authStateAtom`**: Combined authentication state

#### Profile Update Atoms:
- **`profileUpdateLoadingAtom`**: Profile update loading state
- **`profileUpdateErrorAtom`**: Profile update error messages
- **`profileUpdateSuccessAtom`**: Profile update success status

## 🎨 User Interface Components

### 1. Authentication Modal (`ui/auth-modal.tsx`)

The main entry point for authentication, providing multiple sign-in options:

#### Features:
- Google Sign-In button
- Email/Password sign-in
- Apple Sign-In button
- Social media integration (Facebook, Instagram, TikTok)
- Legal links (Terms of Use, Privacy Policy)
- Powered by ZixDev branding

#### Usage:
```typescript
import { AuthModal } from '@/src/features/auth';

function App() {
  return <AuthModal />;
}
```

### 2. Login Screen (`ui/LoginScreen.tsx`)

Standard email/password login form with validation:

#### Features:
- Email and password input fields
- Form validation using Zod schemas
- Loading states
- Navigation to registration and password recovery
- Arabic language support

#### Form Validation:
- Email format validation
- Password requirements
- Real-time field validation

### 3. Registration Screen (`ui/RegisterScreen.tsx`)

User registration form with comprehensive validation:

#### Features:
- Full name, email, password, and confirm password fields
- Password confirmation matching
- Form validation with error display
- Automatic login after successful registration
- Navigation to login screen

#### Validation Rules:
- Username: Required, minimum length
- Email: Valid email format
- Password: Minimum strength requirements
- Confirm Password: Must match password

### 4. Password Recovery (`ui/ForgetPassword.tsx`)

Password reset functionality:

#### Features:
- Email input for password reset
- Email validation
- Loading states
- Success/error feedback
- Navigation back to login

## 🚀 Profile Completion Flow

The profile completion system guides new users through setting up their profiles:

### 1. Welcome Screen (`ui/completed/welcom.tsx`)

#### Features:
- App branding and welcome message
- Avatar selection with gallery
- Profile completion check
- Automatic redirection based on missing fields
- Feature highlights

#### Profile Completion Logic:
- Checks for missing required fields
- Redirects to appropriate completion screen
- Handles completed profiles by navigating to main app

### 2. Gender & Birthday (`ui/completed/gender-birth.tsx`)

#### Features:
- Gender selection (Male, Female, Non-binary, Prefer not to say)
- Date picker for birthday selection
- Age validation (minimum 13 years)
- Data persistence using `useUpdateProfile`
- Skip option

#### Age Validation:
- Minimum age of 13 years
- Real-time date validation
- Maximum date restriction

### 3. Location Selection (`ui/completed/location.tsx`)

#### Features:
- Popular locations grid
- Custom location input
- Location validation
- Data persistence
- Skip option

#### Location Options:
- Pre-defined popular cities
- Custom location entry
- Location display formatting

### 4. Preferences (`ui/completed/preference.tsx`)

#### Features:
- Interest selection (multiple choice)
- Age range preference
- Gender preference
- Data persistence
- Skip option

#### Interest Categories:
- Gaming, Music, Sports, Movies
- Books, Travel, Food, Fitness
- Art, Technology, Photography, Fashion

### 5. Room Selection (`ui/completed/choose-room.tsx`)

#### Features:
- Room category browsing
- Multiple room selection
- Member count display
- Room descriptions
- Final completion step

#### Room Categories:
- Gaming rooms (Fortnite, Valorant, Minecraft)
- Music rooms (Pop, Hip Hop, Rock, Electronic)
- Lifestyle rooms (Fitness, Food, Travel, Fashion)
- Technology rooms

## 🔄 Integration with Profile System

The authentication module integrates with the profile system for complete user management:

### Profile Completion Hook Integration:
```typescript
import { useCompletedProfile } from '@/src/features/profile/hooks';

// Check if profile is completed
const { checkProfileCompletion, getNextIncompleteScreen } = useCompletedProfile();
const status = checkProfileCompletion(user);
```

### Profile Update Integration:
```typescript
import { useUpdateProfile } from '@/src/features/profile/hooks';

// Update user profile
const { updateProfile } = useUpdateProfile();
await updateProfile(userId, {
  gender: 'male',
  birthday: '1990-01-01',
  location: 'New York, NY'
});
```

## 🛡️ Security Features

### 1. Session Management:
- Secure session handling with Appwrite
- Automatic session validation
- Session cleanup on logout

### 2. Input Validation:
- Zod schema validation for all forms
- Email format validation
- Password strength requirements
- Age verification for compliance

### 3. Error Handling:
- Comprehensive error catching
- User-friendly error messages
- Graceful fallbacks for network issues

## 📱 Navigation Flow

### Authentication Flow:
1. **Auth Modal** → User selects sign-in method
2. **Login/Register** → User enters credentials
3. **Welcome Screen** → Profile completion check
4. **Completion Screens** → Fill missing profile data
5. **Main App** → User enters the application

### Profile Completion Flow:
1. **Welcome** → Check completion status
2. **Gender/Birth** → If missing gender/birthday
3. **Location** → If missing location
4. **Preferences** → If missing interests/preferences
5. **Choose Room** → Final step before main app

## 🔧 Configuration

### Environment Variables:
```typescript
// Required Appwrite configuration
APP_CONFIG = {
  DATABASE_ID: 'your-database-id',
  USERS_COLLECTION: 'users',
  APP_URL: 'your-app-url'
}
```

### Dependencies:
- `react-native-appwrite`: Backend service
- `jotai`: State management
- `expo-router`: Navigation
- `zod`: Form validation
- `react-native-modal-datetime-picker`: Date selection

## 🚀 Usage Examples

### Basic Authentication:
```typescript
import { useAuth } from '@/src/features/auth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }
  
  return <UserDashboard user={user} onLogout={logout} />;
}
```

### Profile Completion Check:
```typescript
import { useCompletedProfile } from '@/src/features/profile/hooks';

function WelcomeScreen() {
  const { user } = useAuth();
  const { checkProfileCompletion } = useCompletedProfile();
  
  useEffect(() => {
    if (user) {
      const status = checkProfileCompletion(user);
      if (!status.isCompleted) {
        router.push(status.nextScreen);
      }
    }
  }, [user]);
}
```

## 🐛 Troubleshooting

### Common Issues:

1. **Session Not Persisting**:
   - Check Appwrite configuration
   - Verify session storage permissions

2. **Profile Completion Loop**:
   - Ensure all required fields are properly saved
   - Check `useCompletedProfile` logic

3. **Form Validation Errors**:
   - Verify Zod schema definitions
   - Check form field names match schema

4. **Navigation Issues**:
   - Ensure proper route definitions
   - Check router configuration

## 📝 Development Notes

### Adding New Authentication Methods:
1. Add service method in `authService.ts`
2. Update `useAuth` hook
3. Add UI component
4. Update navigation flow

### Extending Profile Completion:
1. Add new field to User type
2. Update `useCompletedProfile` validation
3. Create new completion screen
4. Update navigation logic

### Customizing Validation:
1. Modify Zod schemas in validation folder
2. Update form components
3. Test validation rules

## 🔄 Future Enhancements

### Planned Features:
- [ ] Social media authentication (Google, Apple, Facebook)
- [ ] Two-factor authentication
- [ ] Biometric authentication
- [ ] Advanced profile customization
- [ ] Multi-language support
- [ ] Offline authentication support

### Performance Optimizations:
- [ ] Lazy loading of completion screens
- [ ] Caching of user profile data
- [ ] Optimistic updates for profile changes
- [ ] Background session refresh

---

*This documentation is maintained alongside the codebase. Please update it when making changes to the authentication system.*
