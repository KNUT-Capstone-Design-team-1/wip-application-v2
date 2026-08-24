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
import { NEARBY_PHARMACY_RADIUS_KM } from '@features/nearby_pharmacy/constants/nearby_pharmacy';

export const useNearbyPharmacy = () => {
  const { showToast } = useToast();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );

  const [selectedPharmacy, setSelectedPharmacy] =
    useState<INearbyPharmacies | null>(null);

  const [pharmacies, setPharmacies] = useState<INearbyPharmacies[]>([]);

  // 클러스터 아이콘 탭 시 표시할 약국 목록. null 이면 목록 미표시
  const [clusterPharmacies, setClusterPharmacies] = useState<
    INearbyPharmacies[] | null
  >(null);

  // 마지막으로 약국 fetch가 수행된 중심 좌표. 자동 재검색 판단용.
  const [lastFetchedCenter, setLastFetchedCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const mapRef = useRef<MapView | null>(null);

  /**
   * 약국 정보 클립보드 복사
   */
  const handleCopy = useCallback(
    async (text: string) => {
      if (!text) {
        return;
      }

      await Clipboard.setStringAsync(text);

      showToast({ message: '복사되었습니다.' });
    },
    [showToast],
  );

  /**
   * 현재 위치로 이동
   */
  const handleLocate = useCallback(() => {
    if (!location) {
      showToast({ message: '현재 위치를 찾을 수 없습니다.' });
      return;
    }

    mapRef.current?.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  }, [location]);

  /**
   * 지도의 초기 위치 계산
   */
  const initialRegion = useMemo(() => {
    if (location) {
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }

    // 기본 위치 (서울시청)
    return {
      latitude: 37.5665,
      longitude: 126.978,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  }, [location]);

  /**
   * 마크 클릭 시 해당 약국 선택
   */
  const handleMarkerPress = useCallback((pharmacy: INearbyPharmacies) => {
    setSelectedPharmacy(pharmacy);
    useAppTrackStore.getState().increaseSubActionCount('nearby_pharmacy');
  }, []);

  /**
   * 정보 카드 닫기
   */
  const handleCloseInfoCard = useCallback(() => {
    setSelectedPharmacy(null);
  }, []);

  /**
   * 클러스터 아이콘 탭 시 해당 클러스터의 약국 목록 표시
   */
  const openClusterList = useCallback((list: INearbyPharmacies[]) => {
    setClusterPharmacies(list);
    setSelectedPharmacy(null);
  }, []);

  /**
   * 클러스터 약국 목록 닫기
   */
  const closeClusterList = useCallback(() => {
    setClusterPharmacies(null);
  }, []);

  /**
   * 클러스터 목록에서 특정 약국 선택 시 지도 이동 + 정보 카드 표시.
   * InfoCard 가 화면 하단을 가리므로 target 위도를 남쪽으로 살짝 offset 하여
   * 약국이 시각적으로 화면 중앙(위쪽 여유 영역의 중앙)에 오도록 한다.
   */
  const handleClusterPharmacySelect = useCallback(
    (pharmacy: INearbyPharmacies) => {
      const lat = parseFloat(pharmacy.Y);
      const lng = parseFloat(pharmacy.X);

      setClusterPharmacies(null);
      setSelectedPharmacy(pharmacy);

      if (!isNaN(lat) && !isNaN(lng)) {
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

  /**
   * 주어진 좌표를 중심으로 3km 이내의 약국 정보를 가져옴
   */
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
        logger.error(`Failed to fetch pharmacies. ${e.stack || e}`);

        showToast({
          type: 'error',
          message: '약국 정보를 가져오는 데 실패했습니다.',
        });
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /**
   * 위치 권한 및 서비스 활성화 여부 확인
   */
  const checkPermissionsAndServices = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      showToast({
        type: 'default',
        message: '위치 권한이 거부되었습니다.',
      });
      return false;
    }

    const enabled = await Location.hasServicesEnabledAsync();

    if (!enabled) {
      showToast({
        type: 'default',
        message: '위치 서비스(GPS)가 꺼져 있습니다.',
      });
      return false;
    }

    return true;
  }, []);

  /**
   * 지도 카메라를 주어진 좌표로 이동
   */
  const centerMapOn = useCallback(
    (coords: { latitude: number; longitude: number }) => {
      mapRef.current?.animateToRegion(
        {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        300,
      );
    },
    [],
  );

  /**
   * 타임아웃이 적용된 현재 위치 정보 가져오기.
   * Balanced 정확도 실패 시 Low 정확도로 1회 재시도.
   */
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
      logger.warn(
        `Balanced accuracy failed, retrying with Low. ${e?.message || e}`,
      );
      return await withTimeout(Location.Accuracy.Low);
    }
  }, []);

  /**
   * 위치 기반 서비스 초기화 프로세스
   */
  const initializeLocation = useCallback(async () => {
    let hasLocation = false;

    try {
      setLoading(true);

      const isAllowed = await checkPermissionsAndServices();
      if (!isAllowed) return;

      // 마지막 위치 시도 (즉시 렌더링)
      const lastLocation = await Location.getLastKnownPositionAsync();
      if (lastLocation) {
        setLocation(lastLocation);
        centerMapOn(lastLocation.coords);
        hasLocation = true;
      }

      // API 통신을 기다리지 않고 곧바로 최신 GPS 탐색
      const currentLocation = await getCurrentPositionWithTimeout();
      if (currentLocation) {
        setLocation(currentLocation);
        centerMapOn(currentLocation.coords);
        hasLocation = true;
      }
    } catch (e) {
      logger.error(`Failed to initialize location. ${e.stack || e}`);

      // 이미 lastLocation을 가져와 지도가 정상적으로 렌더링 중이라면, 에러 토스트를 숨김 (Silent Fail)
      if (!hasLocation) {
        showToast({
          type: 'error',
          message: '위치 확인에 실패했습니다.\n다시 시도해 주세요.',
        });
      }
    } finally {
      setLoading(false);
    }
  }, [checkPermissionsAndServices, getCurrentPositionWithTimeout, centerMapOn]);

  // 위치 상태가 변경될 때마다 알아서 API 페칭
  useEffect(() => {
    if (location) {
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
    }, [initializeLocation]),
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
