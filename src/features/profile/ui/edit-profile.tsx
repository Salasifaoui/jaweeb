import { AppHeader } from '@/components/app-header';
import { Icon } from '@/components/ui/icon';
import { ListAvatars } from '@/components/ui/list-avatars/list-avatars';
import { UserAvatar } from '@/components/ui/user-avatar/user-avatar';
import { Button } from '@/src/components/Button';
import { InputField } from '@/src/components/InputField';
import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { useUpdateProfile } from '@/src/features/profile/hooks/userUpdateProfile';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import { Camera, ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
          <TouchableOpacity onPress={handleChangeAvatar} style={styles.avatarContainer}>
            <UserAvatar user={profileFromAtom || profile} size={100} />
            <View style={styles.avatarOverlay}>
              <Icon as={Camera} size={24} color="#fff" />
            </View>
          </TouchableOpacity>
          
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
      

      {/* Gallery Component */}
      {/* <Gallery
        visible={showGallery}
        onClose={() => setShowGallery(false)}
        onImageUpload={handleImageUpload}
        maxImages={1}
        allowMultiple={false}
        showUploadButton={true}
        showGalleryButton={true}
      /> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  saveButton: {
    padding: 8,
  },
  saveText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  disabledText: {
    color: '#ccc',
  },
  disabledButton: {
    opacity: 0.5,
  },
  content: {
    padding: 24,
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
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#666',
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarHint: {
    fontSize: 14,
    color: '#666',
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
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  actionsSection: {
    gap: 12,
  },
  saveChangesButton: {
    width: '100%',
  },
  cancelButton: {
    width: '100%',
  },
});
