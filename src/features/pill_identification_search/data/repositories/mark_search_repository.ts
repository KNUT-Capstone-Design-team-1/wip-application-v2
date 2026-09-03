import {
  IIdentificationSearchSqliteDataSource,
  identificationSearchSqliteDataSource,
} from '@features/pill_identification_search/data/datasources/identification_search_sqlite_datasource';
import { MarkData } from '@features/pill_identification_search/types/identification_mark_type';
import { TMarkImagesSearchParam } from '@services/database/types';

// 식별 마크 검색 리포지토리 인터페이스
export interface IMarkSearchRepository {
  getMarks(
    params: Partial<TMarkImagesSearchParam>,
    options: { page: number; limit: number },
  ): Promise<MarkData[]>;
}

// 식별 마크 검색 리포지토리 구현체
export class MarkSearchRepository implements IMarkSearchRepository {
  constructor(
    private readonly dataSource: IIdentificationSearchSqliteDataSource = identificationSearchSqliteDataSource,
  ) {}

  // 식별 마크 이미지 목록 조회
  async getMarks(
    params: Partial<TMarkImagesSearchParam>,
    options: { page: number; limit: number },
  ): Promise<MarkData[]> {
    return await this.dataSource.getMarkImages(params, options);
  }
}

// 식별 마크 검색 리포지토리 싱글톤 인스턴스
export const markSearchRepository = new MarkSearchRepository();
