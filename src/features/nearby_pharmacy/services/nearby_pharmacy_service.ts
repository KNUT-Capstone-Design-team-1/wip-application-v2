import {
  INearbyPharmacyRepository,
  nearbyPharmacyRepository,
} from '@features/nearby_pharmacy/data/repositories/nearby_pharmacy_repository';
import { INearbyPharmacies } from '@services/database/types';
import { Region } from 'react-native-maps';
import {
  KM_PER_LAT_DEGREE,
  KM_PER_LON_DEGREE,
  RESEARCH_DISPLACEMENT_RATIO,
  RESEARCH_MAX_DISPLACEMENT_KM,
} from '@features/nearby_pharmacy/constants/nearby_pharmacy';
import { ICoordinate } from '@features/nearby_pharmacy/types/pharmacy_map_type';
import {
  ILastFetchedCenter,
  IPharmacySearchCoordinates,
  IPharmacySearchOptions,
} from '@features/nearby_pharmacy/types/pharmacy_domain_type';

// 주변 약국 비즈니스 로직 서비스
export class NearbyPharmacyService {
  constructor(
    private readonly pharmacyRepository: INearbyPharmacyRepository = nearbyPharmacyRepository,
  ) {}

  // 주어진 좌표(X: 경도, Y: 위도) 기준 주변 약국 목록 조회
  async searchNearbyPharmacies(
    coords: IPharmacySearchCoordinates,
    options: IPharmacySearchOptions = {},
  ): Promise<INearbyPharmacies[]> {
    return await this.pharmacyRepository.getNearbyPharmacies(
      { coordinate: coords },
      options,
    );
  }

  // 지도 이동 거리를 계산하여 '이 위치에서 재검색' 노출 여부 판별
  checkShouldResearch(
    region: Region | null,
    lastFetchedCenter: ILastFetchedCenter | null,
  ): boolean {
    const isMissingCenterOrRegion = !lastFetchedCenter || !region;

    if (isMissingCenterOrRegion) {
      return false;
    }

    const displacementKm = Math.max(
      Math.abs(region.latitude - lastFetchedCenter.lat) * KM_PER_LAT_DEGREE,
      Math.abs(region.longitude - lastFetchedCenter.lng) * KM_PER_LON_DEGREE,
    );

    const visibleHeightKm = region.latitudeDelta * KM_PER_LAT_DEGREE;

    const thresholdKm = Math.min(
      visibleHeightKm * RESEARCH_DISPLACEMENT_RATIO,
      RESEARCH_MAX_DISPLACEMENT_KM,
    );

    return displacementKm > thresholdKm;
  }

  // 약국 목록의 중심 위경도 좌표 계산
  calculateCenterCoordinate(
    pharmacies: INearbyPharmacies[],
  ): ICoordinate | null {
    const hasNoPharmacies = pharmacies.length === 0;

    if (hasNoPharmacies) {
      return null;
    }

    const coordinates: ICoordinate[] = pharmacies
      .map((p) => ({
        latitude: parseFloat(p.Y),
        longitude: parseFloat(p.X),
      }))
      .filter((coordinate) => {
        const isValidCoordinate =
          Number.isFinite(coordinate.latitude) &&
          Number.isFinite(coordinate.longitude) &&
          coordinate.latitude >= -90 &&
          coordinate.latitude <= 90 &&
          coordinate.longitude >= -180 &&
          coordinate.longitude <= 180;

        return isValidCoordinate;
      });

    const hasNoValidCoordinates = coordinates.length === 0;

    if (hasNoValidCoordinates) {
      return null;
    }

    const centerLat =
      coordinates.reduce((sum, c) => sum + c.latitude, 0) / coordinates.length;

    const centerLng =
      coordinates.reduce((sum, c) => sum + c.longitude, 0) / coordinates.length;

    return {
      latitude: centerLat,
      longitude: centerLng,
    };
  }
}

// 주변 약국 비즈니스 로직 서비스 싱글톤 인스턴스
export const nearbyPharmacyService = new NearbyPharmacyService();
