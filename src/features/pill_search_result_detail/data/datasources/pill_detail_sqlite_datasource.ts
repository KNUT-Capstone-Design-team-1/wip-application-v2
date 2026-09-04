import { getPillDatasByItemSeq } from '@services/database/queries/pill_data';
import { getNarcotics } from '@services/database/queries/narcotics';
import { getCannabis } from '@services/database/queries/cannabis';
import { getPsychotropics } from '@services/database/queries/psychotropics';
import { getProhibitedList } from '@services/database/queries/prohibited_list';
import { IPillData } from '@services/database/types';

export interface IPillDetailSqliteDataSource {
  getPillData(itemSeq: string): Promise<IPillData | null>;
  searchNarcotics(params: unknown): Promise<any[]>;
  searchCannabis(params: unknown): Promise<any[]>;
  searchPsychotropics(params: unknown): Promise<any[]>;
  searchProhibitedList(params: unknown): Promise<any[]>;
}

export class PillDetailSqliteDataSource implements IPillDetailSqliteDataSource {
  // 로컬 데이터베이스에서 알약 기본 정보를 조회한다.
  async getPillData(itemSeq: string) {
    const results = await getPillDatasByItemSeq([itemSeq]);
    return results[0] ?? null;
  }

  // 마약류 성분을 조회한다.
  searchNarcotics(params: unknown) {
    return getNarcotics(params as any, { page: 1, limit: 100 });
  }

  // 대마 성분을 조회한다.
  searchCannabis(params: unknown) {
    return getCannabis(params as any, { page: 1, limit: 100 });
  }

  // 향정신성 성분을 조회한다.
  searchPsychotropics(params: unknown) {
    return getPsychotropics(params as any, { page: 1, limit: 100 });
  }

  // 금지 성분을 조회한다.
  searchProhibitedList(params: unknown) {
    return getProhibitedList(params as any, { page: 1, limit: 100 });
  }
}

export const pillDetailSqliteDataSource = new PillDetailSqliteDataSource();
