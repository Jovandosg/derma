import { ImageFile, AnalysisResult } from '../types';

// Simulated conditions and their confidence levels
const CONDITIONS = [
  {
    name: 'Actinic Keratosis',
    confidence: () => 0.7 + Math.random() * 0.2,
    recommendations: [
      'Regular skin examinations',
      'Sun protection with SPF 50+',
      'Consider consultation with a dermatologist'
    ]
  },
  {
    name: 'Basal Cell Carcinoma',
    confidence: () => 0.6 + Math.random() * 0.3,
    recommendations: [
      'Prompt medical evaluation recommended',
      'Avoid sun exposure without protection',
      'Schedule a follow-up with a dermatologist'
    ]
  },
  {
    name: 'Melanocytic Nevus',
    confidence: () => 0.75 + Math.random() * 0.2,
    recommendations: [
      'Annual skin check recommended',
      'Monitor for any changes in size, shape, or color',
      'Use sun protection consistently'
    ]
  },
  {
    name: 'Dermatofibroma',
    confidence: () => 0.65 + Math.random() * 0.2,
    recommendations: [
      'Usually benign and doesn\'t require treatment',
      'Document any changes with photographs',
      'See a dermatologist if growth is rapid'
    ]
  },
  {
    name: 'Vascular Lesion',
    confidence: () => 0.6 + Math.random() * 0.25,
    recommendations: [
      'Consult with a specialist for proper classification',
      'Avoid irritating the area',
      'Consider imaging studies for deeper assessment'
    ]
  }
];

// Mock API call to analyze image
export const mockAnalyzeImage = (image: ImageFile): Promise<AnalysisResult> => {
  return new Promise((resolve, reject) => {
    // Simulate API processing time
    setTimeout(() => {
      try {
        // Randomly select a condition
        const selectedCondition = CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)];
        
        // Generate a random confidence value for this condition
        const confidence = selectedCondition.confidence();
        
        // Create result object
        const result: AnalysisResult = {
          diagnosis: selectedCondition.name,
          confidence,
          recommendations: selectedCondition.recommendations,
          areas: [
            {
              x: Math.random() * 0.7,
              y: Math.random() * 0.7,
              width: 0.1 + Math.random() * 0.2,
              height: 0.1 + Math.random() * 0.2,
              label: selectedCondition.name,
              confidence
            }
          ]
        };
        
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, 1500 + Math.random() * 1500); // Random delay between 1.5-3 seconds
  });
};