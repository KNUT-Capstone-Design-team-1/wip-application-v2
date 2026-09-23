import React from 'react';
import { useResearchPharmacy } from '../../../src/features/nearby_pharmacy/hooks/use_research_pharmacy';
import { nearbyPharmacyService } from '../../../src/features/nearby_pharmacy/services/nearby_pharmacy_service';
import { PHARMACY_TOAST_MESSAGES } from '../../../src/features/nearby_pharmacy/constants/ui';
import { INearbyPharmacies } from '../../../src/services/database/types';

jest.mock(
  '../../../src/features/nearby_pharmacy/services/nearby_pharmacy_service',
  () => ({
    nearbyPharmacyService: {
      checkShouldResearch: jest.fn(),
    },
  }),
);

const mockShowToast = jest.fn();
jest.mock(
  '../../../src/features/nearby_pharmacy/hooks/use_pharmacy_toast',
  () => ({
    usePharmacyToast: () => ({
      showToast: mockShowToast,
    }),
  }),
);

const mockCurrentTime = new Date('2026-09-23T12:00:00');
jest.mock(
  '../../../src/features/nearby_pharmacy/hooks/use_pharmacy_current_time',
  () => ({
    usePharmacyCurrentTime: () => mockCurrentTime,
  }),
);

describe('useResearchPharmacy 단위 테스트', () => {
  const mockRegion = {
    latitude: 37.5665,
    longitude: 126.978,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const mockLastCenter = {
    lat: 37.56,
    lng: 126.97,
  };

  const mockClosedPharmacy: INearbyPharmacies = {
    id: 1,
    dutyName: '휴무 약국',
    dutyAddr: '서울시 중구',
    dutyTel1: '02-000-0000',
    wgs84Lat: 37.5665,
    wgs84Lon: 126.978,
    openTime:
      "['0000', '0000', '0000', '0000', '0000', '0000', '0000', '0000']",
    closeTime:
      "['0000', '0000', '0000', '0000', '0000', '0000', '0000', '0000']",
  };

  const mockOpenPharmacy: INearbyPharmacies = {
    id: 2,
    dutyName: '영업 중 약국',
    dutyAddr: '서울시 중구',
    dutyTel1: '02-111-1111',
    wgs84Lat: 37.5665,
    wgs84Lon: 126.978,
    openTime:
      "['0900', '0900', '0900', '0900', '0900', '0900', '0900', '0900']",
    closeTime:
      "['1800', '1800', '1800', '1800', '1800', '1800', '1800', '1800']",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (nearbyPharmacyService.checkShouldResearch as jest.Mock).mockReturnValue(
      true,
    );

    jest
      .spyOn(React, 'useMemo')
      .mockImplementation((fn: () => unknown) => fn());
    jest
      .spyOn(React, 'useCallback')
      .mockImplementation((fn: (...args: unknown[]) => unknown) => fn);
    jest.spyOn(React, 'useRef').mockImplementation((initialValue: unknown) => ({
      current: initialValue,
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('isOpenOnly가 true이고 재검색 결과 영업 중인 약국이 없으면 "현재 영업 중인 주변 약국이 없습니다." 토스트를 출력해야 한다', async () => {
    const fetchPharmacies = jest.fn().mockResolvedValue([mockClosedPharmacy]);
    const onResetSelection = jest.fn();

    const { handleResearchHere } = useResearchPharmacy(
      mockRegion,
      mockLastCenter,
      fetchPharmacies,
      onResetSelection,
      true, // isOpenOnly: true
    );

    await handleResearchHere();

    expect(fetchPharmacies).toHaveBeenCalledWith({
      x: mockRegion.longitude,
      y: mockRegion.latitude,
    });
    expect(onResetSelection).toHaveBeenCalled();
    expect(mockShowToast).toHaveBeenCalledWith({
      type: 'default',
      message: PHARMACY_TOAST_MESSAGES.NO_OPEN_PHARMACY,
    });
  });

  it('isOpenOnly가 true이고 검색 결과가 빈 배열(0건)일 때도 안내 토스트를 출력해야 한다', async () => {
    const fetchPharmacies = jest.fn().mockResolvedValue([]);
    const onResetSelection = jest.fn();

    const { handleResearchHere } = useResearchPharmacy(
      mockRegion,
      mockLastCenter,
      fetchPharmacies,
      onResetSelection,
      true,
    );

    await handleResearchHere();

    expect(mockShowToast).toHaveBeenCalledWith({
      type: 'default',
      message: PHARMACY_TOAST_MESSAGES.NO_OPEN_PHARMACY,
    });
  });

  it('isOpenOnly가 true이고 영업 중인 약국이 있으면 안내 토스트를 출력하지 않아야 한다', async () => {
    const fetchPharmacies = jest.fn().mockResolvedValue([mockOpenPharmacy]);
    const onResetSelection = jest.fn();

    const { handleResearchHere } = useResearchPharmacy(
      mockRegion,
      mockLastCenter,
      fetchPharmacies,
      onResetSelection,
      true,
    );

    await handleResearchHere();

    expect(mockShowToast).not.toHaveBeenCalled();
  });

  it('isOpenOnly가 false일 때는 영업 중인 약국이 없어도 토스트를 출력하지 않아야 한다', async () => {
    const fetchPharmacies = jest.fn().mockResolvedValue([mockClosedPharmacy]);
    const onResetSelection = jest.fn();

    const { handleResearchHere } = useResearchPharmacy(
      mockRegion,
      mockLastCenter,
      fetchPharmacies,
      onResetSelection,
      false, // isOpenOnly: false
    );

    await handleResearchHere();

    expect(mockShowToast).not.toHaveBeenCalled();
  });
});
