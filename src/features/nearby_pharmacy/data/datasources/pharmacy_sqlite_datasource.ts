import { getNearbyPharmacies as queryNearbyPharmacies } from '@services/database/queries/nearby_pharmacies';
import {
  INearbyPharmacies,
  TNearbyPharmaciesSearchParam,
} from '@services/database/types';

// SQLite 기반 주변 약국 데이터 소스 구현체
export const pharmacySqliteDataSource = {
  // SQLite DB에서 주변 약국 목록 조회
  async getNearbyPharmacies(
    params: Partial<TNearbyPharmaciesSearchParam>,
    queryOption: {
      page: number;
      limit: number;
    },
  ): Promise<INearbyPharmacies[]> {
    return await queryNearbyPharmacies(params, queryOption);
  },
};
