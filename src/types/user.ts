export interface User {
  user_id: string;        // Appwrite account.$id
  username: string;       // Display name
  email: string;          // Email for quick search
  avatar_url?: string;    // Profile image URL from storage
  status?: string;        // User status (online, busy, etc.)
  bio?: string;          // Short bio
  last_seen?: string;    // Last seen timestamp
  is_online?: boolean;   // Currently online
  created_at: string;    // Creation timestamp
}

export interface AuthUser extends User {
  isEmailVerified: boolean;
}

export interface UserProfile {
  username: string;
  email: string;
  bio?: string;
  avatar_url?: string;
  status?: string;
}