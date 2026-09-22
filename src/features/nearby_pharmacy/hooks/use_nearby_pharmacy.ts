import { useState, useCallback, useRef, useMemo } from 'react';
import * as Location from 'expo-location';
import { usePharmacyToast } from '@features/nearby_pharmacy/hooks/use_pharmacy_toast';
import { INearbyPharmacies } from '@services/database/types';
import logger from '@utils/logger';
import { useFocusEffect } from 'expo-router';
import MapView from 'react-native-maps';
import { useAppTrackStore } from '@store/app_track_store';
import {
  NEARBY_PHARMACY_RADIUS_KM,
  DEFAULT_MAP_LATITUDE,
  DEFAULT_MAP_LONGITUDE,
  DEFAULT_LATITUDE_DELTA,
  DEFAULT_LONGITUDE_DELTA,
  FALLBACK_LATITUDE_DELTA,
  FALLBACK_LONGITUDE_DELTA,
} from '@features/nearby_pharmacy/constants/nearby_pharmacy';
import { nearbyPharmacyService } from '@features/nearby_pharmacy/services/nearby_pharmacy_service';
import { locationService } from '@features/nearby_pharmacy/services/location_service';
import { pharmacyActionService } from '@features/nearby_pharmacy/services/pharmacy_action_service';
import { ICoordinate } from '@features/nearby_pharmacy/types/pharmacy_map_type';
import {
  ILastFetchedCenter,
  IPharmacySearchCoordinates,
} from '@features/nearby_pharmacy/types/pharmacy_domain_type';
import { getDistance } from '@utils/location';

