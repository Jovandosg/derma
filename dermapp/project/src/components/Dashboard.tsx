import React, { useState, useCallback } from 'react';
import ImageUploader from './ImageUploader';
import ImagePreview from './ImagePreview';
import AnalysisResults from './AnalysisResults';
import { ImageFile } from '../types';
import { mockAnalyzeImage } from '../utils/mockApi';

const Dashboard: React.FC = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const handleImagesUploaded = useCallback((newImages: ImageFile[]) => {
    setImages((prevImages) => [...prevImages, ...newImages]);
  }, []);

  const handleRemoveImage = useCallback((id: string) => {
    setImages((prevImages) => prevImages.filter((image) => image.id !== id));
    if (selectedImageId === id) {
      setSelectedImageId(null);
    }
  }, [selectedImageId]);

  const handleAnalyzeImage = useCallback((id: string) => {
    // Set status to analyzing
    setImages((prevImages) =>
      prevImages.map((image) =>
        image.id === id ? { ...image, status: 'analyzing' } : image
      )
    );

    // Find the image
    const imageToAnalyze = images.find((image) => image.id === id);
    if (!imageToAnalyze) return;

    // Mock API call to analyze image
    mockAnalyzeImage(imageToAnalyze)
      .then((result) => {
        setImages((prevImages) =>
          prevImages.map((image) =>
            image.id === id
              ? { ...image, status: 'complete', result }
              : image
          )
        );
        setSelectedImageId(id);
      })
      .catch((error) => {
        console.error('Error analyzing image:', error);
        setImages((prevImages) =>
          prevImages.map((image) =>
            image.id === id
              ? { ...image, status: 'error' }
              : image
          )
        );
      });
  }, [images]);

  const selectedImage = selectedImageId
    ? images.find((image) => image.id === selectedImageId)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Dermatological Image Analysis
        </h2>
        <p className="text-gray-600 max-w-3xl">
          Upload dermatological images for AI-powered analysis. Our system uses advanced computer vision to detect and classify skin conditions for educational purposes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ImageUploader onImagesUploaded={handleImagesUploaded} />
          
          {images.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Uploaded Images
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image) => (
                  <div 
                    key={image.id}
                    className={`cursor-pointer transition-transform duration-200 ${
                      selectedImageId === image.id ? 'scale-105 ring-2 ring-blue-500 rounded-lg' : ''
                    }`}
                    onClick={() => image.status === 'complete' && setSelectedImageId(image.id)}
                  >
                    <ImagePreview
                      image={image}
                      onRemove={handleRemoveImage}
                      onAnalyze={handleAnalyzeImage}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          {selectedImage && selectedImage.status === 'complete' ? (
            <AnalysisResults image={selectedImage} />
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                How It Works
              </h3>
              <ol className="space-y-4">
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-sm mr-3">
                    1
                  </span>
                  <p className="text-sm text-gray-600">
                    Upload one or more dermatological images by dragging and dropping or browsing your files.
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-sm mr-3">
                    2
                  </span>
                  <p className="text-sm text-gray-600">
                    Click the "Analyze Image" button to process each image using our advanced AI model.
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-sm mr-3">
                    3
                  </span>
                  <p className="text-sm text-gray-600">
                    Review the analysis results, including potential diagnosis and confidence level.
                  </p>
                </li>
              </ol>
              <div className="mt-6 p-3 bg-blue-50 rounded-md border border-blue-100">
                <p className="text-xs text-blue-800">
                  <strong>Note:</strong> This tool is for educational purposes only and is not intended to replace professional medical diagnosis.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;