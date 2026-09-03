import * as Location from 'expo-location';
import {
  ILocationDataSource,
  locationExpoDataSource,
} from '@features/nearby_pharmacy/data/datasources/location_expo_datasource';

// 위치 리포지토리 인터페이스
export interface ILocationRepository {
  requestForegroundPermissions(): Promise<Location.PermissionResponse>;
  hasServicesEnabled(): Promise<boolean>;
  getLastKnownPosition(): Promise<Location.LocationObject | null>;
  getCurrentPosition(
    options?: Location.LocationOptions,
  ): Promise<Location.LocationObject>;
}

// 위치 데이터 저장소 접근 구현체
export class LocationRepository implements ILocationRepository {
  constructor(
    private readonly dataSource: ILocationDataSource = locationExpoDataSource,
  ) {}

  // 위치 권한 요청
  async requestForegroundPermissions(): Promise<Location.PermissionResponse> {
    return await this.dataSource.requestForegroundPermissions();
  }

  // GPS 위치 서비스 활성화 여부 확인
  async hasServicesEnabled(): Promise<boolean> {
    return await this.dataSource.hasServicesEnabled();
  }

  // 마지막 위치 조회
  async getLastKnownPosition(): Promise<Location.LocationObject | null> {
    return await this.dataSource.getLastKnownPosition();
  }

  // 현재 위치 조회
  async getCurrentPosition(
    options?: Location.LocationOptions,
  ): Promise<Location.LocationObject> {
    return await this.dataSource.getCurrentPosition(options);
  }
}

// 위치 리포지토리 싱글톤 인스턴스
export const locationRepository = new LocationRepository();
