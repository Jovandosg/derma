"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { isValidImageType, formatFileSize } from "@/lib/utils";
import toast from "react-hot-toast";

interface ImageUploadProps {
  onImageSelected: (file: File) => void;
}

export default function ImageUpload({ onImageSelected }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        handleFile(file);
      }
    },
    [onImageSelected]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        handleFile(file);
      }
    },
    [onImageSelected]
  );

  const handleFile = useCallback(
    (file: File) => {
      if (!isValidImageType(file)) {
        toast.error("Formato de arquivo inválido. Por favor, selecione uma imagem (JPEG, PNG).");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Arquivo muito grande. O tamanho máximo é 5MB.");
        return;
      }

      setSelectedFile(file);
      onImageSelected(file);

      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelected]
  );

  const clearSelection = useCallback(() => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/jpg"
        className="hidden"
        data-testid="file-input"
      />

      {!preview ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`upload-container ${
            isDragging ? "drag-active" : ""
          } rounded-lg p-8 text-center cursor-pointer`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium">Arraste e solte sua imagem aqui</h3>
            <p className="text-sm text-muted-foreground">
              ou clique para selecionar um arquivo
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Formatos suportados: JPEG, PNG. Tamanho máximo: 5MB
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative rounded-lg overflow-hidden border border-border"
        >
          <div className="aspect-video relative">
            <img
              src={preview}
              alt="Preview da imagem"
              className="w-full h-full object-contain bg-black/5 dark:bg-white/5"
            />
          </div>
          <div className="absolute top-2 right-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearSelection();
              }}
              className="p-1 bg-white/80 dark:bg-black/80 rounded-full hover:bg-white dark:hover:bg-black transition-colors"
              aria-label="Remover imagem"
            >
              <X className="h-5 w-5 text-red-500" />
            </button>
          </div>
          {selectedFile && (
            <div className="p-3 bg-muted">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium truncate max-w-[200px]">
                    {selectedFile.name}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </span>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}