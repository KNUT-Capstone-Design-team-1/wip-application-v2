import {
  IPharmacyDataSource,
  pharmacySqliteDataSource,
} from '@features/nearby_pharmacy/data/datasources/pharmacy_sqlite_datasource';
import {
  INearbyPharmacies,
  TNearbyPharmaciesSearchParam,
} from '@services/database/types';
import { IPharmacySearchOptions } from '@features/nearby_pharmacy/types/pharmacy_domain_type';

// 주변 약국 리포지토리 인터페이스
export interface INearbyPharmacyRepository {
  getNearbyPharmacies(
    params: Partial<TNearbyPharmaciesSearchParam>,
    queryOption?: IPharmacySearchOptions,
  ): Promise<INearbyPharmacies[]>;
}

// 주변 약국 데이터 저장소 접근 구현체
export class NearbyPharmacyRepository implements INearbyPharmacyRepository {
  constructor(
    private readonly dataSource: IPharmacyDataSource = pharmacySqliteDataSource,
  ) {}

  // 주변 약국 목록 조회
  async getNearbyPharmacies(
    params: Partial<TNearbyPharmaciesSearchParam>,
    queryOption: IPharmacySearchOptions = {},
  ): Promise<INearbyPharmacies[]> {
    const page = queryOption.page ?? 1;
    const limit = queryOption.limit ?? 50;

    return await this.dataSource.getNearbyPharmacies(params, { page, limit });
  }
}

// 주변 약국 리포지토리 싱글톤 인스턴스
export const nearbyPharmacyRepository = new NearbyPharmacyRepository();
