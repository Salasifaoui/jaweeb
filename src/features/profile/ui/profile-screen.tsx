import { AppHeader } from "@/components/app-header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Icon } from "@/components/ui/icon";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Button } from "@/src/components/Button";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { THEME } from "@/src/theme/theme";

import { UserAvatar } from "@/components/ui/user-avatar/user-avatar";
import { router } from "expo-router";
import { useAtom } from 'jotai';
import { Bell, ChevronRight, CircleAlert, GalleryHorizontalIcon, HeartHandshake, HelpCircle, Lamp, Locate, QrCode, UserCircle, UserCog, UserPlus } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { useUserService } from "../hooks/userProfile";
import { userProfileAtom } from '../store/profileAtoms';

export function ProfileScreen() {
  const { logout, user } = useAuth();
  const { userProfile, loading } = useUserService(user?.userId || "");
  const [profileFromAtom] = useAtom(userProfileAtom);
  const colorScheme = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => {
        logout() 
        router.replace("/(auth)/inscription")
      }},
    ]);
  };

  const handleEditProfile = () => {
    router.push("/(profile)/edit");
  };

  const styles = createStyles(theme);

  return (
    <ThemedView style={styles.container}>
      <AppHeader title="Me" showBackButton={false} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <UserAvatar user={profileFromAtom || userProfile} size={100} />
          </View>
          
          {loading ? (
            <ActivityIndicator size="small" color={theme.primary} style={{ marginVertical: 10 }} />
          ) : (
            <>
              <ThemedText type="subtitle" style={styles.userName}>
                {profileFromAtom?.username || userProfile?.username || "User Name"}
              </ThemedText>
              <ThemedText style={styles.userEmail}>
                {profileFromAtom?.email || userProfile?.email || "user@example.com"}
              </ThemedText>
            </>
          )}
          
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={handleEditProfile}
          >
            <ThemedText style={styles.editProfileText}>Edit Profile</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statNumber}>24</ThemedText>
            <ThemedText style={styles.statLabel}>Posts</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statNumber}>1.2k</ThemedText>
            <ThemedText style={styles.statLabel}>Followers</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statNumber}>856</ThemedText>
            <ThemedText style={styles.statLabel}>Following</ThemedText>
          </View>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
            <Icon as={UserCircle} size={24} color={theme.primary} />
            <ThemedText style={styles.menuText}>Edit Profile</ThemedText>
            <Icon as={ChevronRight} size={16} color={theme.mutedForeground} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/(auth)/complated/location")}>
            <Icon as={Locate} size={24} color={theme.primary} />
            <ThemedText style={styles.menuText}>Location</ThemedText>
            <Icon as={ChevronRight} size={16} color={theme.mutedForeground} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/(auth)/complated/gender-birth")}>
            <Icon as={UserCog} size={24} color={theme.primary} />
            <ThemedText style={styles.menuText}>Gender & Birthdate</ThemedText>
            <Icon as={ChevronRight} size={16} color={theme.mutedForeground} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/(auth)/complated/preference")}>
            <Icon as={HeartHandshake} size={24} color={theme.primary} />
            <ThemedText style={styles.menuText}>preferences</ThemedText>
            <Icon as={ChevronRight} size={16} color={theme.mutedForeground} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Icon as={Bell} size={24} color={theme.primary} />
            <ThemedText style={styles.menuText}>Notifications</ThemedText>
            <View style={[styles.menuBadge, { backgroundColor: theme.primary }]}>
              <ThemedText style={styles.menuBadgeText}>12</ThemedText>
            </View>
            <Icon as={ChevronRight} size={16} color={theme.mutedForeground} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Icon as={Lamp} size={24} color={theme.primary} />
            <ThemedText style={styles.menuText}>Privacy & Security</ThemedText>
            <Icon as={ChevronRight} size={16} color={theme.mutedForeground} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Icon as={GalleryHorizontalIcon} size={24} color={theme.primary} />
            <ThemedText style={styles.menuText}>Settings</ThemedText>
            <Icon as={ChevronRight} size={16} color={theme.mutedForeground} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Icon as={HelpCircle} size={24} color={theme.primary} />
            <ThemedText style={styles.menuText}>Help & Support</ThemedText>
            <Icon as={ChevronRight} size={16} color={theme.mutedForeground} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Icon as={CircleAlert} size={24} color={theme.primary} />
            <ThemedText style={styles.menuText}>About</ThemedText>
            <Icon as={ChevronRight} size={16} color={theme.mutedForeground} />
          </TouchableOpacity>
        </View>

        <View style={styles.quickActionsSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Quick Actions
          </ThemedText>

          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionButton}>
             
              <ThemedText style={styles.quickActionText}>
                Share Profile
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionButton}>
              <Icon as={QrCode} size={24} color={theme.chart2} />
              <ThemedText style={styles.quickActionText}>QR Code</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionButton}>
              <Icon as={UserPlus} size={24} color={theme.chart4} />
              <ThemedText style={styles.quickActionText}>
                Invite Friends
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        <Button
          title="تسجيل الخروج"
          onPress={handleLogout}
          // loading={loading}
          variant="outline"
          style={styles.logoutButton}
          textStyle={styles.logoutText}
        />
      </ScrollView>
    </ThemedView>
  );
}

const createStyles = (theme: typeof THEME.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.muted,
    justifyContent: "center",
    alignItems: "center",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.background,
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 5,
    color: theme.foreground,
  },
  userEmail: {
    fontSize: 14,
    color: theme.mutedForeground,
    marginBottom: 15,
  },
  editProfileButton: {
    backgroundColor: theme.muted,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.primary,
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: theme.muted,
    paddingVertical: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: theme.foreground,
  },
  statLabel: {
    fontSize: 12,
    color: theme.mutedForeground,
  },
  menuSection: {
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 0,
  },
  menuText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: theme.foreground,
  },
  menuBadge: {
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    marginRight: 10,
  },
  menuBadgeText: {
    color: theme.background,
    fontSize: 12,
    fontWeight: "bold",
  },
  quickActionsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: theme.foreground,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  quickActionButton: {
    alignItems: "center",
    padding: 15,
    backgroundColor: theme.muted,
    borderRadius: 12,
    minWidth: 80,
  },
  quickActionText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
    color: theme.foreground,
  },
  logoutButton: {
    backgroundColor: theme.primary,
    color: theme.primaryForeground,
    paddingVertical: 15,
    borderRadius: 12,
    borderColor: theme.primary,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 30,
  },
  logoutText: {
    color: theme.background,
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: theme.primary,
    fontSize: 14,
    textAlign: "center",
    marginVertical: 10,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});
