# Authentication API Reference

## Service Layer (`authService.ts`)

### `register(name: string, email: string, password: string): Promise<User | null>`

Creates a new user account and associated profile.

**Parameters:**
- `name` (string): User's display name
- `email` (string): User's email address
- `password` (string): User's password

**Returns:**
- `Promise<User | null>`: Created user object or null on failure

**Example:**
```typescript
const user = await authService.register('John Doe', 'john@example.com', 'password123');
```

**Errors:**
- Throws `AppwriteException` for validation errors
- Shows alert for registration failures

---

### `login(email: string, password: string): Promise<Session | null>`

Authenticates user and creates a session.

**Parameters:**
- `email` (string): User's email address
- `password` (string): User's password

**Returns:**
- `Promise<Session | null>`: Session object or null on failure

**Example:**
```typescript
const session = await authService.login('john@example.com', 'password123');
```

**Errors:**
- Shows alert for login failures
- Logs errors to console

---

### `loginAsGuest(): Promise<Session | null>`

Creates a guest session for anonymous users.

**Returns:**
- `Promise<Session | null>`: Guest session or null on failure

**Example:**
```typescript
const guestSession = await authService.loginAsGuest();
```

**Notes:**
- Creates a predefined guest user profile
- Uses hardcoded guest user ID: `68ee6c6b9dbdce28a97c`

---

### `logout(): Promise<void>`

Terminates the current session.

**Returns:**
- `Promise<void>`

**Example:**
```typescript
await authService.logout();
```

**Notes:**
- Deletes current session from Appwrite
- Handles errors gracefully

---

### `getCurrentUser(): Promise<User | null>`

Retrieves the currently authenticated user.

**Returns:**
- `Promise<User | null>`: Current user or null if not authenticated

**Example:**
```typescript
const currentUser = await authService.getCurrentUser();
```

---

### `getCurrentSession(): Promise<Session | null>`

Gets the current session information.

**Returns:**
- `Promise<Session | null>`: Current session or null if not authenticated

**Example:**
```typescript
const session = await authService.getCurrentSession();
```

---

## Hook Layer (`useAuth.ts`)

### `useAuth(): UseAuthReturn`

Main authentication hook providing state and methods.

**Returns:**
```typescript
interface UseAuthReturn {
  user: User | null;                    // Appwrite user object
  profile: User | null;                 // Extended user profile
  loading: boolean;                     // Loading state
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  reload: () => Promise<void>;
  loginAsGuest: () => Promise<void>;
  session: Session | null;
  isAuthenticated: boolean;
}
```

**Example:**
```typescript
const { user, login, logout, isAuthenticated } = useAuth();
```

---

### `login(email: string, password: string): Promise<void>`

Hook method for user login.

**Parameters:**
- `email` (string): User's email
- `password` (string): User's password

**Side Effects:**
- Updates user state
- Updates session state
- Sets authentication status
- Triggers profile reload

---

### `register(name: string, email: string, password: string): Promise<User | null>`

Hook method for user registration.

**Parameters:**
- `name` (string): User's display name
- `email` (string): User's email
- `password` (string): User's password

**Returns:**
- `Promise<User | null>`: Created user or null

**Side Effects:**
- Creates user profile
- Updates authentication state
- Triggers session creation

---

### `logout(): Promise<void>`

Hook method for user logout.

**Side Effects:**
- Clears user state
- Clears session state
- Sets authentication to false
- Triggers auth reload

---

### `reload(): Promise<void>`

Reloads authentication state from server.

**Side Effects:**
- Fetches current user
- Fetches current session
- Updates profile data
- Updates authentication status

---

## State Management (`authAtoms.ts`)

### Atoms

#### `userAtom: Atom<User | null>`
Stores the current user data.

#### `sessionAtom: Atom<Session | null>`
Stores the current session information.

#### `isAuthenticatedAtom: Atom<boolean>`
Stores the authentication status.

#### `authLoadingAtom: Atom<boolean>`
Stores the loading state for auth operations.

#### `authStateAtom: Atom<AuthState>`
Derived atom combining all auth state.

```typescript
interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
}
```

#### `profileUpdateLoadingAtom: Atom<boolean>`
Loading state for profile updates.

#### `profileUpdateErrorAtom: Atom<string | null>`
Error messages for profile updates.

#### `profileUpdateSuccessAtom: Atom<boolean>`
Success status for profile updates.

---

## Component APIs

### `AuthModal`

Main authentication modal component.

