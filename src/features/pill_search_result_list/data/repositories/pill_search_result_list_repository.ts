import {
  IMarkImages,
  IPillData,
  TMarkImagesSearchParam,
  TPillDataSearchParam,
} from '@services/database/types';
import { pillSearchResultListSqliteDataSource } from '../datasources/pill_search_result_list_sqlite_datasource';

export const pillSearchResultListRepository = {
  // 검색 결과 페이지를 저장소에서 조회한다.
  getPills(
    params: Partial<TPillDataSearchParam>,
    options: { page: number; limit: number },
  ): Promise<IPillData[]> {
    return pillSearchResultListSqliteDataSource.getPills(params, options);
  },

  // 검색 결과 개수를 저장소에서 조회한다.
  countPills(params: Partial<TPillDataSearchParam>): Promise<number> {
    return pillSearchResultListSqliteDataSource.countPills(params);
  },

  // 마크 이미지를 저장소에서 조회한다.
  getMarkImages(
    params: Partial<TMarkImagesSearchParam>,
    options: { page: number; limit: number },
  ): Promise<IMarkImages[]> {
    return pillSearchResultListSqliteDataSource.getMarkImages(params, options);
  },
};
