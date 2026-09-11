import { TDataTable } from '@services/database/types';
import { DatabaseUpdateStatus, InitStatus, IUpdateProgress } from './status';

// 동기화 파이프라인 콜백 인터페이스
export interface ISyncPipelineCallbacks {
  setUpdateProgress: React.Dispatch<React.SetStateAction<IUpdateProgress>>;
  setUpdateCurrentTable: (table: TDataTable) => void;
  setUpdateCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  setOverallProgress: (progress: number) => void;
  setUpdateStatus: (status: DatabaseUpdateStatus) => void;
  setStatus: (status: InitStatus) => void;
  setErrorMessage: (msg: string | null) => void;
  setIsInitializing: (isInitializing: boolean) => void;
  showToast: (options: { message: string }) => void;
}
