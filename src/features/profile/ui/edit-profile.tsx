import { Text } from '@/components/ui/text';
import { UserAvatar } from '@/components/ui/user-avatar/user-avatar';
import { Button } from '@/src/components/Button';
import { ListAvatars } from '@/src/components/list-avatars/list-avatars';
import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { useUpdateProfile } from '@/src/features/profile/hooks/userUpdateProfile';

import { NavBar } from '@/components/ui/nav-bar';
import { ScreenLayout } from '@/components/ui/screen-layout/screen-layout';
import { VStack } from '@/components/ui/vstack';
import ButtonAction from '@/src/components/ButtonAction';
import ButtonArrowBack from '@/src/components/ButtonArrowBack';
import InputForm from '@/src/components/InputForm';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import { ChevronDownCircle, ChevronUpCircle } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { useUserService } from '../hooks/userProfile';
import { userProfileAtom } from '../store/profileAtoms';

export function EditProfileScreen() {
  const { user } = useAuth();
  const { userProfile: profile } = useUserService(user?.userId || "");
  const [profileFromAtom] = useAtom(userProfileAtom);

  const { updateProfile, loading, error, reset } = useUpdateProfile();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [showGallery, setShowGallery] = useState(false);


  // Initialize form with profile data
  useEffect(() => {
    const currentProfile = profileFromAtom || profile;
    if (currentProfile) {
      setName(currentProfile.username || '');
      setEmail(currentProfile.email || '');
      setBio(currentProfile.bio || '');
    }
  }, [profile, profileFromAtom]);

  // Check if there are changes
  useEffect(() => {
    const currentProfile = profileFromAtom || profile;
    if (currentProfile) {
      const nameChanged = name.trim() !== (currentProfile.username || "");
      const emailChanged = email.trim() !== (currentProfile.email || "");
      const bioChanged = bio.trim() !== (currentProfile.bio || "");
      setHasChanges(nameChanged || emailChanged || bioChanged);
    }
  }, [name, email, bio, profile, profileFromAtom,]);

  // Handle error display
  useEffect(() => {
    if (error) {
      Alert.alert("Update Error", error);
      reset();
    }
  }, [error, reset]);





  const handleSave = async () => {
    const currentProfile = profileFromAtom || profile;
    if (!currentProfile || !hasChanges || loading) return;

    const nameChanged = name.trim() !== (currentProfile.username || "");
    const emailChanged = email.trim() !== (currentProfile.email || "");
    const bioChanged = bio.trim() !== (currentProfile.bio || "");

    if (!name.trim()) {
      Alert.alert("Invalid Name", "Name cannot be empty.");
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    try {
      // Prepare update data
      const updateData: any = {};

      if (nameChanged) {
        updateData.username = name.trim();
      }

      if (emailChanged) {
        updateData.email = email.trim();
      }

      if (bioChanged) {
        updateData.bio = bio.trim();
      }
      // Update profile using the hook
      const updatedUser = await updateProfile(currentProfile.userId, updateData);

      if (updatedUser) {
        Alert.alert("Success", "Your account information has been updated successfully.");
        // Navigate back to settings
        router.back();
      } else if (error) {
        Alert.alert("Error", error);
      }
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  const handleChangeAvatar = () => {
    setShowGallery(!showGallery);
  };

  return (
    <ScreenLayout>
      <ScrollView className="flex-1">
        <NavBar title='تعديل الملف الشخصي' showProfileButton={true}>
          <ButtonArrowBack />
          <Button
            variant="text"
            onPress={handleSave}
            disabled={!hasChanges || loading}
          >
            <Text className="text-sm text-muted-foreground">
              {loading ? 'جاري الحفظ...' : 'حفظ'}
            </Text>
          </Button>


        </NavBar>

        <VStack className="flex-1 gap-6">
          <VStack className="items-center gap-2">

            <UserAvatar user={profileFromAtom || profile} size={100} />
            {/* <View style={styles.avatarOverlay}>
              <Icon as={Camera} size={24} color="#fff" />
            </View> */}
            <View className="flex-row items-center gap-2">
              <Text className="text-sm text-muted-foreground">Select your avatar or upload a new one</Text>
              {!showGallery ? (
                <TouchableOpacity
                  onPress={() => setShowGallery(true)}
                >
                  <ChevronDownCircle
                    size={20}
                    color="#007AFF"
                    fill="#007AFF"
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => setShowGallery(false)}
                >
                  <ChevronUpCircle
                    size={20}
                    color="#007AFF"
                    fill="#007AFF"
                  />
                </TouchableOpacity>
              )}
            </View>
          </VStack>
          {showGallery && (
            <ListAvatars setShowGallery={setShowGallery} userProfile={profileFromAtom || profile} />
          )}
          <VStack className="gap-2">
            <InputForm
              variant="outline"
              text="الاسم الكامل"
              placeholder="أدخل اسمك الكامل"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              textAlign='right'
              onBlur={() => {}}
            />

            <InputForm
              variant="outline"
              text="البريد الإلكتروني"
              placeholder="أدخل بريدك الإلكتروني"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              textAlign='right'
              onBlur={() => {}}
            />

            <InputForm
              variant="outline"
              text="نبذة شخصية"
              placeholder="اكتب نبذة عن نفسك (اختياري)"
              value={bio}
              onChangeText={setBio}
              textAlign='right'
              onBlur={() => {}}
            />


            <Text className="text-sm text-muted-foreground">
              {bio.length}/200
            </Text>
          </VStack>

          <VStack className="gap-2">
            <ButtonAction
              text={loading ? "جاري الحفظ..." : "حفظ التغييرات"}
              onPress={handleSave}
              action="primary"
              variant="solid"
              loading={loading}
            />
            <ButtonAction
              text="إلغاء"
              onPress={() => router.back()}
              action="secondary"
              variant="outline"
            />
          </VStack>
        </VStack>

      </ScrollView>
    </ScreenLayout>
  );
}
