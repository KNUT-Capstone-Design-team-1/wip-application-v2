import { SearchResultAdManager } from '@features/ads/services/searchResultAdManager';
import { NativeAd } from 'react-native-google-mobile-ads';

jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: jest.fn((obj) => obj.ios || obj.default),
  },
}));

jest.mock('@utils/logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('@features/ads/constants/ad_units', () => ({
  AD_UNITS: {
    NATIVE: 'ca-app-pub-test-native',
  },
}));

jest.mock('@features/ads/constants/keyword', () => ({
  ADS_KEYWORDS: ['health', 'medicine'],
}));

jest.mock('react-native-google-mobile-ads', () => {
  return {
    NativeAd: {
      createForAdRequest: jest.fn(),
    },
    NativeAdEventType: {
      IMPRESSION: 'impression',
      CLICKED: 'clicked',
    },
  };
});

describe('SearchResultAdManager 단위 테스트 (단일 Preload 큐 + 슬롯 바인딩)', () => {
  let manager: SearchResultAdManager;
  let mockAdCounter = 0;

  const createMockNativeAd = () => {
    const id = ++mockAdCounter;
    return {
      id: `mock-native-ad-${id}`,
      destroy: jest.fn(),
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockAdCounter = 0;
    manager = new SearchResultAdManager();
  });

  afterEach(() => {
    manager.destroyAll();
  });

  describe('1. Preload 및 Coalescing 동작', () => {
    it('preloadAd 호출 시 NativeAd.createForAdRequest를 호출하여 후보 광고를 준비한다', async () => {
      const mockAd = createMockNativeAd();
      (NativeAd.createForAdRequest as jest.Mock).mockResolvedValue(mockAd);

      const ad = await manager.preloadAd();
      expect(NativeAd.createForAdRequest).toHaveBeenCalledTimes(1);
      expect(ad).toBe(mockAd);
    });

    it('동시에 여러 번 preloadAd를 호출해도 중복 요청 없이 단일 Promise를 공유한다 (Coalescing)', async () => {
      const mockAd = createMockNativeAd();
      (NativeAd.createForAdRequest as jest.Mock).mockReturnValue(
        new Promise((resolve) => setTimeout(() => resolve(mockAd), 20)),
      );

      const [ad1, ad2, ad3] = await Promise.all([
        manager.preloadAd(),
        manager.preloadAd(),
        manager.preloadAd(),
      ]);

      expect(NativeAd.createForAdRequest).toHaveBeenCalledTimes(1);
      expect(ad1).toBe(mockAd);
      expect(ad2).toBe(mockAd);
      expect(ad3).toBe(mockAd);
    });

    it('60초 TTL 이내에는 추가 네트워크 요청 없이 동일한 preloadedAd를 반환한다', async () => {
      const mockAd = createMockNativeAd();
      (NativeAd.createForAdRequest as jest.Mock).mockResolvedValue(mockAd);

      await manager.preloadAd();
      const cached = await manager.preloadAd();

      expect(NativeAd.createForAdRequest).toHaveBeenCalledTimes(1);
      expect(cached).toBe(mockAd);
    });
  });

  describe('2. 슬롯 바인딩 (getOrBindAd) 및 단일 Preload 큐 소비/보충', () => {
    it('Preload 큐에 광고가 있을 때 슬롯에 즉시 바인딩(0ms)하고 다음 광고를 백그라운드에서 프리로드한다', async () => {
      const mockAdA = createMockNativeAd();
      const mockAdB = createMockNativeAd();
      (NativeAd.createForAdRequest as jest.Mock)
        .mockResolvedValueOnce(mockAdA)
        .mockResolvedValueOnce(mockAdB);

      // 1. 검색 진입 전 사전 프리로드
      await manager.preloadAd();
      expect(NativeAd.createForAdRequest).toHaveBeenCalledTimes(1);

      // 2. 뷰포트 진입 시 8번 슬롯에 광고 바인딩 요청
      const boundAd = await manager.getOrBindAd('slot-8');
      expect(boundAd).toBe(mockAdA);
      expect(manager.getSlotAd('slot-8')).toBe(mockAdA);

      // 3. 큐가 비워졌으므로 다음 슬롯 대비 백그라운드 Preload가 트리거됨 (총 2회 호출)
      expect(NativeAd.createForAdRequest).toHaveBeenCalledTimes(2);
    });

    it('역스크롤 시 이미 바인딩된 슬롯은 네트워크 요청 없이 즉시 동일한 광고를 반환한다', async () => {
      const mockAdA = createMockNativeAd();
      (NativeAd.createForAdRequest as jest.Mock).mockResolvedValue(mockAdA);

      await manager.getOrBindAd('slot-8');

      // 역스크롤로 slot-8 다시 접근
      const cachedAd = await manager.getOrBindAd('slot-8');
      expect(cachedAd).toBe(mockAdA);
      expect(manager.getSlotAd('slot-8')).toBe(mockAdA);
    });

    it('Preload 큐가 비어있을 때 슬롯 바인딩 요청 시 새로 로드하여 해당 슬롯에 할당한다', async () => {
      const mockAdA = createMockNativeAd();
      const mockAdB = createMockNativeAd();
      (NativeAd.createForAdRequest as jest.Mock)
        .mockResolvedValueOnce(mockAdA)
        .mockResolvedValueOnce(mockAdB);

      const boundAd = await manager.getOrBindAd('slot-8');
      expect(boundAd).toBe(mockAdA);
      expect(manager.getSlotAd('slot-8')).toBe(mockAdA);
    });
  });

  describe('3. 메모리 해제 및 세션 리셋 (resetForNewSearch, destroyAll)', () => {
    it('resetForNewSearch 호출 시 슬롯에 할당된 광고는 destroy하고 미소비 preloadedAd는 보존한다', async () => {
      const mockAdSlot = createMockNativeAd();
      const mockAdPreload = createMockNativeAd();

      (NativeAd.createForAdRequest as jest.Mock)
        .mockResolvedValueOnce(mockAdSlot)
        .mockResolvedValueOnce(mockAdPreload);

      // slot-8에 바인딩
      await manager.getOrBindAd('slot-8');

      // 화면 이탈 / 새 검색 시 resetForNewSearch 호출
      manager.resetForNewSearch();

      // 슬롯에 있던 광고는 destroy되고 slotMap에서 제거됨
      expect(mockAdSlot.destroy).toHaveBeenCalledTimes(1);
      expect(manager.getSlotAd('slot-8')).toBeNull();

      // 백그라운드 프리로드되었던 미소비 preloadedAd는 파기되지 않고 보존됨
      expect(mockAdPreload.destroy).not.toHaveBeenCalled();
    });

    it('destroyAll 호출 시 슬롯 광고와 preloadedAd를 모두 destroy한다', async () => {
      const mockAd1 = createMockNativeAd();
      (NativeAd.createForAdRequest as jest.Mock).mockResolvedValue(mockAd1);

      await manager.preloadAd();
      manager.destroyAll();

      expect(mockAd1.destroy).toHaveBeenCalledTimes(1);
    });
  });
});
