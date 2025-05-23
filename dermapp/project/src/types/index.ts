export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  status: 'idle' | 'analyzing' | 'complete' | 'error';
  result?: AnalysisResult;
}

export interface AnalysisResult {
  diagnosis?: string;
  confidence: number;
  areas?: {
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
    confidence: number;
  }[];
  recommendations?: string[];
}