import { IconSymbol } from '@/components/ui/icon-symbol';
import { Avatar } from '@/src/components/Avatar';
import { Button } from '@/src/components/Button';
import { InputField } from '@/src/components/InputField';
import { useAuth } from '@/src/hooks/useAuth';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function EditProfileScreen() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال الاسم');
      return;
    }

    if (!email.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال البريد الإلكتروني');
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        name: name.trim(),
        email: email.trim(),
        bio: bio.trim(),
      });
      Alert.alert('نجح', 'تم تحديث الملف الشخصي بنجاح');
      router.back();
    } catch (error) {
      Alert.alert('خطأ', 'فشل في تحديث الملف الشخصي');
    } finally {
      setLoading(false);
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
      <View style={styles.header}>
        <Button
          variant="text"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <IconSymbol name="chevron.left" size={24} color="#007AFF" />
        </Button>
        <Text style={styles.headerTitle}>تعديل الملف الشخصي</Text>
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
      </View>

      <View style={styles.content}>
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={handleChangeAvatar} style={styles.avatarContainer}>
            <Avatar
              source={user?.avatar}
              name={name || 'المستخدم'}
              size={100}
            />
            <View style={styles.avatarOverlay}>
              <IconSymbol name="camera" size={24} color="#fff" />
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
