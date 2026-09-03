import { NearbyPharmacyService } from '../../../src/features/nearby_pharmacy/services/nearby_pharmacy_service';
import { INearbyPharmacyRepository } from '../../../src/features/nearby_pharmacy/data/repositories/nearby_pharmacy_repository';
import { INearbyPharmacies } from '../../../src/services/database/types';

jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(),
}));

describe('NearbyPharmacyService 단위 테스트', () => {
  let service: NearbyPharmacyService;
  let mockRepository: jest.Mocked<INearbyPharmacyRepository>;

  const samplePharmacies: INearbyPharmacies[] = [
    {
      id: '1',
      name: '온누리약국',
      states: '영업중',
      region: '서울특별시',
      district: '중구',
      address: '서울특별시 중구 세종대로 110',
      tel: '02-123-4567',
      X: '126.978',
      Y: '37.5665',
      distance: 100,
    },
    {
      id: '2',
      name: '메디컬약국',
      states: '영업중',
      region: '서울특별시',
      district: '중구',
      address: '서울특별시 중구 을지로 12',
      tel: '02-987-6543',
      X: '126.980',
      Y: '37.5675',
      distance: 250,
    },
  ];

  beforeEach(() => {
    mockRepository = {
      getNearbyPharmacies: jest.fn().mockResolvedValue(samplePharmacies),
    };
    service = new NearbyPharmacyService(mockRepository);
  });

  describe('searchNearbyPharmacies', () => {
    it('주어진 좌표를 전달하여 약국 목록을 조회해야 한다', async () => {
      const coords = { x: 126.978, y: 37.5665 };
      const result = await service.searchNearbyPharmacies(coords, {
        page: 1,
        limit: 50,
      });

      expect(mockRepository.getNearbyPharmacies).toHaveBeenCalledWith(
        { coordinate: coords },
        { page: 1, limit: 50 },
      );
      expect(result).toEqual(samplePharmacies);
    });
  });

  describe('checkShouldResearch', () => {
    it('중심 좌표 또는 지도 영역이 없으면 false를 반환해야 한다', () => {
      expect(service.checkShouldResearch(null, { lat: 37.5, lng: 127.0 })).toBe(
        false,
      );
      expect(
        service.checkShouldResearch(
          {
            latitude: 37.5,
            longitude: 127.0,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          null,
        ),
      ).toBe(false);
    });

    it('지도가 임계치 이상 이동하지 않았으면 false를 반환해야 한다', () => {
      const region = {
        latitude: 37.5665,
        longitude: 126.978,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      const lastCenter = { lat: 37.5665, lng: 126.978 };

      expect(service.checkShouldResearch(region, lastCenter)).toBe(false);
    });

    it('지도가 임계치 이상 이동했으면 true를 반환해야 한다', () => {
      const region = {
        latitude: 37.58, // 상당 거리 이동
        longitude: 126.978,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      const lastCenter = { lat: 37.5665, lng: 126.978 };

      expect(service.checkShouldResearch(region, lastCenter)).toBe(true);
    });
  });

  describe('calculateCenterCoordinate', () => {
    it('빈 목록이거나 유효하지 않은 좌표일 경우 null을 반환해야 한다', () => {
      expect(service.calculateCenterCoordinate([])).toBeNull();
      expect(
        service.calculateCenterCoordinate([
          {
            ...samplePharmacies[0],
            X: 'invalid',
            Y: 'invalid',
          },
        ]),
      ).toBeNull();
    });

    it('약국 목록의 위도, 경도 산술 평균을 올바르게 계산해야 한다', () => {
      const center = service.calculateCenterCoordinate(samplePharmacies);

      expect(center).not.toBeNull();
      expect(center?.latitude).toBeCloseTo((37.5665 + 37.5675) / 2);
      expect(center?.longitude).toBeCloseTo((126.978 + 126.98) / 2);
    });
  });
});
