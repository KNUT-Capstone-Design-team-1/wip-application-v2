import {
  getPillDatas as queryPillDatas,
  getPillDataCount as queryPillDataCount,
} from '@services/database/queries/pill_data';
import { getMarkImages as queryMarkImages } from '@services/database/queries/mark_images';
import {
  IPillData,
  TPillDataSearchParam,
  TMarkImagesSearchParam,
} from '@services/database/types';
import { IPillSearchQueryOption } from '@features/pill_identification_search/types/identification_domain_type';
import { MarkData } from '@features/pill_identification_search/types/identification_mark_type';
import logger from '@utils/logger';

// 식별 검색 데이터소스 에러 로깅 헬퍼 함수
const logDataSourceError = (operation: string, error: unknown) => {
  logger.error(
    `[IDENTIFICATION-SEARCH-SQLITE-DATASOURCE] Failed to ${operation}: ${error}`,
  );
};

// 식별 검색 SQLite 데이터 소스 인터페이스
export interface IIdentificationSearchSqliteDataSource {
  getPillDatas(
    params: Partial<TPillDataSearchParam>,
    options: IPillSearchQueryOption,
  ): Promise<IPillData[]>;

  getPillDataCount(params: Partial<TPillDataSearchParam>): Promise<number>;

  getMarkImages(
    params: Partial<TMarkImagesSearchParam>,
    options: { page: number; limit: number },
  ): Promise<MarkData[]>;
}

// SQLite 기반 식별 검색 데이터 소스 구현체
export const identificationSearchSqliteDataSource: IIdentificationSearchSqliteDataSource =
  {
    // 알약 식별 검색 데이터 목록 조회
    async getPillDatas(
      params: Partial<TPillDataSearchParam>,
      options: IPillSearchQueryOption,
    ): Promise<IPillData[]> {
      try {
        return await queryPillDatas(params, options);
      } catch (e) {
        logDataSourceError('getPillDatas', e);
        return [];
      }
    },

    // 검색 조건에 매칭되는 전체 알약 수 카운트 조회
    async getPillDataCount(
      params: Partial<TPillDataSearchParam>,
    ): Promise<number> {
      try {
        return await queryPillDataCount(params);
      } catch (e) {
        logDataSourceError('getPillDataCount', e);
        return 0;
      }
    },

    // 식별 마크 이미지 목록 조회
    async getMarkImages(
      params: Partial<TMarkImagesSearchParam>,
      options: { page: number; limit: number },
    ): Promise<MarkData[]> {
      try {
        return await queryMarkImages(params, options);
      } catch (e) {
        logDataSourceError('getMarkImages', e);
        return [];
      }
    },
  };
