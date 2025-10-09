# Jaweeb - تطبيق المراسلة

تطبيق مراسلة فوري مبني بـ React Native و Expo مع دعم للمحادثات الفردية والجماعية.

## 🚀 المميزات

- **المصادقة**: تسجيل الدخول، إنشاء حساب، إعادة تعيين كلمة المرور
- **المحادثات**: محادثات فردية وجماعية
- **الرسائل الفورية**: إرسال واستقبال الرسائل في الوقت الفعلي
- **الملفات الشخصية**: إدارة الملف الشخصي والصورة الشخصية
- **واجهة عربية**: دعم كامل للغة العربية مع RTL
- **التخزين السحابي**: رفع وإدارة الملفات مع Appwrite

## 🏗️ هيكل المشروع

```
jaweeb/
├── app/                         # نقطة الدخول في Expo Router
│   ├── _layout.tsx              # التوزيع العام
│   ├── index.tsx                # شاشة البداية / التوجيه
│   ├── (auth)/                  # مجموعة شاشات المصادقة
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot-password.tsx
│   ├── (chat)/                  # شاشات المراسلة
│   │   ├── _layout.tsx
│   │   ├── chat-list.tsx
│   │   ├── chat-room.tsx
│   │   └── new-group.tsx
│   └── (profile)/               # الملف الشخصي والإعدادات
│       ├── _layout.tsx
│       ├── profile.tsx
│       └── edit-profile.tsx
│
├── src/
│   ├── components/              # مكونات واجهة قابلة لإعادة الاستخدام
│   │   ├── Avatar.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── InputField.tsx
│   │   └── Button.tsx
│   ├── hooks/                   # custom hooks
│   │   ├── useAuth.ts
│   │   ├── useChats.ts
│   │   └── useRealtime.ts
│   ├── services/                # واجهات الاتصال بـ Appwrite
│   │   ├── appwrite.ts
│   │   ├── authService.ts
│   │   ├── chatService.ts
│   │   └── storageService.ts
│   ├── store/                   # إدارة الحالة (Zustand)
│   │   ├── useAuthStore.ts
│   │   └── useChatStore.ts
│   ├── types/                   # تعريفات TypeScript
│   │   ├── user.ts
│   │   ├── message.ts
│   │   ├── group.ts
│   │   └── index.ts
│   ├── utils/                   # دوال مساعدة
│   │   ├── constants.ts
│   │   ├── formatDate.ts
│   │   └── validators.ts
│   ├── theme/                   # إعداد المظهر
│   │   └── colors.ts
│   └── config/                  # إعداد البيئة
│       └── env.ts
│
├── assets/                      # صور، شعارات، أصوات
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── app.json
```

## 🛠️ التقنيات المستخدمة

- **React Native** - إطار العمل الأساسي
- **Expo** - منصة التطوير والنشر
- **Expo Router** - التنقل بين الشاشات
- **TypeScript** - لغة البرمجة
- **Appwrite** - الخدمات السحابية (قاعدة البيانات، المصادقة، التخزين)
- **Zustand** - إدارة الحالة
- **Tailwind CSS** - تصميم الواجهات

## 📦 التثبيت والإعداد

### 1. تثبيت المتطلبات

```bash
# تثبيت Expo CLI
npm install -g @expo/cli

# تثبيت التبعيات
npm install
```

### 2. إعداد Appwrite

1. أنشئ مشروع جديد في [Appwrite Console](https://cloud.appwrite.io)
2. أنشئ قاعدة البيانات والمجموعات التالية:
   - `users` - للمستخدمين
   - `chats` - للمحادثات
   - `messages` - للرسائل
   - `chat_members` - لأعضاء المحادثات
3. أنشئ Buckets للملفات:
   - `avatars` - للصور الشخصية
   - `message_attachments` - لمرفقات الرسائل

### 3. إعداد متغيرات البيئة

أنشئ ملف `.env` في الجذر:

```env
# Appwrite Configuration
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_database_id_here

# Collection IDs
EXPO_PUBLIC_APPWRITE_USERS_COLLECTION=users
EXPO_PUBLIC_APPWRITE_CHATS_COLLECTION=chats
EXPO_PUBLIC_APPWRITE_MESSAGES_COLLECTION=messages
EXPO_PUBLIC_APPWRITE_CHAT_MEMBERS_COLLECTION=chat_members

# Bucket IDs
EXPO_PUBLIC_APPWRITE_AVATARS_BUCKET=avatars
EXPO_PUBLIC_APPWRITE_ATTACHMENTS_BUCKET=message_attachments

# App Configuration
EXPO_PUBLIC_APP_URL=https://your-app-domain.com
EXPO_PUBLIC_APP_NAME=Jaweeb
```

### 4. تشغيل التطبيق

```bash
# تشغيل التطبيق
npm start

# تشغيل على Android
npm run android

# تشغيل على iOS
npm run ios

# تشغيل على الويب
npm run web
```

## 🎨 التخصيص

### الألوان

يمكنك تخصيص الألوان من خلال ملف `src/theme/colors.ts`:

```typescript
export const colors = {
  primary: {
    500: '#007AFF', // اللون الأساسي
  },
  // ... باقي الألوان
};
```

### الخطوط

يمكنك إضافة خطوط مخصصة في `app.json`:

```json
{
  "expo": {
    "fonts": [
      "assets/fonts/CustomFont.ttf"
    ]
  }
}
```

## 📱 الميزات المخططة

- [ ] إرسال الصور والملفات
- [ ] الرسائل الصوتية
- [ ] المكالمات الصوتية والمرئية
- [ ] الإشعارات الفورية
- [ ] البحث في المحادثات
- [ ] الرسائل المؤقتة
- [ ] ردود الأفعال على الرسائل
- [ ] مشاركة الموقع

## 🤝 المساهمة

1. Fork المشروع
2. أنشئ branch جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى Branch (`git push origin feature/amazing-feature`)
5. افتح Pull Request

## 📄 الرخصة

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 📞 الدعم

إذا واجهت أي مشاكل أو لديك أسئلة، يرجى فتح issue في GitHub أو التواصل معنا.

---

**ملاحظة**: هذا المشروع في مرحلة التطوير. قد تحتاج إلى تعديل بعض الإعدادات حسب احتياجاتك.