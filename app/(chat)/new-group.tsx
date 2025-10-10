import { Icon } from '@/components/ui/icon';
import { useAccount } from '@/src/appwrite';
import { Avatar } from '@/src/components/Avatar';
import { Button } from '@/src/components/Button';
import { InputField } from '@/src/components/InputField';
import { useChats } from '@/src/hooks/useChats';
import type { User } from '@/src/types';
import { router } from 'expo-router';
import { CheckCircle, ChevronLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Circle } from 'react-native-svg';

export default function NewGroupScreen() {
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { createGroup, getUsers } = useChats();
  const { data: account } = useAccount();

  React.useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const users = await getUsers();
      setAvailableUsers(users);
    } catch (error) {
      Alert.alert('خطأ', 'فشل في تحميل المستخدمين');
    }
  };

  const toggleUserSelection = (user: User) => {
    setSelectedUsers(prev => {
      const isSelected = prev.some(u => u.user_id === user.user_id);
      if (isSelected) {
        return prev.filter(u => u.user_id !== user.user_id);
      } else {
        return [...prev, user];
      }
    });
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال اسم المجموعة');
      return;
    }

    if (selectedUsers.length === 0) {
      Alert.alert('خطأ', 'يرجى اختيار مستخدم واحد على الأقل');
      return;
    }

    setLoading(true);
    try {
      const groupId = await createGroup({
        name: groupName.trim(),
        owner_id: account?.user_id,
          description: '',
          avatar_url: '',
        memberIds: selectedUsers.map(u => u.user_id),
      });
      router.replace(`/(chat)/chat-room?id=${groupId}`);
    } catch (error) {
      Alert.alert('خطأ', 'فشل في إنشاء المجموعة');
    } finally {
      setLoading(false);
    }
  };

  const renderUserItem = ({ item }: { item: User }) => {
    const isSelected = selectedUsers.some(u => u.user_id === item.user_id);
    
    return (
      <TouchableOpacity
        style={[styles.userItem, isSelected && styles.selectedUserItem]}
        onPress={() => toggleUserSelection(item)}
      >
        <Avatar
          source={item.avatar}
          name={item.username}
          size={50}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.username}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
        {isSelected && (
          <Icon as={CheckCircle} size={24} color="#007AFF" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          variant="text"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Icon as={ChevronLeft} size={24} color="#007AFF" />
        </Button>
        <Text style={styles.headerTitle}>مجموعة جديدة</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <InputField
          placeholder="اسم المجموعة"
          value={groupName}
          onChangeText={setGroupName}
          style={styles.groupNameInput}
        />

        {selectedUsers.length > 0 && (
          <View style={styles.selectedUsersContainer}>
            <Text style={styles.selectedUsersTitle}>
              الأعضاء المختارون ({selectedUsers.length})
            </Text>
            <FlatList
              data={selectedUsers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.selectedUserChip}>
                  <Avatar
                    source={item.avatar}
                    name={item.name}
                    size={40}
                  />
                  <Text style={styles.selectedUserName}>{item.name}</Text>
                  <TouchableOpacity
                    onPress={() => toggleUserSelection(item)}
                    style={styles.removeButton}
                  >
                    <Icon as={Circle} size={20} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.selectedUsersList}
            />
          </View>
        )}

        <Text style={styles.usersTitle}>اختر الأعضاء</Text>
        <FlatList
          data={availableUsers}
          keyExtractor={(item) => item.id}
          renderItem={renderUserItem}
          style={styles.usersList}
        />
      </View>

      <View style={styles.footer}>
        <Button
          title="إنشاء المجموعة"
          onPress={handleCreateGroup}
          loading={loading}
          disabled={!groupName.trim() || selectedUsers.length === 0}
          style={styles.createButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 24,
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
  content: {
    flex: 1,
    padding: 16,
  },
  groupNameInput: {
    marginBottom: 20,
  },
  selectedUsersContainer: {
    marginBottom: 20,
  },
  selectedUsersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  selectedUsersList: {
    maxHeight: 60,
  },
  selectedUserChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedUserName: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  removeButton: {
    marginLeft: 8,
  },
  usersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  usersList: {
    flex: 1,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedUserItem: {
    backgroundColor: '#f0f8ff',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  createButton: {
    width: '100%',
  },
});
