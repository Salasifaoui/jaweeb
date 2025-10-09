import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAccount } from '@/src/appwrite/account';
import { useSignOut } from '@/src/appwrite/account/useSignOut';
import { Avatar } from '@/src/components/Avatar';
import { Button } from '@/src/components/Button';
import { useChats } from '@/src/hooks/useChats';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { chatId } = useLocalSearchParams<{ chatId?: string }>();
  const [loading, setLoading] = useState(false);
  const { data: account } = useAccount();
  const { getChatInfo } = useChats();
  const logout = useSignOut({
    onSuccess: () => {
      router.replace('/(auth)/login');
    },
  });

  const handleEditProfile = () => {
    router.push('/(profile)/edit-profile');
  };

  const handleLogout = async () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل أنت متأكد من رغبتك في تسجيل الخروج؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'تسجيل الخروج',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await logout.mutateAsync();
              router.replace('/(auth)/login');
            } catch (error) {
              Alert.alert('خطأ', 'فشل في تسجيل الخروج');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleBlockUser = async () => {
    if (!chatId) return;
    
    Alert.alert(
      'حظر المستخدم',
      'هل أنت متأكد من رغبتك في حظر هذا المستخدم؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حظر',
          style: 'destructive',
          onPress: async () => {
            // Implement block user functionality
            Alert.alert('تم الحظر', 'تم حظر المستخدم بنجاح');
          },
        },
      ]
    );
  };

  const handleDeleteChat = async () => {
    if (!chatId) return;
    
    Alert.alert(
      'حذف المحادثة',
      'هل أنت متأكد من رغبتك في حذف هذه المحادثة؟ لا يمكن التراجع عن هذا الإجراء.',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: async () => {
            // Implement delete chat functionality
            Alert.alert('تم الحذف', 'تم حذف المحادثة بنجاح');
            router.back();
          },
        },
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
        <Text style={styles.headerTitle}>الملف الشخصي</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.profileSection}>
        <Avatar
          source={account?.prefs?.avatar_url}
          name={account?.name || 'المستخدم'}
          size={100}
        />
        <Text style={styles.userName}>{account?.name || 'المستخدم'}</Text>
        <Text style={styles.userEmail}>{account?.email}</Text>
        
        {!chatId && (
          <Button
            title="تعديل الملف الشخصي"
            onPress={handleEditProfile}
            variant="outline"
            style={styles.editButton}
          />
        )}
      </View>

      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem}>
          <IconSymbol name="bell" size={24} color="#007AFF" />
          <Text style={styles.menuText}>الإشعارات</Text>
          <IconSymbol name="chevron.right" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <IconSymbol name="lock" size={24} color="#007AFF" />
          <Text style={styles.menuText}>الخصوصية والأمان</Text>
          <IconSymbol name="chevron.right" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <IconSymbol name="paintbrush" size={24} color="#007AFF" />
          <Text style={styles.menuText}>المظهر</Text>
          <IconSymbol name="chevron.right" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <IconSymbol name="questionmark.circle" size={24} color="#007AFF" />
          <Text style={styles.menuText}>المساعدة والدعم</Text>
          <IconSymbol name="chevron.right" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <IconSymbol name="info.circle" size={24} color="#007AFF" />
          <Text style={styles.menuText}>حول التطبيق</Text>
          <IconSymbol name="chevron.right" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      {chatId && (
        <View style={styles.chatActionsSection}>
          <Text style={styles.sectionTitle}>إجراءات المحادثة</Text>
          
          <TouchableOpacity style={[styles.menuItem, styles.dangerItem]} onPress={handleBlockUser}>
            <IconSymbol name="person.crop.circle.badge.minus" size={24} color="#FF3B30" />
            <Text style={[styles.menuText, styles.dangerText]}>حظر المستخدم</Text>
            <IconSymbol name="chevron.right" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, styles.dangerItem]} onPress={handleDeleteChat}>
            <IconSymbol name="trash" size={24} color="#FF3B30" />
            <Text style={[styles.menuText, styles.dangerText]}>حذف المحادثة</Text>
            <IconSymbol name="chevron.right" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.logoutSection}>
        <Button
          title="تسجيل الخروج"
          onPress={handleLogout}
          loading={loading}
          variant="outline"
          style={styles.logoutButton}
        />
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
  placeholder: {
    width: 40,
  },
  profileSection: {
    alignItems: 'center',
    padding: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  editButton: {
    paddingHorizontal: 32,
  },
  menuSection: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  chatActionsSection: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  dangerItem: {
    // Additional styling for danger actions if needed
  },
  dangerText: {
    color: '#FF3B30',
  },
  logoutSection: {
    padding: 16,
    marginTop: 32,
  },
  logoutButton: {
    borderColor: '#FF3B30',
  },
});
