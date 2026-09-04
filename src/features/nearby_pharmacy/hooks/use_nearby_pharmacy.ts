import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import * as Location from 'expo-location';
import { useToast } from '@hooks/use_toast';
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

// 주변 약국 지도 및 위치 기반 검색 프레젠테이션 커스텀 훅
export const useNearbyPharmacy = () => {
  const { showToast } = useToast();
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
    const hasLocation = Boolean(location);

    const canUseLocation = hasLocation && Boolean(location);

    if (canUseLocation) {
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

  // 주어진 좌표 기준 약국 목록 비동기 조회
  const fetchPharmacies = useCallback(
    async (coords: IPharmacySearchCoordinates) => {
      try {
        setLoading(true);

        const result = await nearbyPharmacyService.searchNearbyPharmacies(
          coords,
          { page: 1, limit: 50 },
        );

        setPharmacies(result);
        setLastFetchedCenter({ lat: coords.y, lng: coords.x });
      } catch (e) {
        logger.error(`Failed to fetch pharmacies: ${e}`);

        showToast({
          type: 'error',
          message: '약국 정보를 가져오는 데 실패했습니다.',
        });
      } finally {
        setLoading(false);
      }
    },
    [showToast],
  );

  // 지도 카메라를 지정 좌표로 이동
  const centerMapOn = useCallback(
    (coords: ICoordinate) => {
      mapRef.current?.animateToRegion(
        {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: DEFAULT_LATITUDE_DELTA,
          longitudeDelta: DEFAULT_LONGITUDE_DELTA,
        },
        300,
      );
    },
    [],
  );

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

  // 위치 기반 서비스 초기화
  const initializeLocation = useCallback(async () => {
    let hasLocation = false;

    try {
      setLoading(true);

      const isAllowed = await checkPermissionsAndServices();
      const isNotAllowed = !isAllowed;

      if (isNotAllowed) {
        return;
      }

      // 마지막 위치 즉시 렌더링 시도
      const lastLocation = await locationService.getLastKnownLocation();
      const hasLastLocation = Boolean(lastLocation);

      const canUseLastLocation = hasLastLocation && Boolean(lastLocation);

      if (canUseLastLocation) {
        setLocation(lastLocation);
        centerMapOn(lastLocation.coords);
        hasLocation = true;
      }

      // 최신 GPS 탐색
      const currentLocation =
        await locationService.getCurrentPositionWithFallback();
      const hasCurrentLocation = Boolean(currentLocation);

      const canUseCurrentLocation =
        hasCurrentLocation && Boolean(currentLocation);

      if (canUseCurrentLocation) {
        setLocation(currentLocation);
        centerMapOn(currentLocation.coords);
        hasLocation = true;
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
  }, [checkPermissionsAndServices, centerMapOn, showToast]);

  // 위치 상태 변경 시 약국 목록 갱신
  useEffect(() => {
    const hasLocation = Boolean(location);

    const canFetchForLocation = hasLocation && Boolean(location);

    if (canFetchForLocation) {
      fetchPharmacies({
        x: location.coords.longitude,
        y: location.coords.latitude,
      });
    }
  }, [location, fetchPharmacies]);

  // 화면 포커스 시 위치 초기화 및 안내 토스트 표시
  useFocusEffect(
    useCallback(() => {
      initializeLocation();
      showToast({
        message: `${NEARBY_PHARMACY_RADIUS_KM}km 이내 약국만 표시됩니다`,
      });
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
