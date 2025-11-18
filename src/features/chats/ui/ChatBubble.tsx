import { MessageWithSender } from '@/src/types/chat';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { formatMessageTime } from '../utils/date';

interface ChatBubbleProps {
  message: MessageWithSender;
  isOwn: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  isOwn,
  onPress,
  onLongPress,
}) => {
  const bubbleStyle = isOwn ? styles.ownBubble : styles.otherBubble;
  const textStyle = isOwn ? styles.ownText : styles.otherText;

  return (
    <View style={[styles.container, isOwn ? styles.ownContainer : styles.otherContainer]}>
      <View style={[styles.bubble, bubbleStyle]}>
        <Text style={[styles.messageText, textStyle]}>
          {message.content}
        </Text>
        <View style={styles.messageFooter}>
          <Text style={[styles.timeText, textStyle]}>
            {formatMessageTime(message.created_at)}
          </Text>
          {isOwn && (
            <Text style={[styles.seenText, textStyle]}>
              {message.seen_by.length > 1 ? '✓✓' : '✓'}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
    paddingHorizontal: 16,
  },
  ownContainer: {
    alignItems: 'flex-end',
  },
  otherContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  ownBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#E5E5EA',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownText: {
    color: '#FFFFFF',
  },
  otherText: {
    color: '#000000',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  timeText: {
    fontSize: 12,
    opacity: 0.7,
  },
  seenText: {
    fontSize: 12,
    marginLeft: 4,
  },
});
