import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import * as Location from 'expo-location';
import * as Clipboard from 'expo-clipboard';
import { useToast } from '@hooks/use_toast';
import { getNearbyPharmacies } from '@services/database/queries/nearby_pharmacies';
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

// 주변 약국 지도 및 위치 기반 검색 커스텀 훅
export const useNearbyPharmacy = () => {
  const { showToast } = useToast();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );

  const [selectedPharmacy, setSelectedPharmacy] =
    useState<INearbyPharmacies | null>(null);

  const [pharmacies, setPharmacies] = useState<INearbyPharmacies[]>([]);

  // 클러스터 아이콘 탭 시 표시할 약국 목록 (null이면 미표시)
  const [clusterPharmacies, setClusterPharmacies] = useState<
    INearbyPharmacies[] | null
  >(null);

  // 마지막으로 약국 조회가 수행된 중심 좌표
  const [lastFetchedCenter, setLastFetchedCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const mapRef = useRef<MapView | null>(null);

  // 약국 정보 클립보드 복사
  const handleCopy = useCallback(
    async (text: string) => {
      const hasNoText = !text;

      if (hasNoText) {
        return;
      }

      await Clipboard.setStringAsync(text);
      showToast({ message: '복사되었습니다.' });
    },
    [showToast],
  );

  // 현재 위치로 이동
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

  // 지도의 초기 위치 계산
  const initialRegion = useMemo(() => {
    const hasLocation = Boolean(location);

    if (hasLocation && location) {
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

  // 마크 클릭 시 해당 약국 선택
  const handleMarkerPress = useCallback((pharmacy: INearbyPharmacies) => {
    setClusterPharmacies(null);
    setSelectedPharmacy(pharmacy);
    useAppTrackStore.getState().increaseSubActionCount('nearby_pharmacy');
  }, []);

  // 정보 카드 닫기
  const handleCloseInfoCard = useCallback(() => {
    setSelectedPharmacy(null);
  }, []);

  // 클러스터 아이콘 탭 시 해당 클러스터의 약국 목록 표시
  const openClusterList = useCallback((list: INearbyPharmacies[]) => {
    setClusterPharmacies(list);
    setSelectedPharmacy(null);
  }, []);

  // 클러스터 약국 목록 닫기
  const closeClusterList = useCallback(() => {
    setClusterPharmacies(null);
  }, []);

  // 클러스터 목록에서 특정 약국 선택 시 지도 이동 및 정보 카드 표시
  const handleClusterPharmacySelect = useCallback(
    (pharmacy: INearbyPharmacies) => {
      const lat = parseFloat(pharmacy.Y);
      const lng = parseFloat(pharmacy.X);

      setClusterPharmacies(null);
      setSelectedPharmacy(pharmacy);

      const isValidCoords = !isNaN(lat) && !isNaN(lng);

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

  // 주어진 좌표를 중심으로 약국 정보 조회
  const fetchPharmacies = useCallback(
    async (coords: { x: number; y: number }) => {
      try {
        setLoading(true);

        const result = await getNearbyPharmacies(
          { coordinate: coords },
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

  // 위치 권한 및 GPS 활성화 여부 확인
  const checkPermissionsAndServices = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    const isPermissionDenied = status !== 'granted';

    if (isPermissionDenied) {
      showToast({
        type: 'default',
        message: '위치 권한이 거부되었습니다.',
      });
      return false;
    }

    const enabled = await Location.hasServicesEnabledAsync();
    const isGpsDisabled = !enabled;

    if (isGpsDisabled) {
      showToast({
        type: 'default',
        message: '위치 서비스(GPS)가 꺼져 있습니다.',
      });
      return false;
    }

    return true;
  }, [showToast]);

  // 지도 카메라를 주어진 좌표로 이동
  const centerMapOn = useCallback(
    (coords: { latitude: number; longitude: number }) => {
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

  // 현재 위치 정보 가져오기 (타임아웃 적용)
  const getCurrentPositionWithTimeout = useCallback(async () => {
    const withTimeout = (accuracy: Location.Accuracy) =>
      Promise.race([
        Location.getCurrentPositionAsync({ accuracy }),
        new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error('Location timeout')), 60 * 1000),
        ),
      ]);

    try {
      return await withTimeout(Location.Accuracy.Balanced);
    } catch (e) {
      logger.warn(`Balanced accuracy failed, retrying with Low: ${e}`);
      return await withTimeout(Location.Accuracy.Low);
    }
  }, []);

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
      const lastLocation = await Location.getLastKnownPositionAsync();
      const hasLastLocation = Boolean(lastLocation);

      if (hasLastLocation && lastLocation) {
        setLocation(lastLocation);
        centerMapOn(lastLocation.coords);
        hasLocation = true;
      }

      // 최신 GPS 탐색
      const currentLocation = await getCurrentPositionWithTimeout();
      const hasCurrentLocation = Boolean(currentLocation);

      if (hasCurrentLocation && currentLocation) {
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
  }, [
    checkPermissionsAndServices,
    getCurrentPositionWithTimeout,
    centerMapOn,
    showToast,
  ]);

  // 위치 상태가 변경될 때마다 API 호출
  useEffect(() => {
    const hasLocation = Boolean(location);

    if (hasLocation && location) {
      fetchPharmacies({
        x: location.coords.longitude,
        y: location.coords.latitude,
      });
    }
  }, [location, fetchPharmacies]);

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
