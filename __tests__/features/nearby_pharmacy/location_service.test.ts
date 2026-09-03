import { LocationService } from '../../../src/features/nearby_pharmacy/services/location_service';
import { ILocationRepository } from '../../../src/features/nearby_pharmacy/data/repositories/location_repository';
import * as Location from 'expo-location';

jest.mock('expo-location', () => ({
  PermissionStatus: {
    GRANTED: 'granted',
    DENIED: 'denied',
    UNDETERMINED: 'undetermined',
  },
  Accuracy: {
    Lowest: 1,
    Low: 2,
    Balanced: 3,
    High: 4,
    Highest: 5,
    BestForNavigation: 6,
  },
  requestForegroundPermissionsAsync: jest.fn(),
  hasServicesEnabledAsync: jest.fn(),
  getLastKnownPositionAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
}));

jest.mock('@utils/logger', () => ({
  __esModule: true,
  default: {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe('LocationService 단위 테스트', () => {
  let service: LocationService;
  let mockRepository: jest.Mocked<ILocationRepository>;

  beforeEach(() => {
    mockRepository = {
      requestForegroundPermissions: jest.fn().mockResolvedValue({
        status: Location.PermissionStatus.GRANTED,
        granted: true,
        canAskAgain: true,
        expires: 'never',
      }),
      hasServicesEnabled: jest.fn().mockResolvedValue(true),
      getLastKnownPosition: jest.fn().mockResolvedValue(null),
      getCurrentPosition: jest.fn().mockResolvedValue({
        coords: {
          latitude: 37.5665,
          longitude: 126.978,
          altitude: null,
          accuracy: 5,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      }),
    };
    service = new LocationService(mockRepository);
  });

  describe('checkLocationAvailability', () => {
    it('권한이 거부되었을 때 failure와 reason: permission_denied를 반환해야 한다', async () => {
      mockRepository.requestForegroundPermissions.mockResolvedValueOnce({
        status: Location.PermissionStatus.DENIED,
        granted: false,
        canAskAgain: true,
        expires: 'never',
      });

      const result = await service.checkLocationAvailability();
      expect(result).toEqual({
        success: false,
        reason: 'permission_denied',
      });
    });

    it('GPS 서비스가 꺼져 있을 때 failure와 reason: gps_disabled를 반환해야 한다', async () => {
      mockRepository.hasServicesEnabled.mockResolvedValueOnce(false);

      const result = await service.checkLocationAvailability();
      expect(result).toEqual({
        success: false,
        reason: 'gps_disabled',
      });
    });

    it('권한과 GPS가 모두 활성화되어 있으면 success: true를 반환해야 한다', async () => {
      const result = await service.checkLocationAvailability();
      expect(result).toEqual({ success: true });
    });
  });

  describe('getCurrentPositionWithFallback', () => {
    it('Balanced 모드로 위치 조회 성공 시 해당 위치를 반환해야 한다', async () => {
      const result = await service.getCurrentPositionWithFallback();
      expect(result?.coords.latitude).toBe(37.5665);
      expect(mockRepository.getCurrentPosition).toHaveBeenCalledWith({
        accuracy: Location.Accuracy.Balanced,
      });
    });

    it('Balanced 실패 시 Low 모드로 재시도해야 한다', async () => {
      mockRepository.getCurrentPosition
        .mockRejectedValueOnce(new Error('Balanced failed'))
        .mockResolvedValueOnce({
          coords: {
            latitude: 37.5665,
            longitude: 126.978,
            altitude: null,
            accuracy: 20,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: Date.now(),
        });

      const result = await service.getCurrentPositionWithFallback();
      expect(result?.coords.latitude).toBe(37.5665);
      expect(mockRepository.getCurrentPosition).toHaveBeenCalledTimes(2);
      expect(mockRepository.getCurrentPosition).toHaveBeenLastCalledWith({
        accuracy: Location.Accuracy.Low,
      });
    });
  });

  describe('getLastKnownLocation', () => {
    it('repository로부터 마지막 위치를 정상 반환해야 한다', async () => {
      const mockLocation: Location.LocationObject = {
        coords: {
          latitude: 37.5665,
          longitude: 126.978,
          altitude: null,
          accuracy: 5,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      };
      mockRepository.getLastKnownPosition.mockResolvedValueOnce(mockLocation);

      const result = await service.getLastKnownLocation();
      expect(result).toEqual(mockLocation);
    });
  });
});
