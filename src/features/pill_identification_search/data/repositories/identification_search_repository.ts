import {
  IIdentificationSearchSqliteDataSource,
  identificationSearchSqliteDataSource,
} from '@features/pill_identification_search/data/datasources/identification_search_sqlite_datasource';
import { IPillData, TPillDataSearchParam } from '@services/database/types';
import { IPillSearchQueryOption } from '@features/pill_identification_search/types/identification_domain_type';

// 식별 검색 리포지토리 인터페이스
export interface IIdentificationSearchRepository {
  searchPills(
    params: Partial<TPillDataSearchParam>,
    options: IPillSearchQueryOption,
  ): Promise<IPillData[]>;

  countPills(params: Partial<TPillDataSearchParam>): Promise<number>;
}

// 식별 검색 리포지토리 구현체
export class IdentificationSearchRepository implements IIdentificationSearchRepository {
  constructor(
    private readonly dataSource: IIdentificationSearchSqliteDataSource = identificationSearchSqliteDataSource,
  ) {}

  // 알약 식별 검색 조회
  async searchPills(
    params: Partial<TPillDataSearchParam>,
    options: IPillSearchQueryOption,
  ): Promise<IPillData[]> {
    return await this.dataSource.getPillDatas(params, options);
  }

  // 알약 식별 검색 총 개수 조회
  async countPills(params: Partial<TPillDataSearchParam>): Promise<number> {
    return await this.dataSource.getPillDataCount(params);
  }
}

// 식별 검색 리포지토리 싱글톤 인스턴스
export const identificationSearchRepository =
  new IdentificationSearchRepository();
