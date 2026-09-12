import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TDataTable } from '@services/database/types';
import { GoogleCloud } from '@services/apis';
import logger from '@utils/logger';
import { ICachedPageData, IPersistedUpdateState } from '../types';
import { STORAGE_KEYS, DOWNLOAD_CONFIG, getTablePageLimit } from '../constants';

// 타임아웃이 적용된 프로미스 래퍼
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

// REST API로부터 페이지별 JSON 데이터를 백그라운드 세션으로 수신 및 임시 캐싱하는 서비스
export const databaseDownloadService = {
  // 임시 캐시 디렉토리 경로 반환
  getTempDirectory(): string {
    const baseDir = FileSystem.documentDirectory || FileSystem.cacheDirectory;
    return `${baseDir}db_updates/`;
  },

  // 임시 캐시 디렉토리 생성 및 준비
  async ensureTempDirectory(): Promise<string> {
    const dir = this.getTempDirectory();
    const dirInfo = await FileSystem.getInfoAsync(dir);
    const isDirectoryExisting: boolean = dirInfo.exists;

    if (!isDirectoryExisting) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
    return dir;
  },

  // 테이블 및 페이지별 임시 JSON 파일 경로 반환
  getPageFilePath(table: TDataTable, page: number): string {
    return `${this.getTempDirectory()}${table}_p${page}.json`;
  },

  // 파싱된 캐시 데이터의 구조 및 필드 유효성 검증
  validateCachedPayloadStructure(parsed: any): boolean {
    const hasValidResource: boolean = Array.isArray(parsed?.resource);
    const hasValidTotal: boolean = typeof parsed?.total === 'number';
    const hasValidTotalPage: boolean = typeof parsed?.totalPage === 'number';
    const isPayloadValid: boolean =
      hasValidResource && hasValidTotal && hasValidTotalPage;

    return isPayloadValid;
  },

  // 해당 페이지의 JSON 데이터가 이미 로컬에 올바르게 캐시되어 있는지 검증 (손상/불완전 파일 자동 감지 및 정리)
  async isPageDataCached(table: TDataTable, page: number): Promise<boolean> {
    const filePath = this.getPageFilePath(table, page);
    try {
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      const isFileExistingAndNotEmpty: boolean =
        fileInfo.exists && (fileInfo.size ?? 0) > 0;

      if (!isFileExistingAndNotEmpty) {
        return false;
      }

      // JSON 무결성 및 구조 유효성 검사 (깨진 파일 자동 감지)
      const content = await FileSystem.readAsStringAsync(filePath);
      const parsed = JSON.parse(content);
      const isPayloadValid: boolean =
        this.validateCachedPayloadStructure(parsed);

      if (!isPayloadValid) {
        await FileSystem.deleteAsync(filePath, { idempotent: true });
        return false;
      }

      return true;
    } catch {
      try {
        await FileSystem.deleteAsync(filePath, { idempotent: true });
      } catch {
        // ignore
      }
      return false;
    }
  },

  // 수신된 임시 JSON 파일의 데이터 구조 및 필드 유효성 검증
  async processDownloadedPayload(
    filePath: string,
    table: TDataTable,
    page: number,
  ): Promise<ICachedPageData> {
    const rawContent = await FileSystem.readAsStringAsync(filePath);
    const parsed = JSON.parse(rawContent) as ICachedPageData;

    const isPayloadValid: boolean = this.validateCachedPayloadStructure(parsed);
    if (!isPayloadValid) {
      try {
        await FileSystem.deleteAsync(filePath, { idempotent: true });
      } catch {
        // ignore
      }
      throw new Error(
        `Invalid JSON structure in response for ${table} page ${page}`,
      );
    }

    return parsed;
  },

  // 다운로드 시도 실패 시 임시 파일 정리 및 재시도 대기 처리
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

  // REST API 응답 JSON 데이터를 수신하여 임시 파일로 캐싱 (실패 시 지연 재시도)
  async fetchAndCachePageData(
    table: TDataTable,
    page: number,
    retries = DOWNLOAD_CONFIG.MAX_RETRY_COUNT,
  ): Promise<ICachedPageData> {
    await this.ensureTempDirectory();
    const filePath = this.getPageFilePath(table, page);

    // 이미 유효한 캐시 파일이 존재하면 네트워크 요청 생략
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
            getTablePageLimit(table),
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

  // 특정 테이블의 여러 페이지를 최적의 동시성 풀(Worker Pool)로 제어하여 수신 (소켓 정체 및 타임아웃 방지)
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

  // 캐시된 페이지 JSON 파일 데이터 읽기 (손상 시 자동 재수신 복구)
  async readCachedPageData(
    table: TDataTable,
    page: number,
  ): Promise<ICachedPageData> {
    const filePath = this.getPageFilePath(table, page);
    try {
      const content = await FileSystem.readAsStringAsync(filePath);
      const parsed = JSON.parse(content) as ICachedPageData;
      const isPayloadValid: boolean =
        this.validateCachedPayloadStructure(parsed);

      if (isPayloadValid) {
        return parsed;
      }
    } catch {
      // 파일 손상 시 삭제 후 재수신
      try {
        await FileSystem.deleteAsync(filePath, { idempotent: true });
      } catch {
        // ignore
      }
    }

    return this.fetchAndCachePageData(table, page);
  },

  // 테이블의 모든 페이지 데이터가 정상적으로 캐시되었는지 검증
  async verifyAllTablePagesCached(
    table: TDataTable,
    totalPages: number,
  ): Promise<boolean> {
    for (let page = 1; page <= totalPages; page++) {
      const isPageValid: boolean = await this.isPageDataCached(table, page);
      if (!isPageValid) {
        return false;
      }
    }
    return true;
  },

  // 임시 캐시 파일 디렉토리 전체 삭제
  async cleanTempCache(): Promise<void> {
    try {
      const dir = this.getTempDirectory();
      const dirInfo = await FileSystem.getInfoAsync(dir);
      const isDirExisting: boolean = dirInfo.exists;

      if (isDirExisting) {
        await FileSystem.deleteAsync(dir, { idempotent: true });
      }
    } catch (error) {
      logger.warn(
        `[CLEANUP-TEMP] Failed to delete temp cache directory: ${(error as Error).message}`,
      );
    }
  },

  // 영속 업데이트 상태 저장
  async saveUpdateState(state: IPersistedUpdateState): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.UPDATE_STATE,
        JSON.stringify(state),
      );
    } catch (error) {
      logger.warn(
        `[SAVE-STATE] Failed to persist state: ${(error as Error).message}`,
      );
    }
  },

  // 영속 업데이트 상태 로드
  async loadUpdateState(): Promise<IPersistedUpdateState | null> {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEYS.UPDATE_STATE);
      const hasStoredJson: boolean = Boolean(json);
      if (!hasStoredJson) return null;
      return JSON.parse(json!) as IPersistedUpdateState;
    } catch (error) {
      logger.warn(
        `[LOAD-STATE] Failed to load persisted state: ${(error as Error).message}`,
      );
      return null;
    }
  },

  // 영속 업데이트 상태 삭제
  async clearUpdateState(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.UPDATE_STATE);
    } catch (error) {
      logger.warn(
        `[CLEAR-STATE] Failed to clear persisted state: ${(error as Error).message}`,
      );
    }
  },
};
