import { AppHeader } from '@/components/app-header';
import { Gallery } from '@/components/ui/gallery';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/src/components/Button';
import { InputField } from '@/src/components/InputField';
import { useAuth } from '@/src/hooks/useAuth';
import { useUserProfileUpdate } from '@/src/hooks/useUserProfileUpdate';
import { Media } from '@/src/models/Media';
import { router } from 'expo-router';
import { Camera, ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function EditProfileScreen() {
  const { user } = useAuth();
  const [name, setName] = useState( '');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<Media | null>(null);
  const [showGallery, setShowGallery] = useState(false);
  const { updateUserProfile, userProfile } = useUserProfileUpdate();

  // Initialize form with current account data
  useEffect(() => {
    if (user) {
        setName(user.name || "");
        setEmail(user.email || "");
    }
}, [user]);

// Check if there are changes
useEffect(() => {
    if (user) {
        const nameChanged = name.trim() !== (user.name || "");
        const emailChanged = email.trim() !== (user.email || "");
        const avatarChanged = selectedAvatar !== null;
        setHasChanges(nameChanged || emailChanged || avatarChanged);
    }
}, [name, email, selectedAvatar, user]);

  



const handleSave = async () => {
  if (!user || !hasChanges) return;

  const nameChanged = name.trim() !== (user.name || "");
  const emailChanged = email.trim() !== (user.email || "");

  if (!name.trim()) {
      Alert.alert("Invalid Name", "Name cannot be empty.");
      return;
  }

  if (!email.trim() || !email.includes('@')) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
  }


  try {
      // Update name if changed
      if (nameChanged) {
          await updateUserProfile(user.$id, { username: name.trim() });
      }

      // Update email if changed
      if (emailChanged) {
          await updateUserProfile(user.$id, { email: email.trim() });
              
      }

      Alert.alert("Success", "Your account information has been updated successfully.");

      // Navigate back to settings
      router.back();
  } catch (error) {
      console.error("Save error:", error);
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
          style={styles.saveButton}
        >
          <Text style={styles.saveText}>
            حفظ
          </Text>
        </Button>
        }
      />

      <View style={styles.content}>
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={handleChangeAvatar} style={styles.avatarContainer}>
            {selectedAvatar ? (
              <Image source={{ uri: userProfile.imageUrl }} style={styles.avatarImage} />
            ) : userProfile?.avatar ? (
              <Image source={{ uri: userProfile?.avatar }} style={styles.avatarImage} />
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
            title="حفظ التغييرات"
            onPress={handleSave}
            style={styles.saveChangesButton}
          />
          
          <Button
            title="إلغاء"
            onPress={() => router.back()}
            variant="outline"
            style={styles.cancelButton}
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
