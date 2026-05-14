import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { getNearbyPharmacies } from '@services/database/queries/nearby_pharmacies';
import { INearbyPharmacies } from '@services/database/types';

export const useNearbyPharmacy = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [pharmacies, setPharmacies] = useState<INearbyPharmacies[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchPharmacies = async (coords: { x: number; y: number }) => {
    try {
      setLoading(true);

      const result = await getNearbyPharmacies(
        { coordinate: coords },
        { page: 1, limit: 50 },
      );

      setPharmacies(result);
    } catch (error) {
      console.error('Failed to fetch pharmacies:', error);

      setErrorMsg('약국 정보를 가져오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      console.log('[NearbyPharmacy] Starting location fetch...');

      try {
        console.log('[NearbyPharmacy] Requesting permissions...');

        let { status } = await Location.requestForegroundPermissionsAsync();

        console.log('[NearbyPharmacy] Permission status:', status);

        if (status !== 'granted') {
          setErrorMsg('위치 권한이 거부되었습니다.');
          setLoading(false);
          return;
        }

        console.log('[NearbyPharmacy] Checking if services enabled...');

        const enabled = await Location.hasServicesEnabledAsync();

        console.log('[NearbyPharmacy] Services enabled:', enabled);

        if (!enabled) {
          setErrorMsg('위치 서비스(GPS)가 꺼져 있습니다.');
          setLoading(false);
          return;
        }

        // 먼저 마지막으로 알려진 위치를 가져와서 시도 (매우 빠름)
        console.log('[NearbyPharmacy] Trying last known position...');

        const lastLocation = await Location.getLastKnownPositionAsync();
        if (lastLocation) {
          console.log('[NearbyPharmacy] Found last known position');

          setLocation(lastLocation);

          await fetchPharmacies({
            x: lastLocation.coords.longitude,
            y: lastLocation.coords.latitude,
          });
        }

        console.log('[NearbyPharmacy] Requesting current position...');

        const currentLocation = await Promise.race([
          Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          }),

          new Promise<null>((_, reject) =>
            setTimeout(() => reject(new Error('Location timeout')), 10000),
          ),
        ]);

        if (currentLocation) {
          console.log('[NearbyPharmacy] Current position obtained');

          setLocation(currentLocation);

          await fetchPharmacies({
            x: currentLocation.coords.longitude,
            y: currentLocation.coords.latitude,
          });
        }
      } catch (error) {
        console.error('[NearbyPharmacy] Error in location lifecycle:', error);

        // 이미 lastLocation으로 데이터를 가져왔다면 에러 메시지를 띄우지 않음
        if (!location) {
          setErrorMsg('위치 정보를 가져오는 중 오류가 발생했습니다.');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return {
    location,
    pharmacies,
    loading,
    errorMsg,
    fetchPharmacies,
  };
};
