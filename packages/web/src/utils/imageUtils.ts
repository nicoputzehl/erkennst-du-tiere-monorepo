// Basic image utilities for the Quiz Editor

/**
 * Validates if a file is a valid image
 */
function isValidImage(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
}

/**
 * Formats file size for display
 */
function formatFileSize(bytes: number): string {
		if (bytes === 0) return "0 Bytes";

		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
	}
/**
 * Gets image dimensions
 */
async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };

    img.src = URL.createObjectURL(file);
  });
}

/**
 * Converts File to base64 string (for storage/export)
 */
async function fileToBase64(file: File): Promise<string> {
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
 * Converts base64 string back to File
 */
function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

// Exportiere alle Funktionen in einem Konstanten-Objekt
export const ImageUtils = {
  isValidImage,
  formatFileSize,
  getImageDimensions,
  fileToBase64,
  base64ToFile,
} as const;