import React, { useState } from 'react';
import { ImageFile } from '../types';
import { X, ZoomIn, ZoomOut, RefreshCw, Check, AlertCircle } from 'lucide-react';

interface ImagePreviewProps {
  image: ImageFile;
  onRemove: (id: string) => void;
  onAnalyze: (id: string) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ image, onRemove, onAnalyze }) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  };

  const getStatusIcon = () => {
    switch (image.status) {
      case 'analyzing':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'complete':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (image.status) {
      case 'analyzing':
        return 'Analyzing...';
      case 'complete':
        return 'Analysis complete';
      case 'error':
        return 'Analysis failed';
      default:
        return 'Ready for analysis';
    }
  };

  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg">
      <div className="absolute top-2 right-2 z-10 flex space-x-1">
        <button
          onClick={handleZoomIn}
          className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors duration-200"
          title="Zoom in"
        >
          <ZoomIn className="h-4 w-4 text-gray-600" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors duration-200"
          title="Zoom out"
        >
          <ZoomOut className="h-4 w-4 text-gray-600" />
        </button>
        <button
          onClick={() => onRemove(image.id)}
          className="p-1 bg-white rounded-full shadow-sm hover:bg-red-100 transition-colors duration-200"
          title="Remove image"
        >
          <X className="h-4 w-4 text-gray-600 hover:text-red-600" />
        </button>
      </div>
      
      <div className="h-48 overflow-hidden bg-gray-50">
        <div className="relative h-full w-full overflow-hidden">
          <img
            src={image.preview}
            alt="Dermatological image"
            className="object-cover transition-transform duration-200 ease-in-out"
            style={{
              transform: `scale(${zoomLevel})`,
              maxHeight: '100%',
              margin: '0 auto',
            }}
          />
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-900 truncate">
            {image.file.name}
          </p>
          <span className="flex items-center text-xs font-medium">
            {getStatusIcon()}
            <span className={`ml-1 ${
              image.status === 'error' ? 'text-red-600' : 
              image.status === 'complete' ? 'text-green-600' : 
              image.status === 'analyzing' ? 'text-blue-600' : 
              'text-gray-500'
            }`}>
              {getStatusText()}
            </span>
          </span>
        </div>
        
        <div className="text-xs text-gray-500 mb-3">
          {(image.file.size / 1024 / 1024).toFixed(2)} MB
        </div>
        
        {image.status === 'idle' && (
          <button
            onClick={() => onAnalyze(image.id)}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Analyze Image
          </button>
        )}
        
        {image.status === 'complete' && image.result && (
          <div className="mt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Confidence:</span>
              <span className="text-sm font-semibold text-gray-900">
                {Math.round(image.result.confidence * 100)}%
              </span>
            </div>
            {image.result.diagnosis && (
              <p className="mt-1 text-sm font-medium text-gray-900">
                Diagnosis: <span className="font-bold">{image.result.diagnosis}</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePreview;