import { useState, useCallback, useRef, useMemo } from 'react';
import * as Location from 'expo-location';
import MapView, { Region } from 'react-native-maps';
import { usePharmacyToast } from '@features/nearby_pharmacy/hooks/use_pharmacy_toast';
import { locationService } from '@features/nearby_pharmacy/services/location_service';
import { ICoordinate } from '@features/nearby_pharmacy/types/pharmacy_map_type';
import { IPharmacySearchCoordinates } from '@features/nearby_pharmacy/types/pharmacy_domain_type';
import { IUsePharmacyLocationReturn } from '@features/nearby_pharmacy/types/nearby_pharmacy_hook_type';
import { getDistance } from '@utils/location';
import logger from '@utils/logger';
import {
  DEFAULT_MAP_LATITUDE,
  DEFAULT_MAP_LONGITUDE,
  DEFAULT_LATITUDE_DELTA,
  DEFAULT_LONGITUDE_DELTA,
  FALLBACK_LATITUDE_DELTA,
  FALLBACK_LONGITUDE_DELTA,
} from '@features/nearby_pharmacy/constants/nearby_pharmacy';
import {
  LOCATION_REFRESH_MIN_DISTANCE_M,
  MAP_CAMERA_ANIMATE_DURATION_MS,
} from '@features/nearby_pharmacy/constants/location';

// 지도 및 사용자 위치 제어를 전담하는 커스텀 훅
export const usePharmacyLocation = (
  onLocationResolved: (coords: IPharmacySearchCoordinates) => Promise<void>,
): IUsePharmacyLocationReturn => {
  // 토스트 메시지 훅
  const { showToast } = usePharmacyToast();

  // 지도 컴포넌트 인스턴스 참조
  const mapRef = useRef<MapView | null>(null);

  // 사용자 현재 위치 상태
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );

  // 지도 초기 렌더링 영역 계산
  const initialRegion = useMemo<Region>(() => {
    // 사용자 위치가 존재하는 경우
    if (location) {
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: DEFAULT_LATITUDE_DELTA,
        longitudeDelta: DEFAULT_LONGITUDE_DELTA,
      };
    }

    // 기본 대체 위치 (서울시청) 반환
    return {
      latitude: DEFAULT_MAP_LATITUDE,
      longitude: DEFAULT_MAP_LONGITUDE,
      latitudeDelta: FALLBACK_LATITUDE_DELTA,
      longitudeDelta: FALLBACK_LONGITUDE_DELTA,
    };
  }, [location]);

  // 지도 카메라를 지정 좌표로 이동
  const centerMapOn = useCallback((coords: ICoordinate) => {
    mapRef.current?.animateToRegion(
      {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: DEFAULT_LATITUDE_DELTA,
        longitudeDelta: DEFAULT_LONGITUDE_DELTA,
      },
      MAP_CAMERA_ANIMATE_DURATION_MS,
    );
  }, []);

  // 현재 사용자 위치로 지도 카메라 이동 핸들러
  const handleLocate = useCallback(() => {
    // 위치 정보가 없는 경우 early return
    if (!location) {
      showToast({
        message: '현재 위치를 찾을 수 없습니다.',
      });

      return;
    }

    centerMapOn(location.coords);
  }, [location, centerMapOn, showToast]);

  // 권한 실패 안내 토스트 분기 표시
  const notifyPermissionFailure = useCallback(
    (reason: 'permission_denied' | 'gps_disabled') => {
      if (reason === 'permission_denied') {
        showToast({
          type: 'default',
          message: '위치 권한이 거부되었습니다.',
        });

        return;
      }

      if (reason === 'gps_disabled') {
        showToast({
          type: 'default',
          message: '위치 서비스(GPS)가 꺼져 있습니다.',
        });

        return;
      }
    },
    [showToast],
  );

  // 위치 권한 및 GPS 활성화 여부 확인
  const checkPermissionsAndServices =
    useCallback(async (): Promise<boolean> => {
      const checkResult = await locationService.checkLocationAvailability();

      // 권한 또는 GPS가 비활성화된 경우 early return
      if (!checkResult.success) {
        notifyPermissionFailure(checkResult.reason);

        return false;
      }

      return true;
    }, [notifyPermissionFailure]);

  // 1. 캐시된 마지막 위치 조회 및 초기 화면 반영
  const applyCachedLocation =
    useCallback(async (): Promise<Location.LocationObject | null> => {
      const lastLocation = await locationService.getLastKnownLocation();

      // 캐시 위치가 없으면 early return
      if (!lastLocation) {
        return null;
      }

      setLocation(lastLocation);

      centerMapOn(lastLocation.coords);

      // 캐시 위치 기준 즉시 1차 약국 검색
      await onLocationResolved({
        x: lastLocation.coords.longitude,
        y: lastLocation.coords.latitude,
      });

      return lastLocation;
    }, [centerMapOn, onLocationResolved]);

  // 2. 최신 GPS 위치 탐색 및 유의미한 이동 시 재검색
  const applyFreshGpsLocation = useCallback(
    async (previousCoords: ICoordinate | null): Promise<boolean> => {
      const currentLocation =
        await locationService.getCurrentPositionWithFallback();

      // GPS 조회 실패 시 early return
      if (!currentLocation) {
        return false;
      }

      setLocation(currentLocation);

      // 이전 좌표와 비교하여 100m 이상 이동했는지 검사
      const hasSignificantMovement =
        !previousCoords ||
        getDistance(
          previousCoords.latitude,
          previousCoords.longitude,
          currentLocation.coords.latitude,
          currentLocation.coords.longitude,
        ) > LOCATION_REFRESH_MIN_DISTANCE_M;

      // 이동 거리가 기준치 미만이면 검색 생략 early return
      if (!hasSignificantMovement) {
        return true;
      }

      centerMapOn(currentLocation.coords);

      await onLocationResolved({
        x: currentLocation.coords.longitude,
        y: currentLocation.coords.latitude,
      });

      return true;
    },
    [centerMapOn, onLocationResolved],
  );

  // 위치 기반 서비스 초기화 파이프라인 (평탄화된 메인 흐름)
  const initializeLocation = useCallback(async () => {
    try {
      // 1. 권한 검사
      const isAllowed = await checkPermissionsAndServices();

      if (!isAllowed) {
        return;
      }

      // 2. 캐시된 위치 우선 적용
      const cachedLocation = await applyCachedLocation();

      // 3. 캐시가 5분 이내로 신선하면 GPS 추가 조회 없이 종료
      const isFresh = locationService.isLocationFresh(cachedLocation);

      if (isFresh) {
        return;
      }

      // 4. 최신 GPS 탐색
      const previousCoords = cachedLocation ? cachedLocation.coords : null;

      const gpsResolved = await applyFreshGpsLocation(previousCoords);

      // 캐시도 없고 GPS도 모두 실패한 경우 에러 안내
      if (!cachedLocation && !gpsResolved) {
        showToast({
          type: 'error',
          message: '위치 확인에 실패했습니다.\n다시 시도해 주세요.',
        });
      }
    } catch (e) {
      logger.error(`Failed to initialize location: ${e}`);

      showToast({
        type: 'error',
        message: '위치 확인에 실패했습니다.\n다시 시도해 주세요.',
      });
    }
  }, [
    checkPermissionsAndServices,
    applyCachedLocation,
    applyFreshGpsLocation,
    showToast,
  ]);

  return {
    location,
    initialRegion,
    mapRef,
    handleLocate,
    centerMapOn,
    initializeLocation,
  };
};
