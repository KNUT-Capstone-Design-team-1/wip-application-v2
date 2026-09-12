import { TDataTable } from '@services/database/types';
import { DatabaseUpdateStatus, InitStatus } from './status';
import { IUpdateNeeded } from './models';

// 앱 초기화 전역 스토어 상태 인터페이스
export interface AppInitState {
  status: InitStatus;
  updateStatus: DatabaseUpdateStatus;
  updateCurrentTable: TDataTable | null;
  updateCurrentPage: number;
  totalPages: number;
  overallProgress: number;
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
  setErrorMessage: (error: string | null) => void;
  setUpdateModal: (
    data: IUpdateNeeded[] | null,
    resolve: ((result: boolean) => void) | null,
  ) => void;
  setTablesToUpdate: (tables: IUpdateNeeded[]) => void;
  reset: () => void;
}
