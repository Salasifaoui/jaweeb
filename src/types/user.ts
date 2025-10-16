export interface User {
  userId: string;        // Appwrite account.$id
  username: string;       // Display name
  email: string;          // Email for quick search
  avatar?: string;    // Profile image URL from storage
  imageUrl?: string;    // Profile image URL from storage
  status?: string;        // User status (online, busy, etc.)
  bio?: string;          // Short bio
  last_seen?: string;    // Last seen timestamp
  is_online?: boolean;   // Creation timestamp
  birthday?: string;    // Birth date
  gender?: string;    // Gender
  genderPreference?: string[];    // Preference
  interest?: string[];    // Interest
  location?: string;    // Location
  ageRange?: '13-17' | '18-20' | '18-25' | '26-35' | '36-45' | '46-55' | '56-65' | '66-75' | '76-85' | '86-95';    // Age range
}

export interface AuthUser extends User {
  isEmailVerified: boolean;
}

export interface UserProfile {
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  status?: string;
  imageUrl?: string;
  last_seen?: string;
  is_online?: boolean;
  birthday?: string;
  gender?: string;
  genderPreference?: string[];
  interest?: string[];
  location?: string;
  ageRange?: '13-17' | '18-20' | '18-25' | '26-35' | '36-45' | '46-55' | '56-65' | '66-75' | '76-85' | '86-95';
}