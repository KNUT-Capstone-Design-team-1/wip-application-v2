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

export interface IPillSearchResultListSqliteDataSource {
  getPills(
    params: Partial<TPillDataSearchParam>,
    options: { page: number; limit: number },
  ): Promise<IPillData[]>;
  countPills(params: Partial<TPillDataSearchParam>): Promise<number>;
  getMarkImages(
    params: Partial<TMarkImagesSearchParam>,
    options: { page: number; limit: number },
  ): Promise<IMarkImages[]>;
}

export class PillSearchResultListSqliteDataSource implements IPillSearchResultListSqliteDataSource {
  // 검색 결과 페이지를 조회한다.
  getPills(
    params: Partial<TPillDataSearchParam>,
    options: { page: number; limit: number },
  ) {
    return queryPillDatas(params, options);
  }

  // 검색 결과 전체 개수를 조회한다.
  countPills(params: Partial<TPillDataSearchParam>) {
    return queryPillDataCount(params);
  }

  // 검색 조건에 포함된 마크 이미지를 조회한다.
  getMarkImages(
    params: Partial<TMarkImagesSearchParam>,
    options: { page: number; limit: number },
  ) {
    return queryMarkImages(params, options);
  }
}

export const pillSearchResultListSqliteDataSource =
  new PillSearchResultListSqliteDataSource();
