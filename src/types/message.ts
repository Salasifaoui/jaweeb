export interface Message {
  $id: string;
  chat_id: string; // مرجع إلى chats
  sender_id: string; // مرجع إلى profiles.user_id
  content: string; // نص الرسالة
  file_id?: string; // معرف الملف (اختياري)
  seen_by: string[]; // المستخدمون الذين قرأوا الرسالة
  created_at: string; // وقت الإرسال
}

export interface MessageInput {
  chat_id: string;
  content: string;
  file_id?: string;
}

export interface MessageStatus {
  message_id: string;
  seen_by: string[];
  delivered_to: string[];
}

export interface TypingIndicator {
  chat_id: string;
  user_id: string;
  is_typing: boolean;
  timestamp: string;
}
