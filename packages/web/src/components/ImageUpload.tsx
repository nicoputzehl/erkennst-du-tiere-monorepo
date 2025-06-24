import  { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  label: string;
  currentImage?: File | string;
  onImageChange: (file: File | null) => void;
  accept?: string;
  placeholder?: string;
  maxSize?: number; // in MB
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  currentImage,
  onImageChange,
  accept = "image/*",
  placeholder = "Bild hochladen",
  maxSize = 10
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getImagePreview = (image: File | string) => {
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    return image;
  };

  const isValidImage = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return validTypes.includes(file.type);
  };

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!isValidImage(file)) {
      alert('Bitte wählen Sie eine gültige Bilddatei (JPG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`Datei ist zu groß. Maximale Größe: ${maxSize}MB`);
      return;
    }

    // Direct upload without processing
    onImageChange(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveImage = () => {
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <p className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </p>

      {currentImage ? (
        <div className="relative group">
          <img
            src={getImagePreview(currentImage)}
            alt={label}
            className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
          />
          
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
              <button
              type='button'
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                title="Bild ersetzen"
              >
                <Upload size={16} className="text-gray-600 dark:text-gray-300" />
              </button>
              <button
              type='button'
                onClick={handleRemoveImage}
                className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                title="Bild entfernen"
              >
                <X size={16} className="text-red-600" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
        type='button'
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 rounded-lg p-8 text-center transition-colors"
        >
          <ImageIcon size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-gray-600 dark:text-gray-300 mb-2">{placeholder}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            PNG, JPG, GIF, WebP bis {maxSize}MB
          </p>
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};