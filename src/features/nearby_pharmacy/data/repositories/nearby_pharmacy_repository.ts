import { pharmacySqliteDataSource } from '@features/nearby_pharmacy/data/datasources/pharmacy_sqlite_datasource';
import {
  INearbyPharmacies,
  TNearbyPharmaciesSearchParam,
} from '@services/database/types';
import { IPharmacySearchOptions } from '@features/nearby_pharmacy/types/pharmacy_domain_type';

// 주변 약국 데이터 저장소 접근
export const nearbyPharmacyRepository = {
  // 주변 약국 목록 조회
  async getNearbyPharmacies(
    params: Partial<TNearbyPharmaciesSearchParam>,
    queryOption: IPharmacySearchOptions = {},
  ): Promise<INearbyPharmacies[]> {
    const page = queryOption.page ?? 1;
    const limit = queryOption.limit ?? 50;

    return await pharmacySqliteDataSource.getNearbyPharmacies(params, {
      page,
      limit,
    });
  },
};
