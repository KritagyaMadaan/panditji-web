import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase.ts";

// --- Constants ---
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE_KB = 800; 
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_KB * 1024;

// --- Validation ---
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return `Invalid file type. Allowed: JPG, JPEG, PNG, WEBP`;
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File size is more than maximum limit`;
  }
  return null;
}

// --- Convert file to Base64 data URL ---
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => reject(new Error("File reading error"));
    reader.readAsDataURL(file);
  });
}

// --- Delete old image (no-op since we don't use Firebase Storage) ---
export async function deleteImageFromStorage(imageUrl: string): Promise<void> {
  // No-op for base64 storage since it is stored inline in Firestore
  return;
}

// --- Main upload function ---
export interface UploadResult {
  downloadUrl: string;
  storagePath: string;
}

export async function uploadProfileImage(
  file: File,
  userId: string,
  existingImageUrl?: string,
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  // Validate
  const validationError = validateImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  // Simulate progress transitions
  onProgress?.(20);
  const base64Data = await fileToBase64(file);
  onProgress?.(70);
  onProgress?.(100);

  return {
    downloadUrl: base64Data,
    storagePath: `base64_firestore_${userId}`
  };
}

// --- Convenience: upload + update Firestore document ---
export async function uploadAndUpdateProfile(
  file: File,
  userId: string,
  existingImageUrl?: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  const { downloadUrl } = await uploadProfileImage(
    file,
    userId,
    existingImageUrl,
    onProgress
  );

  // Update both users and pandits collections
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    photoUrl: downloadUrl,
    uploadedAt: serverTimestamp(),
  });

  // Also update pandits collection (merge)
  try {
    const panditRef = doc(db, "pandits", userId);
    await updateDoc(panditRef, {
      photoUrl: downloadUrl,
      uploadedAt: serverTimestamp(),
    });
  } catch {
    // Pandit doc may not exist yet — that's okay
  }

  return downloadUrl;
}