// 주변 약국 지도 및 위치 기반 검색 프레젠테이션 커스텀 훅
export const useNearbyPharmacy = () => {
  const { showToast } = usePharmacyToast();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );

  const [selectedPharmacy, setSelectedPharmacy] =
    useState<INearbyPharmacies | null>(null);

  const [pharmacies, setPharmacies] = useState<INearbyPharmacies[]>([]);

  // 클러스터 탭 시 표시할 약국 목록 상태
  const [clusterPharmacies, setClusterPharmacies] = useState<
    INearbyPharmacies[] | null
  >(null);

  // 마지막으로 조회가 수행된 지도 중심 좌표 상태
  const [lastFetchedCenter, setLastFetchedCenter] =
    useState<ILastFetchedCenter | null>(null);

  const [loading, setLoading] = useState(true);
  const mapRef = useRef<MapView | null>(null);

  // 비동기 약국 검색 Race Condition 방지용 ID Ref
  const searchRequestIdRef = useRef(0);
  // 최초 진입 시 위치 초기화 완료 여부 추적
  const isInitializedRef = useRef(false);

  // 약국 정보 클립보드 복사 핸들러
  const handleCopy = useCallback(
    async (text: string) => {
      const isSuccess = await pharmacyActionService.copyText(text);
      if (isSuccess) {
        showToast({ message: '복사되었습니다.' });
      }
    },
    [showToast],
  );

  // 현재 사용자 위치로 지도 이동 핸들러
  const handleLocate = useCallback(() => {
    const hasNoLocation = !location;

    if (hasNoLocation) {
      showToast({ message: '현재 위치를 찾을 수 없습니다.' });
      return;
    }

    mapRef.current?.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: DEFAULT_LATITUDE_DELTA,
      longitudeDelta: DEFAULT_LONGITUDE_DELTA,
    });
  }, [location, showToast]);

  // 지도의 초기 영역 계산
  const initialRegion = useMemo(() => {
    if (location) {
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: DEFAULT_LATITUDE_DELTA,
        longitudeDelta: DEFAULT_LONGITUDE_DELTA,
      };
    }

    // 기본 위치 (서울시청)
    return {
      latitude: DEFAULT_MAP_LATITUDE,
      longitude: DEFAULT_MAP_LONGITUDE,
      latitudeDelta: FALLBACK_LATITUDE_DELTA,
      longitudeDelta: FALLBACK_LONGITUDE_DELTA,
    };
  }, [location]);

  // 마커 선택 시 해당 약국 선택 핸들러
  const handleMarkerPress = useCallback((pharmacy: INearbyPharmacies) => {
    setClusterPharmacies(null);
    setSelectedPharmacy(pharmacy);
    useAppTrackStore.getState().increaseSubActionCount('nearby_pharmacy');
  }, []);

  // 정보 카드 닫기 핸들러
  const handleCloseInfoCard = useCallback(() => {
    setSelectedPharmacy(null);
  }, []);

  // 클러스터 약국 목록 열기 핸들러
  const openClusterList = useCallback((list: INearbyPharmacies[]) => {
    setClusterPharmacies(list);
    setSelectedPharmacy(null);
  }, []);

  // 클러스터 약국 목록 닫기 핸들러
  const closeClusterList = useCallback(() => {
    setClusterPharmacies(null);
  }, []);

  // 클러스터 목록 내 특정 약국 선택 핸들러
  const handleClusterPharmacySelect = useCallback(
    (pharmacy: INearbyPharmacies) => {
      const lat = parseFloat(pharmacy.Y);
      const lng = parseFloat(pharmacy.X);

      setClusterPharmacies(null);
      setSelectedPharmacy(pharmacy);

      const isValidCoords =
        Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180;

      if (isValidCoords) {
        const latitudeDelta = 0.005;
        const longitudeDelta = 0.005;
        const latOffset = latitudeDelta * 0.15;

        mapRef.current?.animateToRegion(
          {
            latitude: lat - latOffset,
            longitude: lng,
            latitudeDelta,
            longitudeDelta,
          },
          400,
        );
      }

      useAppTrackStore.getState().increaseSubActionCount('nearby_pharmacy');
    },
    [],
  );

  // 주어진 좌표 기준 약국 목록 비동기 조회 (Race Condition 방어)
  const fetchPharmacies = useCallback(
    async (coords: IPharmacySearchCoordinates) => {
      const currentRequestId = ++searchRequestIdRef.current;

      try {
        setLoading(true);

        const result = await nearbyPharmacyService.searchNearbyPharmacies(
          coords,
          { page: 1, limit: 50 },
        );

        // 최신 요청이 아니면 취소
        if (currentRequestId !== searchRequestIdRef.current) {
          return;
        }

        setPharmacies(result);
        setLastFetchedCenter({ lat: coords.y, lng: coords.x });
      } catch (e) {
        if (currentRequestId === searchRequestIdRef.current) {
          logger.error(`Failed to fetch pharmacies: ${e}`);

          showToast({
            type: 'error',
            message: '약국 정보를 가져오는 데 실패했습니다.',
          });
        }
      } finally {
        if (currentRequestId === searchRequestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [showToast],
  );

  // 지도 카메라를 지정 좌표로 이동
  const centerMapOn = useCallback((coords: ICoordinate) => {
    mapRef.current?.animateToRegion(
      {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: DEFAULT_LATITUDE_DELTA,
        longitudeDelta: DEFAULT_LONGITUDE_DELTA,
      },
      300,
    );
  }, []);

  // 위치 권한 및 GPS 활성화 여부 확인
  const checkPermissionsAndServices = useCallback(async () => {
    const checkResult = await locationService.checkLocationAvailability();

    const isUnavailable = !checkResult.success;

    if (isUnavailable) {
      const isPermissionDenied = checkResult.reason === 'permission_denied';
      const isGpsDisabled = checkResult.reason === 'gps_disabled';

      if (isPermissionDenied) {
        showToast({
          type: 'default',
          message: '위치 권한이 거부되었습니다.',
        });
      } else if (isGpsDisabled) {
        showToast({
          type: 'default',
          message: '위치 서비스(GPS)가 꺼져 있습니다.',
        });
      }
      return false;
    }

    return true;
  }, [showToast]);

  // 위치 기반 서비스 초기화 (중복 조회 방지 및 단일 파이프라인)
  const initializeLocation = useCallback(async () => {
    let hasLocation = false;

    try {
      setLoading(true);

      const isAllowed = await checkPermissionsAndServices();
      const isNotAllowed = !isAllowed;

      if (isNotAllowed) {
        setLoading(false);
        return;
      }

      // 1. 마지막 위치 확인 및 즉시 지도/데이터 렌더링
      const lastLocation = await locationService.getLastKnownLocation();
      let activeCoords: ICoordinate | null = null;

      if (lastLocation) {
        setLocation(lastLocation);
        centerMapOn(lastLocation.coords);
        hasLocation = true;
        activeCoords = lastLocation.coords;

        // 캐시 위치 기준 즉시 1차 검색 실행
        await fetchPharmacies({
          x: lastLocation.coords.longitude,
          y: lastLocation.coords.latitude,
        });
      }

      // 2. 캐시된 위치가 5분 이내로 신선하다면 무거운 GPS 재조회 생략
      if (lastLocation && locationService.isLocationFresh(lastLocation)) {
        setLoading(false);
        return;
      }

      // 3. 최신 GPS 탐색 (타임아웃 단축 적용)
      const currentLocation =
        await locationService.getCurrentPositionWithFallback();

      if (currentLocation) {
        setLocation(currentLocation);
        hasLocation = true;

        // 이전 캐시 위치와 100m 이상 유의미한 차이가 있을 때만 재검색
        const shouldRefresh =
          !activeCoords ||
          getDistance(
            activeCoords.latitude,
            activeCoords.longitude,
            currentLocation.coords.latitude,
            currentLocation.coords.longitude,
          ) > 100;

        if (shouldRefresh) {
          centerMapOn(currentLocation.coords);
          await fetchPharmacies({
            x: currentLocation.coords.longitude,
            y: currentLocation.coords.latitude,
          });
        }
      }
    } catch (e) {
      logger.error(`Failed to initialize location: ${e}`);

      if (!hasLocation) {
        showToast({
          type: 'error',
          message: '위치 확인에 실패했습니다.\n다시 시도해 주세요.',
        });
      }
    } finally {
      setLoading(false);
    }
  }, [checkPermissionsAndServices, centerMapOn, fetchPharmacies, showToast]);

  // 화면 진입 시 1회만 자동 초기화, 탭 복귀 시 불필요한 GPS/DB 재조회 방지
  useFocusEffect(
    useCallback(() => {
      if (!isInitializedRef.current) {
        isInitializedRef.current = true;
        initializeLocation();
        showToast({
          message: `${NEARBY_PHARMACY_RADIUS_KM}km 이내 약국만 표시됩니다`,
        });
      }
    }, [initializeLocation, showToast]),
  );

  return {
    mapRef,
    initialRegion,
    location,
    pharmacies,
    loading,
    selectedPharmacy,
    clusterPharmacies,
    handleLocate,
    handleCopy,
    handleMarkerPress,
    handleCloseInfoCard,
    openClusterList,
    closeClusterList,
    handleClusterPharmacySelect,
    fetchPharmacies,
    lastFetchedCenter,
    refreshLocation: initializeLocation,
  };
};
