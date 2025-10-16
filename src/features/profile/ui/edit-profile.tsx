import { AppHeader } from '@/components/app-header';
import { Gallery } from '@/components/ui/gallery';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/src/components/Button';
import { InputField } from '@/src/components/InputField';
import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { useUpdateProfile } from '@/src/features/profile/hooks/userUpdateProfile';
import { Media } from '@/src/models/Media';
import { router } from 'expo-router';
import { Camera, ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUserService } from '../hooks/userProfile';

export function EditProfileScreen() {
  const { user } = useAuth();
  const { userProfile: profile } = useUserService(user?.userId || "");

  const { updateProfile, loading, error, reset } = useUpdateProfile();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<Media | null>(null);
  const [showGallery, setShowGallery] = useState(false);

// Initialize form with profile data
useEffect(() => {
    if (profile) {
        setName(profile.username || '');
        setEmail(profile.email || '');
        setBio(profile.bio || '');
    }
}, [profile]);

// Check if there are changes
useEffect(() => {
    if (profile) {
        const nameChanged = name.trim() !== (profile.username || "");
        const emailChanged = email.trim() !== (profile.email || "");
        const bioChanged = bio.trim() !== (profile.bio || "");
        const avatarChanged = selectedAvatar !== null;
        setHasChanges(nameChanged || emailChanged || bioChanged || avatarChanged);
    }
}, [name, email, bio, selectedAvatar, profile]);

// Handle error display
useEffect(() => {
    if (error) {
        Alert.alert("Update Error", error);
        reset();
    }
}, [error, reset]);

  



const handleSave = async () => {
  if (!profile || !hasChanges || loading) return;

  const nameChanged = name.trim() !== (profile.username || "");
  const emailChanged = email.trim() !== (profile.email || "");
  const bioChanged = bio.trim() !== (profile.bio || "");

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

      if (selectedAvatar) {
          updateData.imageUrl = selectedAvatar.url;
      }

      // Update profile using the hook
      const updatedUser = await updateProfile(profile.userId, updateData);
      
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
    setShowGallery(true);
  };

  const handleImageSelect = (image: Media) => {
    setSelectedAvatar(image);
    setShowGallery(false);
    Alert.alert('تم اختيار الصورة', 'تم اختيار الصورة الشخصية بنجاح');
  };

  const handleImageUpload = (image: Media) => {
    setSelectedAvatar(image);
    setShowGallery(false);
    Alert.alert('تم رفع الصورة', 'تم رفع الصورة الشخصية بنجاح');
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
            {selectedAvatar ? (
              <Image source={{ uri: selectedAvatar.url }} style={styles.avatarImage} />
            ) : profile?.imageUrl ? (
              <Image source={{ uri: profile?.imageUrl }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarPlaceholderText}>
                  {name ? name.charAt(0).toUpperCase() : 'U'}
                </Text>
              </View>
            )}
            <View style={styles.avatarOverlay}>
              <Icon as={Camera} size={24} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>اضغط لتغيير الصورة</Text>
        </View>

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
      <Gallery
        visible={showGallery}
        onClose={() => setShowGallery(false)}
        onImageSelect={handleImageSelect}
        onImageUpload={handleImageUpload}
        maxImages={1}
        allowMultiple={false}
        showUploadButton={true}
        showGalleryButton={true}
      />
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
