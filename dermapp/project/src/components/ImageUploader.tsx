import React, { useState, useCallback } from 'react';
import { Upload, ImagePlus, X } from 'lucide-react';
import { ImageFile } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ImageUploaderProps {
  onImagesUploaded: (newImages: ImageFile[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const processFiles = useCallback(
    (files: FileList) => {
      const imageFiles: ImageFile[] = [];
      
      Array.from(files).forEach((file) => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = () => {
            const newImage: ImageFile = {
              id: uuidv4(),
              file,
              preview: reader.result as string,
              status: 'idle',
            };
            
            imageFiles.push(newImage);
            
            if (imageFiles.length === files.length) {
              onImagesUploaded(imageFiles);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    },
    [onImagesUploaded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files);
      }
    },
    [processFiles]
  );

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-8 transition-colors duration-200 ease-in-out ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
      }`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div
          className={`p-4 rounded-full ${
            isDragging ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {isDragging ? (
            <ImagePlus className="h-12 w-12" />
          ) : (
            <Upload className="h-12 w-12" />
          )}
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">
            {isDragging ? 'Drop images here' : 'Drag & drop dermatological images'}
          </p>
          <p className="mt-1 text-sm text-gray-500">or click to browse files</p>
          <p className="mt-2 text-xs text-gray-400">
            Accepted formats: JPEG, PNG, TIFF (up to 20MB)
          </p>
        </div>
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          id="file-upload"
          onChange={handleFileInputChange}
        />
        <label
          htmlFor="file-upload"
          className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors duration-200"
        >
          Browse Files
        </label>
      </div>
    </div>
  );
};

export default ImageUploader;