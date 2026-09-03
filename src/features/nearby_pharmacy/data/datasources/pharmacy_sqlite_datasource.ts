import { getNearbyPharmacies as queryNearbyPharmacies } from '@services/database/queries/nearby_pharmacies';
import {
  INearbyPharmacies,
  TNearbyPharmaciesSearchParam,
} from '@services/database/types';

// 약국 데이터 소스 인터페이스
export interface IPharmacyDataSource {
  getNearbyPharmacies(
    params: Partial<TNearbyPharmaciesSearchParam>,
    queryOption: {
      page: number;
      limit: number;
    },
  ): Promise<INearbyPharmacies[]>;
}

// SQLite 기반 주변 약국 데이터 소스 구현체
export const pharmacySqliteDataSource: IPharmacyDataSource = {
  // SQLite DB에서 주변 약국 목록 조회
  async getNearbyPharmacies(params, queryOption) {
    const result = await queryNearbyPharmacies(params, queryOption);

    return result;
  },
};
