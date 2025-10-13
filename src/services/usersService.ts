import {
  APP_CONFIG
} from "@/src/configs";
import { databases } from "@/src/services/apiService";
import { Query } from "react-native-appwrite";
import { UserProfile } from "../models/types";
import { User } from "../models/User";

export interface CreateUserData {
  email: string;
  username: string;
  password: string;
  fullName?: string;
  bio?: string;
}

export interface UpdateUserData {
  username?: string;
  fullName?: string;
  bio?: string;
  imageUrl?: string;
}

export class UserService {
  // Create a new user account
  static async createUser(
    userData: CreateUserData,
    user: User
  ): Promise<string> {
    try {
      // Create user profile in database using userId as document ID
      const profile: Omit<UserProfile, "$id"> = {
        userId: user.$id,
        email: userData.email,
        username: userData.username,
      };

      await databases.createDocument(
        APP_CONFIG.DATABASE_ID!,
        APP_CONFIG.USERS_COLLECTION!,
        user.$id, // Use userId as document ID instead of ID.unique()
        profile
      );

      return user.$id;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  // Get user profile by ID
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      if (!userId) {
        return null;
      }

      const profile = await databases.getDocument(
        APP_CONFIG.DATABASE_ID!,
        APP_CONFIG.USERS_COLLECTION!,
        userId
      );
      return profile as unknown as UserProfile;
    } catch (error) {
      console.error("Error getting user profile:", error);
      return null;
    }
  }

  // Update user profile
  static async updateUserProfile(
    userId: string,
    updateData: UpdateUserData
  ): Promise<UserProfile | null> {
    try {
      const updatedProfile = await databases.updateDocument(
        APP_CONFIG.DATABASE_ID!,
        APP_CONFIG.USERS_COLLECTION!,
        userId,
        updateData
      );
      console.info("profile updated");
      return updatedProfile as unknown as UserProfile;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

  // Get all users (for admin purposes)
  static async getAllUsers(): Promise<UserProfile[]> {
    try {
      const response = await databases.listDocuments(
        APP_CONFIG.DATABASE_ID!,
        APP_CONFIG.USERS_COLLECTION!,
      );

      return response.documents as unknown as UserProfile[];
    } catch (error) {
      console.error("Error getting all users:", error);
      return [];
    }
  }

  // Delete user account
  static async deleteUser(userId: string): Promise<boolean> {
    try {
      // Delete the document directly using userId as document ID
      await databases.deleteDocument(
        APP_CONFIG.DATABASE_ID!,
        APP_CONFIG.USERS_COLLECTION!,
        userId
      );

      // Note: Deleting the actual account requires admin privileges
      // This would typically be done through Appwrite Functions
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  }

  // Search users by username or full name
  static async searchUsers(searchTerm: string): Promise<UserProfile[]> {
    try {
      const response = await databases.listDocuments(
        APP_CONFIG.DATABASE_ID!,
        APP_CONFIG.USERS_COLLECTION!,
        [
          Query.search("username", searchTerm),
          Query.search("fullName", searchTerm),
        ]
      );

      return response.documents as unknown as UserProfile[];
    } catch (error) {
      console.error("Error searching users:", error);
      return [];
    }
  }

  // get user by @nickname
  static async getUserByNickname(
    nickname: string
  ): Promise<UserProfile | null> {
    try {
      if (!nickname) {
        return null;
      }

      const response = await databases.listDocuments(
        APP_CONFIG.DATABASE_ID!,
        APP_CONFIG.USERS_COLLECTION!,
        [Query.equal("nickname", nickname)]
      );

      return response.documents[0] as unknown as UserProfile;
    } catch (error) {
      console.error("Error getting user by nickname:", error);
      return null;
    }
  }
}
