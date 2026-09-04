import { IPillData } from '@services/database/types';
import {
  IPillDetailRemoteDataSource,
  pillDetailRemoteDataSource,
} from '../datasources/pill_detail_remote_datasource';
import {
  IPillDetailSqliteDataSource,
  pillDetailSqliteDataSource,
} from '../datasources/pill_detail_sqlite_datasource';

export interface IPillDetailRepository {
  getPillData(itemSeq: string): Promise<IPillData | null>;
  getPillDetail(
    itemSeq: string,
  ): ReturnType<IPillDetailRemoteDataSource['getPillDetail']>;
  searchNarcotics(params: unknown): Promise<any[]>;
  searchCannabis(params: unknown): Promise<any[]>;
  searchPsychotropics(params: unknown): Promise<any[]>;
  searchProhibitedList(params: unknown): Promise<any[]>;
}

export class PillDetailRepository implements IPillDetailRepository {
  constructor(
    private readonly sqliteDataSource: IPillDetailSqliteDataSource = pillDetailSqliteDataSource,
    private readonly remoteDataSource: IPillDetailRemoteDataSource = pillDetailRemoteDataSource,
  ) {}

  // 로컬 기본 정보를 조회한다.
  getPillData(itemSeq: string) {
    return this.sqliteDataSource.getPillData(itemSeq);
  }

  // 원격 상세 정보를 조회한다.
  getPillDetail(itemSeq: string) {
    return this.remoteDataSource.getPillDetail(itemSeq);
  }

  // 분류별 성분을 조회한다.
  searchNarcotics(params: unknown) {
    return this.sqliteDataSource.searchNarcotics(params);
  }

  // 대마 성분을 조회한다.
  searchCannabis(params: unknown) {
    return this.sqliteDataSource.searchCannabis(params);
  }

  // 향정신성 성분을 조회한다.
  searchPsychotropics(params: unknown) {
    return this.sqliteDataSource.searchPsychotropics(params);
  }

  // 금지 성분을 조회한다.
  searchProhibitedList(params: unknown) {
    return this.sqliteDataSource.searchProhibitedList(params);
  }
}

export const pillDetailRepository = new PillDetailRepository();
