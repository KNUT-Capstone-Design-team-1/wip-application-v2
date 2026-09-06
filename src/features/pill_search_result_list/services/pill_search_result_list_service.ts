import {
  IMarkImages,
  IPillData,
  TMarkImagesSearchParam,
  TPillDataSearchParam,
} from '@services/database/types';
import { pillSearchResultListRepository } from '../data/repositories/pill_search_result_list_repository';

export const pillSearchResultListService = {
  // 검색 결과 페이지를 조회한다.
  getPills(
    params: Partial<TPillDataSearchParam>,
    options: { page: number; limit: number },
  ): Promise<IPillData[]> {
    return pillSearchResultListRepository.getPills(params, options);
  },

  // 검색 결과 전체 개수를 조회한다.
  countPills(params: Partial<TPillDataSearchParam>): Promise<number> {
    return pillSearchResultListRepository.countPills(params);
  },

  // 검색 조건에 포함된 마크 이미지를 조회한다.
  getMarkImages(
    params: Partial<TMarkImagesSearchParam>,
    options: { page: number; limit: number },
  ): Promise<IMarkImages[]> {
    return pillSearchResultListRepository.getMarkImages(params, options);
  },
};