**Props:**
- No props required

**Features:**
- Multiple sign-in options
- Social media integration
- Legal links
- Branding

---

### `LoginScreen`

Email/password login form.

**Props:**
- No props required

**Features:**
- Form validation
- Loading states
- Navigation links
- Error handling

---

### `RegisterScreen`

User registration form.

**Props:**
- No props required

**Features:**
- Multi-field form
- Password confirmation
- Validation
- Auto-login after registration

---

### `ForgotPasswordScreen`

Password recovery form.

**Props:**
- No props required

**Features:**
- Email validation
- Reset email sending
- Success feedback
- Navigation back to login

---

## Profile Completion Components

### `WelcomePage`

Welcome/onboarding screen.

**Props:**
- No props required

**Features:**
- Profile completion check
- Avatar selection
- Automatic redirection
- Feature highlights

---

### `GenderBirthPage`

Gender and birthday selection.

**Props:**
- No props required

**Features:**
- Gender selection
- Date picker
- Age validation
- Data persistence

---

### `LocationPage`

Location selection screen.

**Props:**
- No props required

**Features:**
- Popular locations
- Custom location input
- Location validation
- Data persistence

---

### `PreferencePage`

Interests and preferences selection.

**Props:**
- No props required

**Features:**
- Multiple interest selection
- Age range preference
- Gender preference
- Data persistence

---

### `ChooseRoomPage`

Room selection screen.

**Props:**
- No props required

**Features:**
- Room categories
- Multiple room selection
- Member counts
- Final completion step

---

## Error Handling

### Common Error Types

#### `AppwriteException`
Backend service errors from Appwrite.

**Properties:**
- `message`: Error message
- `code`: Error code
- `type`: Error type

#### Validation Errors
Form validation errors from Zod schemas.

**Properties:**
- Field-specific error messages
- Validation rule violations

### Error Handling Patterns

```typescript
try {
  await login(email, password);
} catch (error) {
  if (error instanceof AppwriteException) {
    Alert.alert('Error', error.message);
  } else {
    Alert.alert('Error', 'An unexpected error occurred');
  }
}
```

---

## Type Definitions

### Core Types

```typescript
interface User {
  userId: string;
  username: string;
  email: string;
  avatar?: string;
  imageUrl?: string;
  status?: string;
  bio?: string;
  last_seen?: string;
  is_online?: boolean;
  birthday?: string;
  gender?: string;
  genderPreference?: string[];
  interest?: string[];
  location?: string;
  ageRange?: AgeRange;
}

type AgeRange = '13-17' | '18-20' | '18-25' | '26-35' | '36-45' | '46-55' | '56-65' | '66-75' | '76-85' | '86-95';

interface Session {
  $id: string;
  userId: string;
  provider: string;
  providerUid: string;
  providerAccessToken: string;
  providerAccessTokenExpiry: number;
  providerRefreshToken: string;
  providerRefreshTokenExpiry: number;
  ip: string;
  osCode: string;
  osName: string;
  osVersion: string;
  clientType: string;
  clientCode: string;
  clientName: string;
  clientVersion: string;
  clientEngine: string;
  clientEngineVersion: string;
  deviceName: string;
  deviceBrand: string;
  deviceModel: string;
  countryCode: string;
  countryName: string;
  current: boolean;
  $createdAt: string;
  $updatedAt: string;
}
```

---

## Configuration

### Required Environment Variables

```typescript
interface AppConfig {
  DATABASE_ID: string;
  USERS_COLLECTION: string;
  APP_URL: string;
}
```

### Appwrite Configuration

```typescript
// Database and collection IDs
const APP_CONFIG = {
  DATABASE_ID: 'your-database-id',
  USERS_COLLECTION: 'users',
  APP_URL: 'https://your-app-url.com'
};
```

---

## Best Practices

### 1. Error Handling
- Always wrap auth operations in try-catch blocks
- Provide user-friendly error messages
- Log errors for debugging

### 2. State Management
- Use the `useAuth` hook for all auth operations
- Don't directly manipulate auth atoms
- Handle loading states appropriately

### 3. Form Validation
- Use Zod schemas for validation
- Provide real-time feedback
- Handle validation errors gracefully

### 4. Navigation
- Use proper route definitions
- Handle authentication state changes
- Provide fallback navigation

### 5. Security
- Never store sensitive data in local state
- Use secure session handling
- Validate all user inputs

---

*This API reference is maintained alongside the codebase. Please update it when making changes to the authentication system.*
