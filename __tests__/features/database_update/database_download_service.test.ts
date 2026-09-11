import { databaseDownloadService } from '../../../src/features/database_update/services/database_download_service';
import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleCloud } from '@services/apis';

jest.mock('expo-file-system/legacy', () => ({
  documentDirectory: 'file:///data/user/0/com.mbm.whatispill/files/',
  cacheDirectory: 'file:///data/user/0/com.mbm.whatispill/cache/',
  FileSystemSessionType: {
    BACKGROUND: 0,
    FOREGROUND: 1,
  },
  getInfoAsync: jest.fn(),
  makeDirectoryAsync: jest.fn(),
  downloadAsync: jest.fn(),
  readAsStringAsync: jest.fn(),
  writeAsStringAsync: jest.fn(),
  deleteAsync: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('@services/apis', () => ({
  GoogleCloud: {
    ResourceDataAPI: {
      requestResourceData: jest.fn(),
    },
  },
}));

jest.mock('@services/apis/google_cloud/google_cloud_token', () => ({
  getToken: jest.fn(() => 'mock-token'),
}));

jest.mock('@utils/logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe('databaseDownloadService 단위 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_GOOGLE_CLOUD_PLATFORM_WIP_RESOURCE_DATA_URL =
      'https://api.example.com/resource';
  });

  describe('경로 및 URL 생성', () => {
    it('임시 디렉토리 경로를 올바르게 반환해야 한다', () => {
      const dir = databaseDownloadService.getTempDirectory();
      expect(dir).toBe(
        'file:///data/user/0/com.mbm.whatispill/files/db_updates/',
      );
    });

    it('페이지 파일 경로를 올바르게 생성해야 한다', () => {
      const filePath = databaseDownloadService.getPageFilePath('pill_data', 2);
      expect(filePath).toBe(
        'file:///data/user/0/com.mbm.whatispill/files/db_updates/pill_data_p2.json',
      );
    });
  });

  describe('isPageDataCached', () => {
    it('파일이 존재하지 않으면 false를 반환해야 한다', async () => {
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({
        exists: false,
      });

      const result = await databaseDownloadService.isPageDataCached(
        'pill_data',
        1,
      );
      expect(result).toBe(false);
    });

    it('파일이 존재하지만 크기가 0이면 false를 반환해야 한다', async () => {
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({
        exists: true,
        size: 0,
      });

      const result = await databaseDownloadService.isPageDataCached(
        'pill_data',
        1,
      );
      expect(result).toBe(false);
    });

    it('유효한 JSON 구조를 가진 파일이 존재하면 true를 반환해야 한다', async () => {
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({
        exists: true,
        size: 200,
      });
      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(
        JSON.stringify({
          resource: [{ ITEM_SEQ: '123' }],
          total: 100,
          totalPage: 5,
          current: 1,
        }),
      );

      const result = await databaseDownloadService.isPageDataCached(
        'pill_data',
        1,
      );
      expect(result).toBe(true);
    });
  });

  describe('fetchAndCachePageData', () => {
    it('이미 캐시된 유효 파일이 있으면 다운로드 없이 캐시를 반환해야 한다', async () => {
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({
        exists: true,
        size: 200,
      });
      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(
        JSON.stringify({
          resource: [{ ITEM_SEQ: '123' }],
          total: 100,
          totalPage: 5,
          current: 1,
        }),
      );

      const result = await databaseDownloadService.fetchAndCachePageData(
        'pill_data',
        1,
      );

      expect(FileSystem.downloadAsync).not.toHaveBeenCalled();
      expect(result.total).toBe(100);
      expect(result.totalPage).toBe(5);
    });

    it('성공적으로 다운로드되면 파싱된 결과를 반환해야 한다', async () => {
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({
        exists: false,
      });
      (
        GoogleCloud.ResourceDataAPI.requestResourceData as jest.Mock
      ).mockResolvedValue({
        resource: [{ ITEM_SEQ: '999' }],
        total: 50,
        totalPage: 2,
        current: 1,
      });

      const result = await databaseDownloadService.fetchAndCachePageData(
        'cannabis',
        1,
      );

      expect(
        GoogleCloud.ResourceDataAPI.requestResourceData,
      ).toHaveBeenCalledWith('cannabis', 1, 5000);
      expect(FileSystem.writeAsStringAsync).toHaveBeenCalled();
      expect(result.total).toBe(50);
    });

    it('API 호출 실패 후 재시도에 성공하면 정상적으로 캐시 및 반환해야 한다', async () => {
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({
        exists: false,
      });
      (GoogleCloud.ResourceDataAPI.requestResourceData as jest.Mock)
        .mockRejectedValueOnce(new Error('Temporary network error'))
        .mockResolvedValueOnce({
          resource: [{ ITEM_SEQ: 'retry_1' }],
          total: 10,
          totalPage: 1,
          current: 1,
        });

      const result = await databaseDownloadService.fetchAndCachePageData(
        'narcotics',
        1,
        2,
      );

      expect(
        GoogleCloud.ResourceDataAPI.requestResourceData,
      ).toHaveBeenCalledWith('narcotics', 1, 5000);
      expect(FileSystem.writeAsStringAsync).toHaveBeenCalled();
      expect(result.resource[0].ITEM_SEQ).toBe('retry_1');
    });

    it('여러 페이지를 병렬로 수신하고 콜백을 호출해야 한다', async () => {
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({
        exists: true,
        size: 100,
      });
      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(
        JSON.stringify({ resource: [], total: 10, totalPage: 3 }),
      );

      const onPageComplete = jest.fn();
      await databaseDownloadService.fetchAndCacheTablePagesInParallel(
        'pill_data',
        3,
        2,
        onPageComplete,
      );

      expect(onPageComplete).toHaveBeenCalledWith(2);
      expect(onPageComplete).toHaveBeenCalledWith(3);
    });
  });

  describe('verifyAllTablePagesCached', () => {
    it('모든 페이지가 존재하면 true를 반환해야 한다', async () => {
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({
        exists: true,
        size: 100,
      });
      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(
        JSON.stringify({ resource: [], total: 10, totalPage: 2 }),
      );

      const isValid = await databaseDownloadService.verifyAllTablePagesCached(
        'pill_data',
        2,
      );
      expect(isValid).toBe(true);
    });

    it('하나의 페이지라도 누락되면 false를 반환해야 한다', async () => {
      (FileSystem.getInfoAsync as jest.Mock)
        .mockResolvedValueOnce({ exists: true, size: 100 })
        .mockResolvedValueOnce({ exists: false });
      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValueOnce(
        JSON.stringify({ resource: [], total: 10, totalPage: 2 }),
      );

      const isValid = await databaseDownloadService.verifyAllTablePagesCached(
        'pill_data',
        2,
      );
      expect(isValid).toBe(false);
    });
  });

  describe('임시 파일 정리 및 상태 영속화', () => {
    it('임시 디렉토리가 존재하면 삭제해야 한다', async () => {
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({
        exists: true,
      });

      await databaseDownloadService.cleanTempCache();
      expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
        'file:///data/user/0/com.mbm.whatispill/files/db_updates/',
        { idempotent: true },
      );
    });

    it('상태를 AsyncStorage에 저장하고 로드할 수 있어야 한다', async () => {
      const mockState = {
        status: 'downloading' as const,
        tablesToUpdate: [],
        currentTableIndex: 0,
        currentTable: 'pill_data',
        currentPage: 1,
        totalPages: 5,
        overallProgress: 0.2,
        completedTables: [],
        lastUpdated: 12345,
      };

      await databaseDownloadService.saveUpdateState(mockState);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@db_update_persisted_state',
        JSON.stringify(mockState),
      );

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(mockState),
      );
      const loaded = await databaseDownloadService.loadUpdateState();
      expect(loaded).toEqual(mockState);

      await databaseDownloadService.clearUpdateState();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        '@db_update_persisted_state',
      );
    });
  });
});
