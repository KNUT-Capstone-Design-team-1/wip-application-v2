// 데이터베이스 업데이트 진행 상태
export type DatabaseUpdateStatus =
  | 'idle'
  | 'checking'
  | 'downloading'
  | 'download_completed'
  | 'installing'
  | 'completed'
  | 'failed';

// 앱 초기화 진행 상태
export type InitStatus = 'IDLE' | 'RUNNING' | 'PAUSED' | 'ERROR' | 'COMPLETED';

// UI에 전달되는 업데이트 진행 상태
export interface IUpdateProgress {
  status: string;
  progress: number;
  isUpdating?: boolean;
}
