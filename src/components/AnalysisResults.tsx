import React from 'react';
import { ImageFile } from '../types';
import { AlertTriangle, Check, HelpCircle } from 'lucide-react';

interface AnalysisResultsProps {
  image: ImageFile;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ image }) => {
  if (!image.result || image.status !== 'complete') {
    return null;
  }

  const { diagnosis, confidence, recommendations } = image.result;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.8) return <Check className="h-5 w-5 text-green-500" />;
    if (confidence >= 0.5) return <HelpCircle className="h-5 w-5 text-yellow-500" />;
    return <AlertTriangle className="h-5 w-5 text-red-500" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-fadeIn">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h3>
      
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <span className="text-sm font-medium text-gray-700 w-32">Diagnosis:</span>
          <span className="text-sm font-bold text-gray-900">{diagnosis || 'Unknown'}</span>
        </div>
        
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-700 w-32">Confidence:</span>
          <div className="flex items-center">
            {getConfidenceIcon(confidence)}
            <span className={`ml-1.5 text-sm font-semibold ${getConfidenceColor(confidence)}`}>
              {Math.round(confidence * 100)}%
            </span>
          </div>
        </div>
      </div>
      
      {recommendations && recommendations.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Recommendations:</h4>
          <ul className="list-disc list-inside space-y-1">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="text-sm text-gray-700">
                {recommendation}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500 italic">
        Note: This analysis is for informational purposes only and should not replace professional medical advice.
      </div>
    </div>
  );
};

export default AnalysisResults;