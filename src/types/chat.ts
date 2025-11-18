export interface Chat {
  $id: string;
  name?: string; // اسم المحادثة (للمجموعات فقط)
  imageUrl?: string; // صورة المحادثة (للمجموعات فقط)
  is_group: boolean; // true للمجموعات، false للـ DM
  members: string[]; // قائمة معرفات المستخدمين المشاركين
  last_message_id?: string; // مرجع آخر رسالة
  created_by: string; // معرف المستخدم المنشئ
  created_at: string; // تاريخ الإنشاء
}

export interface Message {
  $id: string;
  chat_id: string; // مرجع إلى chats
  sender_id: string; // مرجع إلى profiles.user_id
  content: string; // نص الرسالة
  file_id?: string; // معرف الملف (اختياري)
  seen_by: string[]; // المستخدمون الذين قرأوا الرسالة
  created_at: string; // وقت الإرسال
}

export interface ChatMember {
  user_id: string;
  username: string;
  avatar?: string;
  is_online?: boolean;
}

export interface ChatWithMembers extends Chat {
  members_data: ChatMember[];
  last_message?: Message;
}

export interface MessageWithSender extends Message {
  sender: ChatMember;
}
