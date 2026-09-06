import * as Location from 'expo-location';
import { locationExpoDataSource } from '@features/nearby_pharmacy/data/datasources/location_expo_datasource';

// 위치 데이터 저장소 접근
export const locationRepository = {
  // 위치 권한 요청
  async requestForegroundPermissions(): Promise<Location.PermissionResponse> {
    return await locationExpoDataSource.requestForegroundPermissions();
  },

  // GPS 위치 서비스 활성화 여부 확인
  async hasServicesEnabled(): Promise<boolean> {
    return await locationExpoDataSource.hasServicesEnabled();
  },

  // 마지막 위치 조회
  async getLastKnownPosition(): Promise<Location.LocationObject | null> {
    return await locationExpoDataSource.getLastKnownPosition();
  },

  // 현재 위치 조회
  async getCurrentPosition(
    options?: Location.LocationOptions,
  ): Promise<Location.LocationObject> {
    return await locationExpoDataSource.getCurrentPosition(options);
  },
};
