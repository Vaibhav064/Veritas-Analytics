import { DistributionData, FeatureImportanceData, ConfusionMatrixData } from './types';

// Mocking Kaggle Dataset Statistics
export const CLASS_DISTRIBUTION: DistributionData[] = [
  { name: 'REAL News', value: 48, color: '#10b981' }, // Emerald 500
  { name: 'FAKE News', value: 52, color: '#ef4444' }, // Red 500
];

export const TEXT_LENGTH_DISTRIBUTION = [
  { range: '0-200', count: 150 },
  { range: '200-400', count: 450 },
  { range: '400-600', count: 800 },
  { range: '600-800', count: 650 },
  { range: '800-1000', count: 300 },
  { range: '1000+', count: 120 },
];

export const TOP_FAKE_WORDS: FeatureImportanceData[] = [
  { feature: 'breaking', importance: 0.85 },
  { feature: 'shocking', importance: 0.78 },
  { feature: 'uncovered', importance: 0.72 },
  { feature: 'secret', importance: 0.65 },
  { feature: 'mainstream', importance: 0.58 },
  { feature: 'government', importance: 0.55 },
];

export const TOP_REAL_WORDS: FeatureImportanceData[] = [
  { feature: 'reported', importance: 0.82 },
  { feature: 'official', importance: 0.75 },
  { feature: 'statement', importance: 0.68 },
  { feature: 'tuesday', importance: 0.60 },
  { feature: 'according', importance: 0.58 },
  { feature: 'department', importance: 0.52 },
];

export const MODEL_PERFORMANCE = [
  { metric: 'Accuracy', value: 92.5, fullMark: 100 },
  { metric: 'Precision', value: 89.8, fullMark: 100 },
  { metric: 'Recall', value: 94.2, fullMark: 100 },
  { metric: 'F1-Score', value: 91.9, fullMark: 100 },
];

export const CONFUSION_MATRIX: ConfusionMatrixData[] = [
  { actual: 'Actual REAL', predictedReal: 950, predictedFake: 80 },
  { actual: 'Actual FAKE', predictedReal: 120, predictedFake: 1050 },
];