import { APPWRITE_CONFIG, FILE_UPLOAD } from '@/src/utils/constants';
import { fileStorage } from './appwrite';

export class StorageService {
  async uploadAvatar(file: File): Promise<string> {
    try {
      const fileId = `avatar_${Date.now()}`;
      await fileStorage.upload(APPWRITE_CONFIG.BUCKETS.AVATARS, fileId, file);
      return fileId;
    } catch (error) {
      throw new Error('فشل في رفع الصورة الشخصية.');
    }
  }

  async uploadMessageAttachment(file: File): Promise<string> {
    try {
      const fileId = `attachment_${Date.now()}`;
      await fileStorage.upload(APPWRITE_CONFIG.BUCKETS.MESSAGE_ATTACHMENTS, fileId, file);
      return fileId;
    } catch (error) {
      throw new Error('فشل في رفع المرفق.');
    }
  }

  async getFileUrl(bucketId: string, fileId: string): Promise<string> {
    try {
      return fileStorage.getView(bucketId, fileId).toString();
    } catch (error) {
      throw new Error('فشل في تحميل الملف.');
    }
  }

  async deleteFile(bucketId: string, fileId: string): Promise<void> {
    try {
      await fileStorage.delete(bucketId, fileId);
    } catch (error) {
      throw new Error('فشل في حذف الملف.');
    }
  }

  validateFile(file: File, type: 'image' | 'video' | 'audio' | 'document'): { isValid: boolean; error?: string } {
    // Check file size
    if (file.size > FILE_UPLOAD.MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `حجم الملف يجب أن يكون أقل من ${Math.round(FILE_UPLOAD.MAX_FILE_SIZE / (1024 * 1024))} ميجابايت`,
      };
    }

    // Check file type
    let allowedTypes: string[] = [];
    switch (type) {
      case 'image':
        allowedTypes = FILE_UPLOAD.ALLOWED_IMAGE_TYPES;
        break;
      case 'video':
        allowedTypes = FILE_UPLOAD.ALLOWED_VIDEO_TYPES;
        break;
      case 'audio':
        allowedTypes = FILE_UPLOAD.ALLOWED_AUDIO_TYPES;
        break;
      case 'document':
        allowedTypes = FILE_UPLOAD.ALLOWED_DOCUMENT_TYPES;
        break;
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'نوع الملف غير مدعوم',
      };
    }

    return { isValid: true };
  }

  async compressImage(file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('فشل في ضغط الصورة'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error('فشل في تحميل الصورة'));
      img.src = URL.createObjectURL(file);
    });
  }
}

export const storageService = new StorageService();
