import * as Location from 'expo-location';

// Expo Location 기반 위치 데이터 소스 구현체
export const locationExpoDataSource = {
  // 위치 권한 요청
  async requestForegroundPermissions(): Promise<Location.PermissionResponse> {
    return await Location.requestForegroundPermissionsAsync();
  },
  // GPS 위치 서비스 활성화 여부 확인
  async hasServicesEnabled(): Promise<boolean> {
    return await Location.hasServicesEnabledAsync();
  },
  // 마지막으로 확인된 위치 조회
  async getLastKnownPosition(): Promise<Location.LocationObject | null> {
    return await Location.getLastKnownPositionAsync();
  },
  // 현재 위치 조회
  async getCurrentPosition(
    options?: Location.LocationOptions,
  ): Promise<Location.LocationObject> {
    return await Location.getCurrentPositionAsync(options);
  },
};
