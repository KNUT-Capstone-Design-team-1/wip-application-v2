import * as Location from 'expo-location';
import { locationRepository } from '@features/nearby_pharmacy/data/repositories/location_repository';
import logger from '@utils/logger';

// 위치 가용성 검증 결과 타입
export type TLocationCheckResult =
  | { success: true }
  | { success: false; reason: 'permission_denied' | 'gps_disabled' };

// 위치 관련 비즈니스 로직 서비스
export const locationService = {
  // 위치 권한 및 GPS 활성화 여부 확인
  async checkLocationAvailability(): Promise<TLocationCheckResult> {
    const { status } = await locationRepository.requestForegroundPermissions();
    const isPermissionDenied = status !== 'granted';

    if (isPermissionDenied) {
      return { success: false, reason: 'permission_denied' };
    }

    const enabled = await locationRepository.hasServicesEnabled();
    const isGpsDisabled = !enabled;

    if (isGpsDisabled) {
      return { success: false, reason: 'gps_disabled' };
    }

    return { success: true };
  },

  // 타임아웃 및 정밀도 Fallback을 적용한 현재 위치 조회
  async getCurrentPositionWithFallback(
    timeoutMs: number = 60 * 1000,
  ): Promise<Location.LocationObject | null> {
    const withTimeout = (accuracy: Location.Accuracy) =>
      Promise.race([
        locationRepository.getCurrentPosition({ accuracy }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Location timeout')), timeoutMs),
        ),
      ]);

    try {
      return await withTimeout(Location.Accuracy.Balanced);
    } catch (e) {
      logger.warn(`Balanced accuracy failed, retrying with Low: ${e}`);
      try {
        return await withTimeout(Location.Accuracy.Low);
      } catch (lowError) {
        logger.error(`Failed to get position with Low accuracy: ${lowError}`);
        return null;
      }
    }
  },

  // 마지막 알려진 위치를 안전하게 조회
  async getLastKnownPositionSafely(): Promise<Location.LocationObject | null> {
    try {
      return await locationRepository.getLastKnownPosition();
    } catch {
      return null;
    }
  },

  // 호환성 별칭
  async getLastKnownLocation(): Promise<Location.LocationObject | null> {
    return this.getLastKnownPositionSafely();
  },
};
