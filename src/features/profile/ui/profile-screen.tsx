import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { ScreenLayout } from "@/components/ui/screen-layout/screen-layout";
import { Text } from "@/components/ui/text";
import { Button } from "@/src/components/Button";
import { useAuth } from "@/src/features/auth/hooks/useAuth";


import { HStack } from "@/components/ui/hstack";
import { NavBar } from "@/components/ui/nav-bar";
import { UserAvatar } from "@/components/ui/user-avatar/user-avatar";
import { VStack } from "@/components/ui/vstack";
import { CardHero } from "@/src/components";
import ButtonArrowBack from "@/src/components/ButtonArrowBack";
import { router } from "expo-router";
import { useAtom } from 'jotai';
import { Bell, ChevronRight, CircleAlert, GalleryHorizontalIcon, HeartHandshake, HelpCircle, Lamp, Locate, UserCircle, UserCog } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView
} from "react-native";
import { useUserService } from "../hooks/userProfile";
import { userProfileAtom } from '../store/profileAtoms';

export function ProfileScreen() {
  const { logout, user } = useAuth();
  const { userProfile, loading } = useUserService(user?.userId || "");
  const [profileFromAtom] = useAtom(userProfileAtom);


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

  const ProfileItem = ({ icon, title, onPress }: { icon: React.ElementType, title: string, onPress: () => void }) => {
    return (
      <HStack className="w-full items-center justify-between">
        <HStack className="items-center gap-2">
        <Icon as={icon as any} size={24} className="text-primary-500" />
        <Text className="text-lg text-muted-foreground">{title}</Text>
        </HStack>
        <Pressable className="flex-row items-center justify-end" onPress={onPress}>
        <Icon as={ChevronRight} size={24} className="text-primary-500" />
        </Pressable>  
      </HStack>
    );
  };

  return (
    <ScreenLayout>
      <NavBar>
        <ButtonArrowBack />
      </NavBar>

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <VStack className="flex-1 gap-6 justify-center">
        <VStack className="items-center">
          <HStack className="items-center gap-2">
            <UserAvatar user={profileFromAtom || userProfile} size={100} />
          </HStack>
          <CardHero className="items-center">
          {loading ? (
            <ActivityIndicator size="small" color="#007AFF" style={{ marginVertical: 10 }} />
          ) : (
            <>
              <Text className="text-sm text-muted-foreground">
                {profileFromAtom?.username || userProfile?.username || "User Name"}
              </Text>
              <Text className="text-sm text-muted-foreground">
                {profileFromAtom?.email || userProfile?.email || "user@example.com"}
              </Text>
            </>
          )}
          
          <Pressable
            onPress={handleEditProfile}
          >
            <Text className="text-sm text-muted-foreground text-primary-500">Edit Profile</Text>
          </Pressable>
          </CardHero>
        </VStack>
        <CardHero className="flex-1 justify-between">
        <HStack className="flex-1 justify-between">
          <VStack className="items-center gap-2">
            <Text className="text-sm text-muted-foreground">24</Text>
            <Text className="text-sm text-muted-foreground">Posts</Text>
          </VStack>
          <VStack className="items-center gap-2">
            <Text className="text-sm text-muted-foreground">1.2k</Text>
            <Text className="text-sm text-muted-foreground">Followers</Text>
          </VStack>
          <VStack className="items-center gap-2">
            <Text className="text-sm text-muted-foreground">856</Text>
            <Text className="text-sm text-muted-foreground">Following</Text>
          </VStack>
        </HStack>
        </CardHero>
        <VStack className="flex-1 gap-6 ">
          <ProfileItem icon={UserCircle} title="Edit Profile" onPress={handleEditProfile} />
          <ProfileItem icon={Locate} title="Location" onPress={() => router.push("/(auth)/complated/location")} />
          <ProfileItem icon={UserCog} title="Gender & Birthdate" onPress={() => router.push("/(auth)/complated/gender-birth")} />
          <ProfileItem icon={HeartHandshake} title="preferences" onPress={() => router.push("/(auth)/complated/preference")} />

          <ProfileItem icon={Bell} title="Notifications" onPress={() => router.push("/(auth)/complated/notifications")} />

          <ProfileItem icon={Lamp} title="Privacy & Security" onPress={() => router.push("/(auth)/complated/privacy-security")} />

          <ProfileItem icon={GalleryHorizontalIcon} title="Settings" onPress={() => router.push("/(auth)/complated/settings")} />

          <ProfileItem icon={HelpCircle} title="Help & Support" onPress={() => router.push("/(auth)/complated/help-support")} />

          <ProfileItem icon={CircleAlert} title="About" onPress={() => router.push("/(auth)/complated/about")} />
        </VStack>

        <Button
          title="تسجيل الخروج"
          onPress={handleLogout}
          // loading={loading}
          variant="outline"
        />


        </VStack>

        
      </ScrollView>
    </ScreenLayout>
  );
}
