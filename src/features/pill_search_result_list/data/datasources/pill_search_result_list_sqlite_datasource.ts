import {
  getPillDataCount as queryPillDataCount,
  getPillDatas as queryPillDatas,
} from '@services/database/queries/pill_data';
import { getMarkImages as queryMarkImages } from '@services/database/queries/mark_images';
import {
  IMarkImages,
  IPillData,
  TMarkImagesSearchParam,
  TPillDataSearchParam,
} from '@services/database/types';

export const pillSearchResultListSqliteDataSource = {
  // 검색 결과 페이지를 조회한다.
  getPills(
    params: Partial<TPillDataSearchParam>,
    options: { page: number; limit: number },
  ): Promise<IPillData[]> {
    return queryPillDatas(params, options);
  },

  // 검색 결과 전체 개수를 조회한다.
  countPills(params: Partial<TPillDataSearchParam>): Promise<number> {
    return queryPillDataCount(params);
  },

  // 검색 조건에 포함된 마크 이미지를 조회한다.
  getMarkImages(
    params: Partial<TMarkImagesSearchParam>,
    options: { page: number; limit: number },
  ): Promise<IMarkImages[]> {
    return queryMarkImages(params, options);
  },
};
