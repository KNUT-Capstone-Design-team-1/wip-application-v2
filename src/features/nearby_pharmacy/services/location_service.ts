import * as Location from 'expo-location';
import { locationRepository } from '@features/nearby_pharmacy/data/repositories/location_repository';
import logger from '@utils/logger';
import {
  BALANCED_TIMEOUT_MS,
  LOW_TIMEOUT_MS,
  LOCATION_CACHE_MAX_AGE_MS,
} from '@features/nearby_pharmacy/constants/location';
import { TLocationCheckResult } from '@features/nearby_pharmacy/types/location_type';

// 위치 관련 비즈니스 로직 서비스
export const locationService = {
  // 위치 권한 및 GPS 활성화 여부 확인
  async checkLocationAvailability(): Promise<TLocationCheckResult> {
    const { status } = await locationRepository.requestForegroundPermissions();

    const isPermissionDenied = status !== 'granted';

    // 위치 권한이 거부된 경우 early return
    if (isPermissionDenied) {
      return {
        success: false,
        reason: 'permission_denied',
      };
    }

    const enabled = await locationRepository.hasServicesEnabled();

    const isGpsDisabled = !enabled;

    // GPS 하드웨어가 꺼져있는 경우 early return
    if (isGpsDisabled) {
      return {
        success: false,
        reason: 'gps_disabled',
      };
    }

    return {
      success: true,
    };
  },

  // 특정 정확도와 타임아웃으로 위치를 단일 조회하는 헬퍼 함수
  async fetchPositionWithAccuracy(
    accuracy: Location.Accuracy,
    timeoutMs: number,
  ): Promise<Location.LocationObject | null> {
    try {
      const position = await Promise.race([
        locationRepository.getCurrentPosition({ accuracy }),
        new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error('Location timeout'));
          }, timeoutMs);
        }),
      ]);

      return position;
    } catch {
      return null;
    }
  },

  // 타임아웃 및 정밀도 Fallback을 적용한 현재 위치 조회 (총 최대 10초 이내)
  async getCurrentPositionWithFallback(
    balancedTimeoutMs: number = BALANCED_TIMEOUT_MS,
    lowTimeoutMs: number = LOW_TIMEOUT_MS,
  ): Promise<Location.LocationObject | null> {
    // 1. Balanced 정밀도 우선 조회
    const balancedPosition = await this.fetchPositionWithAccuracy(
      Location.Accuracy.Balanced,
      balancedTimeoutMs,
    );

    if (balancedPosition) {
      return balancedPosition;
    }

    logger.warn('Balanced accuracy failed, retrying with Low accuracy');

    // 2. Low 정밀도로 2차 Fallback 조회
    const lowPosition = await this.fetchPositionWithAccuracy(
      Location.Accuracy.Low,
      lowTimeoutMs,
    );

    if (lowPosition) {
      return lowPosition;
    }

    logger.error('Failed to get position with Low accuracy');

    return null;
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
    maxAgeMs: number = LOCATION_CACHE_MAX_AGE_MS,
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
