import { AppHeader } from '@/components/app-header';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { UserAvatar } from '@/components/ui/user-avatar/user-avatar';
import { Button } from '@/src/components/Button';
import { InputField } from '@/src/components/InputField';
import { ListAvatars } from '@/src/components/list-avatars/list-avatars';
import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { useUpdateProfile } from '@/src/features/profile/hooks/userUpdateProfile';
import { THEME } from '@/src/theme/theme';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import { ChevronDownCircle, ChevronLeft, ChevronUpCircle } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
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
  const colorScheme = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];

  const styles = createStyles(theme);

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
}, [name, email, bio, profile, profileFromAtom, ]);

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
    <ScrollView style={styles.container}>

      <AppHeader
        title="تعديل الملف الشخصي"
        showBackButton={true}
        onBackPress={() => router.back()}
        leftComponent={
          <Button
          variant="text"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Icon as={ChevronLeft} size={24} color="#007AFF" />
        </Button>
        }
        rightComponent={
          <Button
          variant="text"
          onPress={handleSave}
          disabled={!hasChanges || loading}
          style={StyleSheet.flatten([styles.saveButton, (!hasChanges || loading) && styles.disabledButton])}
        >
          <Text style={[styles.saveText, (!hasChanges || loading) && styles.disabledText]}>
            {loading ? 'جاري الحفظ...' : 'حفظ'}
          </Text>
        </Button>
        }
      />

      <View style={styles.content}>
        <View style={styles.avatarSection}>
         
            <UserAvatar user={profileFromAtom || profile} size={100} />
            {/* <View style={styles.avatarOverlay}>
              <Icon as={Camera} size={24} color="#fff" />
            </View> */}
            <View style={styles.containerChevron}>
       <ThemedText style={styles.textChevron}>Select your avatar or upload a new one</ThemedText>
          {!showGallery ? (
            <TouchableOpacity
              onPress={() => setShowGallery(true)}
            >
              <ChevronDownCircle
                size={20}
                color={theme.primary}
                fill={theme.primaryForeground}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setShowGallery(false)}
            >
              <ChevronUpCircle
                size={20}
                color={theme.primary}
                fill={theme.primaryForeground}
              />
            </TouchableOpacity>
          )}
          </View>
        </View>
        {showGallery && (
        <ListAvatars setShowGallery={setShowGallery} userProfile={profileFromAtom || profile} />
        )}
        <View style={styles.formSection}>
          <InputField
            label="الاسم الكامل"
            placeholder="أدخل اسمك الكامل"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <InputField
            label="البريد الإلكتروني"
            placeholder="أدخل بريدك الإلكتروني"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <InputField
            label="نبذة شخصية"
            placeholder="اكتب نبذة عن نفسك (اختياري)"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            maxLength={200}
            style={styles.bioInput}
          />
          
          <Text style={styles.characterCount}>
            {bio.length}/200
          </Text>
        </View>

        <View style={styles.actionsSection}>
          <Button
            title={loading ? "جاري الحفظ..." : "حفظ التغييرات"}
            onPress={handleSave}
            disabled={!hasChanges || loading}
            style={StyleSheet.flatten([styles.saveChangesButton, (!hasChanges || loading) && styles.disabledButton])}
          />
          
          <Button
            title="إلغاء"
            onPress={() => router.back()}
            variant="outline"
            style={styles.cancelButton}
            disabled={loading}
          />
        </View>
      </View>
    
    </ScrollView>
  );
}

const createStyles = (theme: typeof THEME.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  textChevron: {
    fontSize: 16,
    color: theme.foreground,
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: theme.foreground,
  },
  saveButton: {
    padding: 8,
  },
  saveText: {
    fontSize: 16,
    color: theme.destructive,
    fontWeight: '600',
  },
  disabledText: {
    color: theme.mutedForeground,
  },
  disabledButton: {
    opacity: 0.5,
  },
  content: {
    padding: 24,
  },
  containerChevron: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: theme.mutedForeground,
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.primary,
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarHint: {
    fontSize: 14,
    color: theme.mutedForeground,
    marginTop: 8,
  },
  formSection: {
    marginBottom: 32,
  },
  bioInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: theme.mutedForeground,
    textAlign: 'right',
    marginTop: 4,
  },
  actionsSection: {
    gap: 12,
  },
  saveChangesButton: {
    width: '100%',
    backgroundColor: theme.primary,
    color: theme.primaryForeground,
  },
  cancelButton: {
    width: '100%',
    backgroundColor: theme.background,
    borderColor: theme.border,
    color: theme.foreground,
  },
});
