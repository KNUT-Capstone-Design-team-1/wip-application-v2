import {
  IMarkImages,
  IPillData,
  TMarkImagesSearchParam,
  TPillDataSearchParam,
} from '@services/database/types';
import {
  IPillSearchResultListSqliteDataSource,
  pillSearchResultListSqliteDataSource,
} from '../datasources/pill_search_result_list_sqlite_datasource';

export interface IPillSearchResultListRepository {
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

export class PillSearchResultListRepository implements IPillSearchResultListRepository {
  constructor(
    private readonly dataSource: IPillSearchResultListSqliteDataSource = pillSearchResultListSqliteDataSource,
  ) {}

  // 검색 결과 페이지를 저장소에서 조회한다.
  getPills(
    params: Partial<TPillDataSearchParam>,
    options: { page: number; limit: number },
  ) {
    return this.dataSource.getPills(params, options);
  }

  // 검색 결과 개수를 저장소에서 조회한다.
  countPills(params: Partial<TPillDataSearchParam>) {
    return this.dataSource.countPills(params);
  }

  // 마크 이미지를 저장소에서 조회한다.
  getMarkImages(
    params: Partial<TMarkImagesSearchParam>,
    options: { page: number; limit: number },
  ) {
    return this.dataSource.getMarkImages(params, options);
  }
}

export const pillSearchResultListRepository =
  new PillSearchResultListRepository();
