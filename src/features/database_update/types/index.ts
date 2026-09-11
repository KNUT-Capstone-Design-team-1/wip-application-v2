import { TDataTable, TResourceDataSchemas } from '@services/database/types';

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

// 업데이트가 필요한 테이블 정보
export interface IUpdateNeeded {
  table: string;
  schemaVer: number;
  dataVer: number;
  oldSchemaVer?: number;
  oldDataVer?: number;
}

// 전체 테이블 업데이트 검사 결과
export interface IUpdateCheckResult {
  updatesNeeded: IUpdateNeeded[];
  isForceUpdate: boolean;
}

// REST API 응답 및 캐시 파일 구조
export interface ICachedPageData<T = TResourceDataSchemas> {
  resource: T[];
  total: number;
  totalPage: number;
  current: number;
}

// 테이블 메타데이터 (전체 페이지 수 및 총 아이템 수)
export interface ITableMetadata {
  totalPages: number;
  totalItems: number;
}

// UI에 전달되는 업데이트 진행 상태
export interface IUpdateProgress {
  status: string;
  progress: number;
  isUpdating?: boolean;
}

// AsyncStorage에 영속 저장되는 백그라운드 업데이트 상태
export interface IPersistedUpdateState {
  status: DatabaseUpdateStatus;
  tablesToUpdate: IUpdateNeeded[];
  currentTableIndex: number;
  currentTable: string | null;
  currentPage: number;
  totalPages: number;
  overallProgress: number;
  completedTables: string[];
  lastUpdated: number;
}

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

// 앱 초기화 전역 스토어 상태 인터페이스
export interface AppInitState {
  status: InitStatus;
  updateStatus: DatabaseUpdateStatus;
  updateCurrentTable: TDataTable | null;
  updateCurrentPage: number;
  totalPages: number;
  overallProgress: number;
  downloadedBytes: number;
  totalBytes: number;
  errorMessage: string | null;
  updateModalData: IUpdateNeeded[] | null;
  updateModalResolve: ((result: boolean) => void) | null;
  tablesToUpdate: IUpdateNeeded[];

  setStatus: (status: InitStatus) => void;
  setUpdateStatus: (status: DatabaseUpdateStatus) => void;
  setUpdateCurrentTable: (table: TDataTable | null) => void;
  setUpdateCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  setOverallProgress: (progress: number) => void;
  setDownloadedBytes: (bytes: number) => void;
  setTotalBytes: (bytes: number) => void;
  setErrorMessage: (error: string | null) => void;
  setUpdateModal: (
    data: IUpdateNeeded[] | null,
    resolve: ((result: boolean) => void) | null,
  ) => void;
  setTablesToUpdate: (tables: IUpdateNeeded[]) => void;
  reset: () => void;
}
