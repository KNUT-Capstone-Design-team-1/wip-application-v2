import * as Location from 'expo-location';
import { locationRepository } from '@features/nearby_pharmacy/data/repositories/location_repository';
import logger from '@utils/logger';

// 위치 가용성 검증 결과 타입
export type TLocationCheckResult =
  | { success: true }
  | { success: false; reason: 'permission_denied' | 'gps_disabled' };

// 위치 관련 비즈니스 로직 서비스
const BALANCED_TIMEOUT_MS = 6000; // 6초
const LOW_TIMEOUT_MS = 4000; // 4초
const CACHE_MAX_AGE_MS = 5 * 60 * 1000; // 5분

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

  // 타임아웃 및 정밀도 Fallback을 적용한 현재 위치 조회 (총 최대 10초 이내)
  async getCurrentPositionWithFallback(
    balancedTimeoutMs: number = BALANCED_TIMEOUT_MS,
    lowTimeoutMs: number = LOW_TIMEOUT_MS,
  ): Promise<Location.LocationObject | null> {
    const withTimeout = (accuracy: Location.Accuracy, timeoutMs: number) =>
      Promise.race([
        locationRepository.getCurrentPosition({ accuracy }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Location timeout')), timeoutMs),
        ),
      ]);

    try {
      return await withTimeout(Location.Accuracy.Balanced, balancedTimeoutMs);
    } catch (e) {
      logger.warn(`Balanced accuracy failed, retrying with Low: ${e}`);
      try {
        return await withTimeout(Location.Accuracy.Low, lowTimeoutMs);
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

  // 캐시된 위치가 지정 시간(기본 5분) 이내인지 확인
  isLocationFresh(
    location: Location.LocationObject | null,
    maxAgeMs: number = CACHE_MAX_AGE_MS,
  ): boolean {
    if (!location) {
      return false;
    }
    const age = Date.now() - location.timestamp;
    return age >= 0 && age < maxAgeMs;
  },

  // 호환성 별칭
  async getLastKnownLocation(): Promise<Location.LocationObject | null> {
    return this.getLastKnownPositionSafely();
  },
};
