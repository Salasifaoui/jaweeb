
import { Media } from "@/src/models/Media";
import { randomUUID } from "expo-crypto";
import { Platform } from "react-native";
import { useFileUpload } from "../appwrite";
import { APP_CONFIG } from "../configs";

export type UploadableMediaFile = {
  uri: string;
  type: string;
  file_name: string;
  mime_type: string;
  uuid: string;
};

export const uploadMediaFile = async (
  file: UploadableMediaFile,
  onProgressUpdate: (progress: number) => void = () => null,
): Promise<Media> => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    // Start progress
    onProgressUpdate(0.1);

    // Prepare file for Appwrite
    const fileToUpload = {
      uri: Platform.OS === "ios" ? file.uri.replace("file://", "") : file.uri,
      name: file.file_name || `${file.uuid || randomUUID()}.jpg`,
      type: file.type || file.mime_type || 'image/jpeg',
    };

    // Update progress
    onProgressUpdate(0.3);

    // Upload using MediaService
    const uploadMedia = useFileUpload()
    const uploadMediaMutation = uploadMedia.mutateAsync({
      bucketId: APP_CONFIG.STORAGE_BUCKET_ID,
      file: fileToUpload as any,
    });

    // Complete progress
    onProgressUpdate(1.0);

    return uploadMediaMutation as any;
  } catch (error: any) {
    console.error("Upload error:", error);
    throw {
      status: error.status || 500,
      statusText: error.message || "Upload failed",
      error,
    };
  }
};
