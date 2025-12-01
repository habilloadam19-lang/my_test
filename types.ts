export enum AppStep {
  SELECT_FACE = 1,
  SELECT_CLOTH = 2,
  GENERATING = 3,
  RESULT = 4
}

export interface ImageAsset {
  id: string;
  url: string;
  base64?: string; // For uploaded/generated images
  type: 'preset' | 'upload' | 'generated';
  label?: string;
}

export interface HistoryItem {
  id: string;
  faceUrl: string;
  clothUrl: string;
  resultUrl: string;
  timestamp: number;
}

export interface LoadingState {
  isLoading: boolean;
  message: string;
}