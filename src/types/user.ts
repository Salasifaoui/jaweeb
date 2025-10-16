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
}