import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useMessage } from '../hooks/useMessage';

interface MessageInputProps {
  chatId: string;
  senderId: string;
  onSend?: (message: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  chatId,
  senderId,
  onSend,
}) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { sendNewMessage, loading } = useMessage();

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      await sendNewMessage({
        chat_id: chatId,
        sender_id: senderId,
        content: message.trim(),
      });
      
      setMessage('');
      onSend?.(message.trim());
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const handleTyping = (text: string) => {
    setMessage(text);
    // TODO: Implement typing indicator
    if (text.length > 0 && !isTyping) {
      setIsTyping(true);
    } else if (text.length === 0 && isTyping) {
      setIsTyping(false);
    }
  };

  const handleAttachFile = () => {
    // TODO: Implement file attachment
    Alert.alert('Coming Soon', 'File attachment feature will be available soon');
  };

  const handleAttachImage = () => {
    // TODO: Implement image attachment
    Alert.alert('Coming Soon', 'Image attachment feature will be available soon');
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TouchableOpacity 
          style={styles.attachButton}
          onPress={handleAttachFile}
        >
          <Ionicons name="attach" size={24} color="#666" />
        </TouchableOpacity>
        
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={handleTyping}
          placeholder="Type a message..."
          multiline
          maxLength={1000}
          editable={!loading}
        />
        
        <TouchableOpacity 
          style={styles.imageButton}
          onPress={handleAttachImage}
        >
          <Ionicons name="camera" size={24} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!message.trim() || loading}
        >
          <Ionicons 
            name="send" 
            size={20} 
            color={message.trim() ? "#007AFF" : "#999"} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  attachButton: {
    padding: 8,
    marginRight: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  imageButton: {
    padding: 8,
    marginLeft: 4,
  },
  sendButton: {
    padding: 8,
    marginLeft: 4,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
