import * as Location from 'expo-location';

// 위치 데이터 소스 인터페이스
export interface ILocationDataSource {
  requestForegroundPermissions(): Promise<Location.PermissionResponse>;
  hasServicesEnabled(): Promise<boolean>;
  getLastKnownPosition(): Promise<Location.LocationObject | null>;
  getCurrentPosition(
    options?: Location.LocationOptions,
  ): Promise<Location.LocationObject>;
}

// Expo Location 기반 위치 데이터 소스 구현체
export const locationExpoDataSource: ILocationDataSource = {
  // 위치 권한 요청
  async requestForegroundPermissions() {
    return await Location.requestForegroundPermissionsAsync();
  },
  // GPS 위치 서비스 활성화 여부 확인
  async hasServicesEnabled() {
    return await Location.hasServicesEnabledAsync();
  },
  // 마지막으로 확인된 위치 조회
  async getLastKnownPosition() {
    return await Location.getLastKnownPositionAsync();
  },
  // 현재 위치 조회
  async getCurrentPosition(options) {
    return await Location.getCurrentPositionAsync(options);
  },
};
