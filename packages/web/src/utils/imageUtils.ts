// packages/web/src/utils/imageConversionUtils.ts

import type { QuizImages } from '@quiz-app/shared';
import type { WebQuizImages } from '../types';

/**
 * Validates if a file is a valid image
 */
export function isValidImage(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
}

/**
 * Formats file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

/**
 * Gets image dimensions
 */
export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
      URL.revokeObjectURL(img.src); // Clean up
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Converts File to base64 string
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Converts base64 string back to File (for display purposes)
 */
export function base64ToFile(base64: string, filename = 'image'): File {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  // Extract file extension from mime type
  const ext = mime.split('/')[1];
  const finalFilename = filename.includes('.') ? filename : `${filename}.${ext}`;

  return new File([u8arr], finalFilename, { type: mime });
}

/**
 * Gets file extension from base64 data URL
 */
export function getExtensionFromBase64(base64: string): string {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  return mime.split('/')[1];
}

/**
 * Compresses an image file to reduce size
 */
export async function compressImage(file: File, maxWidth = 1920): Promise<string> {
  return new Promise((_, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to base64 with compression
      // const compressedBase64 = canvas.toBlob(
      //   (blob) => {
      //     if (blob) {
      //       const reader = new FileReader();
      //       reader.onload = () => {
      //         if (typeof reader.result === 'string') {
      //           resolve(reader.result);
      //         } else {
      //           reject(new Error('Failed to convert compressed image to base64'));
      //         }
      //       };
      //       reader.readAsDataURL(blob);
      //     } else {
      //       reject(new Error('Failed to compress image'));
      //     }
      //   },
      //   file.type,
      //   quality
      // );

      URL.revokeObjectURL(img.src); // Clean up
    };

    img.onerror = () => reject(new Error('Failed to load image for compression'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Generates a thumbnail from an image file
 */
export async function generateThumbnail(file: File, maxSize = 300): Promise<string> {
  return compressImage(file, maxSize);
}

/**
 * Converts WebQuizImages (base64) to QuizImages (numbers) for shared domain
 * This is a utility for when you need to use shared domain functions
 */
export function webImagesToSharedImages(webImages: WebQuizImages): QuizImages {
  // For now, we'll use hash codes of the base64 strings as numbers
  // In a real implementation, you might want to use a more sophisticated mapping
  const stringToNumber = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };

  return {
    imageUrl: stringToNumber(webImages.imageUrl),
    thumbnailUrl: webImages.thumbnailUrl ? stringToNumber(webImages.thumbnailUrl) : undefined,
    unsolvedImageUrl: webImages.unsolvedImageUrl ? stringToNumber(webImages.unsolvedImageUrl) : undefined,
    unsolvedThumbnailUrl: webImages.unsolvedThumbnailUrl ? stringToNumber(webImages.unsolvedThumbnailUrl) : undefined
  };
}

/**
 * Utility to get a preview URL for base64 images
 */
export function getImagePreview(image: string | File): string {
  if (typeof image === 'string') {
    return image; // Already a base64 string or URL
  }
  return URL.createObjectURL(image);
}

/**
 * Validates image file size
 */
export function validateImageSize(file: File, maxSizeMB = 10): { valid: boolean; error?: string } {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `Datei ist zu groß. Maximale Größe: ${maxSizeMB}MB`
    };
  }
  
  return { valid: true };
}

/**
 * Utility object with all image conversion functions
 */
export const ImageConversionUtils = {
  isValidImage,
  formatFileSize,
  getImageDimensions,
  fileToBase64,
  base64ToFile,
  getExtensionFromBase64,
  compressImage,
  generateThumbnail,
  webImagesToSharedImages,
  getImagePreview,
  validateImageSize
} as const;