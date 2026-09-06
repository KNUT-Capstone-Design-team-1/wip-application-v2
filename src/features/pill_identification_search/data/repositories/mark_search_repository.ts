import { identificationSearchSqliteDataSource } from '@features/pill_identification_search/data/datasources/identification_search_sqlite_datasource';
import { MarkData } from '@features/pill_identification_search/types/identification_mark_type';
import { TMarkImagesSearchParam } from '@services/database/types';

// 식별 마크 검색 리포지토리
export const markSearchRepository = {
  // 식별 마크 이미지 목록 조회
  async getMarks(
    params: Partial<TMarkImagesSearchParam>,
    options: { page: number; limit: number },
  ): Promise<MarkData[]> {
    return await identificationSearchSqliteDataSource.getMarkImages(
      params,
      options,
    );
  },
};
