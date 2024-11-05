import React, { useCallback, useState } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageUploadProps {
  title: string;
  image: string | null;
  onImageSelect: (image: string) => void;
  onImageRemove: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  title,
  image,
  onImageSelect,
  onImageRemove,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File): boolean => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return false;
    }
    setError(null);
    return true;
  };

  const processFile = (file: File) => {
    if (!validateFile(file)) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      onImageSelect(event.target?.result as string);
    };
    reader.onerror = () => {
      setError('Error reading file');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [onImageSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/20 backdrop-blur-sm rounded-xl shadow-xl p-6"
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-4">{title}</h2>
      <AnimatePresence mode="wait">
        {!image ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-colors duration-200
              ${isDragging
                ? 'border-primary bg-primary/10'
                : 'border-white/20 hover:border-primary hover:bg-white/5'
              }
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id={`file-${title}`}
            />
            <label
              htmlFor={`file-${title}`}
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-12 h-12 text-primary mb-4" />
              <p className="text-gray-200 font-medium mb-2">
                Drag and drop your image here
              </p>
              <p className="text-gray-400 text-sm">
                or click to browse (JPEG, PNG, TIFF)
              </p>
              {error && (
                <div className="flex items-center gap-2 text-red-400 mt-4">
                  <AlertCircle size={16} />
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </label>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            <img
              src={image}
              alt={title}
              className="w-full h-64 object-cover rounded-lg"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onImageRemove}
              className="absolute top-2 right-2 bg-black/75 text-white p-2 rounded-full hover:bg-black transition-colors"
            >
              <X size={20} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ImageUpload;