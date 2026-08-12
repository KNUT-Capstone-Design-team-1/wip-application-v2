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

export const useNearbyPharmacy = () => {
  const { showToast } = useToast();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );

  const [selectedPharmacy, setSelectedPharmacy] =
    useState<INearbyPharmacies | null>(null);

  const [pharmacies, setPharmacies] = useState<INearbyPharmacies[]>([]);

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
   * 주어진 좌표 주변의 약국 정보를 가져옴
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
   * 타임아웃이 적용된 현재 위치 정보 가져오기
   */
  const getCurrentPositionWithTimeout = useCallback(async () => {
    return await Promise.race([
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }),
      new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('Location timeout')), 60 * 1000),
      ),
    ]);
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
        hasLocation = true;
      }

      // API 통신을 기다리지 않고 곧바로 최신 GPS 탐색
      const currentLocation = await getCurrentPositionWithTimeout();
      if (currentLocation) {
        setLocation(currentLocation);
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
  }, [checkPermissionsAndServices, getCurrentPositionWithTimeout]);

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
    }, [initializeLocation]),
  );

  return {
    mapRef,
    initialRegion,
    location,
    pharmacies,
    loading,
    selectedPharmacy,
    handleLocate,
    handleCopy,
    handleMarkerPress,
    handleCloseInfoCard,
    fetchPharmacies,
    refreshLocation: initializeLocation,
  };
};
