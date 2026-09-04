import {
  TMarkImagesSearchParam,
  TPillDataSearchParam,
} from '@services/database/types';
import {
  IPillSearchResultListRepository,
  pillSearchResultListRepository,
} from '../data/repositories/pill_search_result_list_repository';

export class PillSearchResultListService {
  constructor(
    private readonly repository: IPillSearchResultListRepository = pillSearchResultListRepository,
  ) {}

  // 검색 결과 페이지를 조회한다.
  getPills(
    params: Partial<TPillDataSearchParam>,
    options: { page: number; limit: number },
  ) {
    return this.repository.getPills(params, options);
  }

  // 검색 결과 전체 개수를 조회한다.
  countPills(params: Partial<TPillDataSearchParam>) {
    return this.repository.countPills(params);
  }

  // 검색 조건에 포함된 마크 이미지를 조회한다.
  getMarkImages(
    params: Partial<TMarkImagesSearchParam>,
    options: { page: number; limit: number },
  ) {
    return this.repository.getMarkImages(params, options);
  }
}

export const pillSearchResultListService = new PillSearchResultListService();
