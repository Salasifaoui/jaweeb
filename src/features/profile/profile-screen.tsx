import { AppHeader } from "@/components/app-header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAccount } from "@/src/appwrite/account";
import { useSignOut } from "@/src/appwrite/account/useSignOut";
import { Button } from "@/src/components/Button";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthModal } from "../auth";

export function ProfileScreen() {
  const { data: account } = useAccount();
  const [loading, setLoading] = useState(false);

  const logout = useSignOut({
    onSuccess: () => {
      router.replace("/(auth)/login");
    },
  });


  const handleLogout = async () => {
    Alert.alert("تسجيل الخروج", "هل أنت متأكد من رغبتك في تسجيل الخروج؟", [
      { text: "إلغاء", style: "cancel" },
      {
        text: "تسجيل الخروج",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            await logout.mutateAsync();
            router.replace("/(auth)/login");
          } catch (error) {
            Alert.alert("خطأ", "فشل في تسجيل الخروج");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handleEditProfile = () => {
    router.push("/(profile)/edit");
  };

  if (!account) {
    return <AuthModal />;
  }

  return (
    <ThemedView style={styles.container}>
      <AppHeader title="Me" showBackButton={false} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <IconSymbol name="person.fill" size={40} color="#007AFF" />
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <IconSymbol name="camera.fill" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <ThemedText type="subtitle" style={styles.userName}>
            {account?.name || "User Name"}
          </ThemedText>
          <ThemedText style={styles.userEmail}>
            {account?.email || "user@example.com"}
          </ThemedText>
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
            <IconSymbol name="person.circle" size={24} color="#007AFF" />
            <ThemedText style={styles.menuText}>Edit Profile</ThemedText>
            <IconSymbol name="chevron.right" size={16} color="#C7C7CC" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <IconSymbol name="bell" size={24} color="#007AFF" />
            <ThemedText style={styles.menuText}>Notifications</ThemedText>
            <View style={styles.menuBadge}>
              <ThemedText style={styles.menuBadgeText}>12</ThemedText>
            </View>
            <IconSymbol name="chevron.right" size={16} color="#C7C7CC" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <IconSymbol name="lock" size={24} color="#007AFF" />
            <ThemedText style={styles.menuText}>Privacy & Security</ThemedText>
            <IconSymbol name="chevron.right" size={16} color="#C7C7CC" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <IconSymbol name="gear" size={24} color="#007AFF" />
            <ThemedText style={styles.menuText}>Settings</ThemedText>
            <IconSymbol name="chevron.right" size={16} color="#C7C7CC" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <IconSymbol name="questionmark.circle" size={24} color="#007AFF" />
            <ThemedText style={styles.menuText}>Help & Support</ThemedText>
            <IconSymbol name="chevron.right" size={16} color="#C7C7CC" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <IconSymbol name="info.circle" size={24} color="#007AFF" />
            <ThemedText style={styles.menuText}>About</ThemedText>
            <IconSymbol name="chevron.right" size={16} color="#C7C7CC" />
          </TouchableOpacity>
        </View>

        <View style={styles.quickActionsSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Quick Actions
          </ThemedText>

          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionButton}>
              <IconSymbol
                name="square.and.arrow.up"
                size={24}
                color="#007AFF"
              />
              <ThemedText style={styles.quickActionText}>
                Share Profile
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionButton}>
              <IconSymbol name="qrcode" size={24} color="#34C759" />
              <ThemedText style={styles.quickActionText}>QR Code</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionButton}>
              <IconSymbol name="person.badge.plus" size={24} color="#FF9500" />
              <ThemedText style={styles.quickActionText}>
                Invite Friends
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        <Button
          title="تسجيل الخروج"
          onPress={handleLogout}
          loading={loading}
          variant="outline"
          style={styles.logoutButton}
          textStyle={styles.logoutText}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: "#F2F2F7",
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
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  editProfileButton: {
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#007AFF",
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#F2F2F7",
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
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
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
  },
  menuBadge: {
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    marginRight: 10,
  },
  menuBadgeText: {
    color: "#fff",
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
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  quickActionButton: {
    alignItems: "center",
    padding: 15,
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    minWidth: 80,
  },
  quickActionText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 15,
    borderRadius: 12,
    borderColor: "#FF3B30",
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 30,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
