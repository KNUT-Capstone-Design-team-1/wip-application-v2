import { TResourceDataSchemas } from '@services/database/types';
import { DatabaseUpdateStatus } from './status';

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
