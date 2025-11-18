import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useChat } from '../hooks/useChat';

interface AddChatButtonProps {
  userId: string;
  onChatCreated?: (chatId: string) => void;
}

export const AddChatButton: React.FC<AddChatButtonProps> = ({
  userId,
  onChatCreated,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [chatName, setChatName] = useState('');
  const [isGroup, setIsGroup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { startChat } = useChat();

  const handleCreateChat = async () => {
    if (!chatName.trim() && isGroup) {
      Alert.alert('Error', 'Please enter a chat name for group chats');
      return;
    }

    setIsLoading(true);
    try {
      await startChat({
        name: isGroup ? chatName.trim() : undefined,
        is_group: isGroup,
        members: [userId], // Start with current user, others can be added later
        created_by: userId,
      });
      
      setIsModalVisible(false);
      setChatName('');
      setIsGroup(false);
      onChatCreated?.('');
    } catch (error) {
      Alert.alert('Error', 'Failed to create chat');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setChatName('');
    setIsGroup(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Chat</Text>
            
            <View style={styles.chatTypeContainer}>
              <TouchableOpacity
                style={[styles.chatTypeButton, !isGroup && styles.chatTypeButtonActive]}
                onPress={() => setIsGroup(false)}
              >
                <Ionicons 
                  name="person" 
                  size={20} 
                  color={!isGroup ? "#007AFF" : "#666"} 
                />
                <Text style={[styles.chatTypeText, !isGroup && styles.chatTypeTextActive]}>
                  Direct Message
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.chatTypeButton, isGroup && styles.chatTypeButtonActive]}
                onPress={() => setIsGroup(true)}
              >
                <Ionicons 
                  name="people" 
                  size={20} 
                  color={isGroup ? "#007AFF" : "#666"} 
                />
                <Text style={[styles.chatTypeText, isGroup && styles.chatTypeTextActive]}>
                  Group Chat
                </Text>
              </TouchableOpacity>
            </View>

            {isGroup && (
              <TextInput
                style={styles.nameInput}
                placeholder="Enter group name"
                value={chatName}
                onChangeText={setChatName}
                maxLength={50}
              />
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.createButton, isLoading && styles.createButtonDisabled]}
                onPress={handleCreateChat}
                disabled={isLoading}
              >
                <Text style={styles.createButtonText}>
                  {isLoading ? 'Creating...' : 'Create Chat'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 24,
  },
  chatTypeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 4,
  },
  chatTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  chatTypeButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chatTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    marginLeft: 8,
  },
  chatTypeTextActive: {
    color: '#007AFF',
  },
  nameInput: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 24,
    backgroundColor: '#F2F2F7',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F2F2F7',
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
  },
  createButton: {
    backgroundColor: '#007AFF',
    marginLeft: 8,
  },
  createButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
