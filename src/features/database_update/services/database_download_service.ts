import * as FileSystem from 'expo-file-system/legacy';
import { TDataTable } from '@services/database/types';
import { GoogleCloud } from '@services/apis';
import logger from '@utils/logger';
import { ICachedPageData, IPersistedUpdateState } from '../types';
import { DOWNLOAD_CONFIG } from '../constants';
import { databaseFileCache } from './download/database_file_cache';
import { databaseStateStorage } from './download/database_state_storage';

// 타임아웃 래퍼 유틸
const withTimeout = <T>(
  promise: Promise<T>,
  ms: number,
  errorMessage: string,
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), ms),
    ),
  ]);
};

// REST API 데이터 수신, 파일 캐싱 및 상태 영속화 통합 서비스
export const databaseDownloadService = {
  // === 파일 시스템 캐시 위임 메서드 ===
  getTempDirectory(): string {
    return databaseFileCache.getTempDirectory();
  },

  ensureTempDirectory(): Promise<string> {
    return databaseFileCache.ensureTempDirectory();
  },

  getPageFilePath(table: TDataTable, page: number): string {
    return databaseFileCache.getPageFilePath(table, page);
  },

  validateCachedPayloadStructure(parsed: unknown): boolean {
    return databaseFileCache.validatePayloadStructure(parsed);
  },

  isPageDataCached(table: TDataTable, page: number): Promise<boolean> {
    return databaseFileCache.isPageDataCached(table, page);
  },

  async readCachedPageData(
    table: TDataTable,
    page: number,
  ): Promise<ICachedPageData> {
    const cached = await databaseFileCache.readCachedPageData(table, page);
    if (cached) {
      return cached;
    }
    return this.fetchAndCachePageData(table, page);
  },

  verifyAllTablePagesCached(
    table: TDataTable,
    totalPages: number,
  ): Promise<boolean> {
    return databaseFileCache.verifyAllTablePagesCached(table, totalPages);
  },

  cleanTempCache(): Promise<void> {
    return databaseFileCache.cleanTempCache();
  },

  // === 상태 영속화(AsyncStorage) 위임 메서드 ===
  saveUpdateState(state: IPersistedUpdateState): Promise<void> {
    return databaseStateStorage.saveUpdateState(state);
  },

  loadUpdateState(): Promise<IPersistedUpdateState | null> {
    return databaseStateStorage.loadUpdateState();
  },

  clearUpdateState(): Promise<void> {
    return databaseStateStorage.clearUpdateState();
  },

  // === 네트워크 다운로드 및 워커 풀 로직 ===

  // 다운로드 실패 시 재시도 핸들러
  async handleDownloadAttemptError(
    err: unknown,
    filePath: string,
    table: TDataTable,
    page: number,
    attempt: number,
    retries: number,
  ): Promise<void> {
    const lastError = err as Error;
    logger.warn(
      `[FETCH-RETRY] Attempt ${attempt}/${retries} failed for ${table} p${page}: ${lastError.message}`,
    );

    try {
      await FileSystem.deleteAsync(filePath, { idempotent: true });
    } catch {
      // ignore
    }

    const hasRetryAttemptsLeft: boolean = attempt < retries;
    if (hasRetryAttemptsLeft) {
      await new Promise((res) =>
        setTimeout(res, DOWNLOAD_CONFIG.RETRY_DELAY_MS * attempt),
      );
    }
  },

  // 단일 페이지 데이터 수신 및 로컬 캐싱 (실패 시 지연 재시도)
  async fetchAndCachePageData(
    table: TDataTable,
    page: number,
    retries = DOWNLOAD_CONFIG.MAX_RETRY_COUNT,
  ): Promise<ICachedPageData> {
    await this.ensureTempDirectory();
    const filePath = this.getPageFilePath(table, page);

    // 이미 유효한 캐시 파일이 있으면 네트워크 요청 생략
    const isCacheValid: boolean = await this.isPageDataCached(table, page);
    if (isCacheValid) {
      return this.readCachedPageData(table, page);
    }

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await withTimeout(
          GoogleCloud.ResourceDataAPI.requestResourceData(
            table,
            page,
            DOWNLOAD_CONFIG.PAGE_LIMIT,
          ),
          DOWNLOAD_CONFIG.DOWNLOAD_TIMEOUT_MS,
          `Request timeout after ${DOWNLOAD_CONFIG.DOWNLOAD_TIMEOUT_MS}ms for ${table} p${page}`,
        );

        const isPayloadValid: boolean =
          this.validateCachedPayloadStructure(response);

        if (isPayloadValid) {
          await FileSystem.writeAsStringAsync(
            filePath,
            JSON.stringify(response),
          );
          return response as ICachedPageData;
        }

        throw new Error(
          `Invalid JSON structure in response for ${table} page ${page}`,
        );
      } catch (err) {
        lastError = err as Error;
        await this.handleDownloadAttemptError(
          err,
          filePath,
          table,
          page,
          attempt,
          retries,
        );
      }
    }

    throw (
      lastError || new Error(`Failed to fetch and cache ${table} page ${page}`)
    );
  },

  // 워커 풀(Worker Pool)을 이용한 여러 페이지 병렬 다운로드
  async fetchAndCacheTablePagesInParallel(
    table: TDataTable,
    totalPages: number,
    startPage = 2,
    onPageComplete?: (completedPage: number) => void,
  ): Promise<void> {
    const pageNumbers: number[] = [];
    for (let page = startPage; page <= totalPages; page++) {
      pageNumbers.push(page);
    }

    const concurrency: number = DOWNLOAD_CONFIG.MAX_CONCURRENT_DOWNLOADS;
    let nextIndex: number = 0;

    const worker = async (): Promise<void> => {
      while (nextIndex < pageNumbers.length) {
        const currentIndex = nextIndex++;
        const page = pageNumbers[currentIndex];
        await this.fetchAndCachePageData(table, page);
        onPageComplete?.(page);
      }
    };

    const workers: Promise<void>[] = [];
    const activeWorkersCount = Math.min(concurrency, pageNumbers.length);
    for (let i = 0; i < activeWorkersCount; i++) {
      workers.push(worker());
    }

    await Promise.all(workers);
  },
};
