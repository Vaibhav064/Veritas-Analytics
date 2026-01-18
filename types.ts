export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface AnalysisResult {
  classification: 'REAL' | 'FAKE';
  confidenceScore: number;
  explanation: string;
  linguisticPatterns: string[];
  topFeatures: { word: string; impact: number }[];
}

// Mock Data Types for EDA
export interface DistributionData {
  name: string;
  value: number;
  color?: string;
}

export interface FeatureImportanceData {
  feature: string;
  importance: number;
}

export interface ConfusionMatrixData {
  actual: string;
  predictedReal: number;
  predictedFake: number;
}