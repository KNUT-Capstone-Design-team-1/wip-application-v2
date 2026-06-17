import { useEffect, useState, useCallback, useRef } from 'react';
import * as Location from 'expo-location';
import { useToast } from '@hooks/use_toast';
import { getNearbyPharmacies } from '@services/database/queries/nearby_pharmacies';
import { INearbyPharmacies } from '@services/database/types';
import logger from '@utils/logger';

export const useNearbyPharmacy = () => {
  const { showToast } = useToast();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );

  const [pharmacies, setPharmacies] = useState<INearbyPharmacies[]>([]);

  const [loading, setLoading] = useState(true);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 데이터 로드 성공 여부 추적 (에러 메시지 표시용)
  const isDataLoaded = useRef(false);

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

        isDataLoaded.current = true;
      } catch (e) {
        logger.error(`Failed to fetch pharmacies. ${e.stack || e}`);

        setErrorMsg('약국 정보를 가져오는데 실패했습니다.');
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
      setErrorMsg('위치 권한이 거부되었습니다.');
      return false;
    }

    const enabled = await Location.hasServicesEnabledAsync();

    if (!enabled) {
      setErrorMsg('위치 서비스(GPS)가 꺼져 있습니다.');
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
   * 상태 업데이트 및 약국 데이터 페칭 실행
   */
  const updateLocationAndFetch = useCallback(
    async (loc: Location.LocationObject) => {
      setLocation(loc);

      await fetchPharmacies({
        x: loc.coords.longitude,
        y: loc.coords.latitude,
      });
    },
    [fetchPharmacies],
  );

  /**
   * 위치 기반 서비스 초기화 프로세스
   */
  const initializeLocation = useCallback(async () => {
    try {
      setLoading(true);

      const isAllowed = await checkPermissionsAndServices();
      if (!isAllowed) return;

      // 마지막 위치 시도
      const lastLocation = await Location.getLastKnownPositionAsync();
      if (lastLocation) {
        await updateLocationAndFetch(lastLocation);
      }

      // 현재 위치 시도
      const currentLocation = await getCurrentPositionWithTimeout();
      if (currentLocation) {
        await updateLocationAndFetch(currentLocation);
      }
    } catch (e) {
      logger.error(`Failed to initialize location. ${e.stack || e}`);

      showToast({
        type: 'error',
        message: '위치 확인에 실패했습니다. 다시 시도해주세요.',
      });

      if (!isDataLoaded.current) {
        setErrorMsg('위치 확인에 실패했습니다. 다시 시도해주세요.'); // 어떤 방식으로도 데이터를 가져오지 못했을 때만 에러 메시지 설정
      }
    } finally {
      setLoading(false);
    }
  }, [
    checkPermissionsAndServices,
    getCurrentPositionWithTimeout,
    updateLocationAndFetch,
  ]);

  useEffect(() => {
    initializeLocation();
  }, [initializeLocation]);

  return {
    location,
    pharmacies,
    loading,
    errorMsg,
    fetchPharmacies,
    refreshLocation: initializeLocation,
  };
};
