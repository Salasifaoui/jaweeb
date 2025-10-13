import { UserService } from "./usersService";

export interface OAuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: 'google' | 'apple';
}

export class OAuthService {
  // Google OAuth Sign In
  static async signInWithGoogle(): Promise<OAuthUser> {
    try {
      // This is a placeholder implementation
      // In a real app, you would:
      // 1. Use expo-auth-session for Google OAuth
      // 2. Get the authorization code from Google
      // 3. Exchange it for tokens
      // 4. Create or update user in Appwrite
      
      // Mock implementation for now
      const mockGoogleUser: OAuthUser = {
        id: "google-user-id",
        email: "user@gmail.com",
        name: "Google User",
        picture: "https://example.com/avatar.jpg",
        provider: 'google'
      };

      // Create or update user in Appwrite
      await this.createOrUpdateOAuthUser(mockGoogleUser);
      
      return mockGoogleUser;
    } catch (error) {
      console.error("Google OAuth error:", error);
      throw new Error("Google sign-in failed");
    }
  }

  // Apple OAuth Sign In
  static async signInWithApple(): Promise<OAuthUser> {
    try {
      // This is a placeholder implementation
      // In a real app, you would:
      // 1. Use expo-auth-session for Apple OAuth
      // 2. Get the authorization code from Apple
      // 3. Exchange it for tokens
      // 4. Create or update user in Appwrite
      
      // Mock implementation for now
      const mockAppleUser: OAuthUser = {
        id: "apple-user-id",
        email: "user@icloud.com",
        name: "Apple User",
        picture: "https://example.com/avatar.jpg",
        provider: 'apple'
      };

      // Create or update user in Appwrite
      await this.createOrUpdateOAuthUser(mockAppleUser);
      
      return mockAppleUser;
    } catch (error) {
      console.error("Apple OAuth error:", error);
      throw new Error("Apple sign-in failed");
    }
  }

  // Create or update OAuth user in Appwrite
  private static async createOrUpdateOAuthUser(oauthUser: OAuthUser): Promise<void> {
    try {
      // Check if user already exists
      const existingProfile = await UserService.getUserProfile(oauthUser.id);
      
      if (existingProfile) {
        // Update existing user profile
        await UserService.updateUserProfile(oauthUser.id, {
          fullName: oauthUser.name,
          imageUrl: oauthUser.picture || "",
        });
      } else {
        // Create new user profile
        await UserService.createUser({
          email: oauthUser.email,
          username: oauthUser.name.toLowerCase().replace(/\s+/g, ''),
          password: this.generateSecurePassword(), // Generate a secure password for OAuth users
          fullName: oauthUser.name,
          bio: `Signed up with ${oauthUser.provider}`,
        });
      }
    } catch (error) {
      console.error("Error creating/updating OAuth user:", error);
      throw error;
    }
  }

  // Generate a secure password for OAuth users
  private static generateSecurePassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 32; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  // Get OAuth configuration
  static getOAuthConfig() {
    return {
      google: {
        clientId: APP_CONFIG.GOOGLE_CLIENT_ID,
        redirectUri: APP_CONFIG.GOOGLE_REDIRECT_URI,
      },
      apple: {
        clientId: APP_CONFIG.APPLE_CLIENT_ID,
        redirectUri: APP_CONFIG.APPLE_REDIRECT_URI,
      }
    };
  }

  // Validate OAuth configuration
  static validateOAuthConfig(): boolean {
    const config = this.getOAuthConfig();
    
    if (!config.google.clientId || !config.google.redirectUri) {
      console.warn("Google OAuth configuration is incomplete");
      return false;
    }
    
    if (!config.apple.clientId || !config.apple.redirectUri) {
      console.warn("Apple OAuth configuration is incomplete");
      return false;
    }
    
    return true;
  }
}
