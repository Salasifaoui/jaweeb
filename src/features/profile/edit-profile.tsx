import { AppHeader } from '@/components/app-header';
import { Icon } from '@/components/ui/icon';
import { useAccount } from '@/src/appwrite/account/useAccount';
import { useUpdateEmail } from "@/src/appwrite/account/useUpdateEmail";
import { useUpdateName } from "@/src/appwrite/account/useUpdateName";
import { parseErrorMessage } from '@/src/appwrite/exceptions/parseErrorMessage';
import { Button } from '@/src/components/Button';
import { InputField } from '@/src/components/InputField';
import { router } from 'expo-router';
import { Camera, ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function EditProfileScreen() {
  const { data: account } = useAccount();
  const [name, setName] = useState( '');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form with current account data
  useEffect(() => {
    if (account) {
        setName(account.name || "");
        setEmail(account.email || "");
    }
}, [account]);

// Check if there are changes
useEffect(() => {
    if (account) {
        const nameChanged = name.trim() !== (account.name || "");
        const emailChanged = email.trim() !== (account.email || "");
        setHasChanges(nameChanged || emailChanged );
    }
}, [name, email, account]);

  const updateName = useUpdateName({
    onSuccess: () => {
        console.log("Name updated successfully");
    },
    onError: (error) => {
        const parsedError = parseErrorMessage(error);
        console.error("Name update error:", error);
        Alert.alert(parsedError.title, parsedError.description);
        setIsUpdating(false);
    }
});

const updateEmail = useUpdateEmail({
    onSuccess: () => {
        console.log("Email updated successfully");
        setPassword(""); // Clear password after successful update
    },
    onError: (error) => {
        const parsedError = parseErrorMessage(error);
        console.error("Email update error:", error);
        Alert.alert(parsedError.title, parsedError.description);
        setIsUpdating(false);
    }
});

const handleSave = async () => {
  if (!account || !hasChanges) return;

  const nameChanged = name.trim() !== (account.name || "");
  const emailChanged = email.trim() !== (account.email || "");

  if (!name.trim()) {
      Alert.alert("Invalid Name", "Name cannot be empty.");
      return;
  }

  if (!email.trim() || !email.includes('@')) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
  }


  setIsUpdating(true);

  try {
      // Update name if changed
      if (nameChanged) {
          await updateName.mutateAsync({ name: name.trim() });
      }

      // Update email if changed
      if (emailChanged) {
          await updateEmail.mutateAsync({
              email: email.trim(),
              password: password
          });
      }


      Alert.alert("Success", "Your account information has been updated successfully.");
      setIsUpdating(false);

      // Navigate back to settings
      router.back();
  } catch (error) {
      setIsUpdating(false);
  }
};

  const handleChangeAvatar = () => {
    Alert.alert(
      'تغيير الصورة الشخصية',
      'اختر طريقة تغيير الصورة',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'الكاميرا', onPress: () => console.log('Camera') },
        { text: 'المعرض', onPress: () => console.log('Gallery') },
      ]
    );
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
          disabled={loading}
          style={styles.saveButton}
        >
          <Text style={[styles.saveText, loading && styles.disabledText]}>
            حفظ
          </Text>
        </Button>
        }
      />

      <View style={styles.content}>
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={handleChangeAvatar} style={styles.avatarContainer}>
            {/* <Avatar
              source={account?.prefs?.avatar_url}
              name={name || 'المستخدم'}
              size={100}
            /> */}
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
            loading={loading}
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
