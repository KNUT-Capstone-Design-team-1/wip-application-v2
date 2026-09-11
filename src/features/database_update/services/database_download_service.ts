import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TDataTable } from '@services/database/types';
import { GoogleCloud } from '@services/apis';
import { getToken } from '@services/apis/google_cloud/google_cloud_token';
import logger from '@utils/logger';
import { ICachedPageData, IPersistedUpdateState } from '../types';
import { databaseEncryptionService } from './database_encryption_service';

const STORAGE_KEY_UPDATE_STATE = '@db_update_persisted_state';
const MAX_RETRY_COUNT = 3;
const RETRY_DELAY_MS = 500;

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

  // REST API 엔드포인트 URL 생성 (테이블 및 페이지 파라미터 포함)
  getResourceApiUrl(table: TDataTable, page: number): string {
    const baseUrl = process.env
      .EXPO_PUBLIC_GOOGLE_CLOUD_PLATFORM_WIP_RESOURCE_DATA_URL as string;
    return `${baseUrl}?table=${encodeURIComponent(table)}&page=${page}`;
  },

  // 호환성을 위한 alias
  getDownloadUrl(table: TDataTable, page: number): string {
    return this.getResourceApiUrl(table, page);
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

  // 해당 페이지의 JSON 데이터가 이미 로컬에 올바르게 캐시되어 있는지 검증
  async isPageDataCached(table: TDataTable, page: number): Promise<boolean> {
    const filePath = this.getPageFilePath(table, page);
    try {
      const fileInfo = await FileSystem.getInfoAsync(filePath);

      if (!fileInfo.exists || fileInfo.size === 0) {
        return false;
      }

      const content =
        await databaseEncryptionService.readAndDecryptFile(filePath);
      const parsed = JSON.parse(content) as ICachedPageData;

      const isJsonValid: boolean = this.validateCachedPayloadStructure(parsed);
      return isJsonValid;
    } catch {
      return false;
    }
  },

  // 호환성을 위한 alias
  async isPageDownloaded(table: TDataTable, page: number): Promise<boolean> {
    return this.isPageDataCached(table, page);
  },

  // 수신된 임시 JSON 파일의 AES-256 암호화 변환 및 데이터 파싱 검증
  async processAndEncryptDownloadedPayload(
    filePath: string,
    table: TDataTable,
    page: number,
  ): Promise<ICachedPageData> {
    await databaseEncryptionService.encryptFile(filePath);

    const content =
      await databaseEncryptionService.readAndDecryptFile(filePath);
    const parsed = JSON.parse(content) as ICachedPageData;

    const isPayloadValid: boolean = this.validateCachedPayloadStructure(parsed);
    if (!isPayloadValid) {
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
      await new Promise((res) => setTimeout(res, RETRY_DELAY_MS * attempt));
    }
  },

  // 백그라운드 세션 실패 시 axios 직접 호출을 통한 fallback 수신 및 암호화 저장
  async executeDirectAxiosFallback(
    table: TDataTable,
    page: number,
    filePath: string,
  ): Promise<ICachedPageData> {
    try {
      logger.warn(
        `[FETCH-FALLBACK] Attempting direct axios fetch for ${table} p${page}`,
      );
      const fallbackResponse =
        await GoogleCloud.ResourceDataAPI.requestResourceData(table, page);
      const hasValidFallback: boolean = Boolean(
        fallbackResponse?.resource && fallbackResponse.totalPage,
      );

      if (hasValidFallback) {
        const encrypted = await databaseEncryptionService.encrypt(
          JSON.stringify(fallbackResponse),
        );
        await FileSystem.writeAsStringAsync(filePath, encrypted);
        return fallbackResponse as ICachedPageData;
      }
    } catch (fallbackErr) {
      logger.error(
        `[FETCH-FALLBACK] Fallback failed for ${table} p${page}: ${(fallbackErr as Error).message}`,
      );
    }

    throw new Error(`Failed to fetch and cache ${table} page ${page}`);
  },

  // REST API 응답 JSON을 네이티브 백그라운드 세션으로 파일에 캐싱 (실패 시 지연 재시도)
  async fetchAndCachePageData(
    table: TDataTable,
    page: number,
    retries = MAX_RETRY_COUNT,
  ): Promise<ICachedPageData> {
    await this.ensureTempDirectory();
    const filePath = this.getPageFilePath(table, page);

    // 이미 유효한 캐시 파일이 존재하면 네트워크 요청 생략
    const isCacheValid: boolean = await this.isPageDataCached(table, page);
    if (isCacheValid) {
      return this.readCachedPageData(table, page);
    }

    let lastError: Error | null = null;
    const url = this.getResourceApiUrl(table, page);

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const token = getToken();
        const headers: Record<string, string> = {
          Authorization: `Bearer ${token}`,
        };

        // 네이티브 백그라운드 세션을 통해 API 응답 본문을 파일로 직접 수신
        const result = await FileSystem.downloadAsync(url, filePath, {
          headers,
          sessionType: FileSystem.FileSystemSessionType.BACKGROUND,
        });

        const isHttpSuccess: boolean =
          result.status >= 200 && result.status < 300;

        if (isHttpSuccess) {
          return await this.processAndEncryptDownloadedPayload(
            filePath,
            table,
            page,
          );
        }

        throw new Error(
          `HTTP ${result.status} while fetching ${table} page ${page}`,
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

    return this.executeDirectAxiosFallback(table, page, filePath).catch(() => {
      throw (
        lastError ||
        new Error(`Failed to fetch and cache ${table} page ${page}`)
      );
    });
  },

  // 특정 테이블의 여러 페이지를 병렬로 즉시 네이티브 다운로드 큐에 디스패치하여 수신
  async fetchAndCacheTablePagesInParallel(
    table: TDataTable,
    totalPages: number,
    startPage = 2,
    onPageComplete?: (completedPage: number) => void,
  ): Promise<void> {
    const pagePromises: Promise<ICachedPageData>[] = [];

    for (let page = startPage; page <= totalPages; page++) {
      const pagePromise = this.fetchAndCachePageData(table, page).then(
        (data) => {
          onPageComplete?.(page);
          return data;
        },
      );
      pagePromises.push(pagePromise);
    }

    await Promise.all(pagePromises);
  },

  // 호환성을 위한 alias
  async downloadPageWithRetry(
    table: TDataTable,
    page: number,
    retries = MAX_RETRY_COUNT,
  ): Promise<ICachedPageData> {
    return this.fetchAndCachePageData(table, page, retries);
  },

  // 캐시된 페이지 JSON 파일 데이터 복호화 및 읽기
  async readCachedPageData(
    table: TDataTable,
    page: number,
  ): Promise<ICachedPageData> {
    const filePath = this.getPageFilePath(table, page);
    const content =
      await databaseEncryptionService.readAndDecryptFile(filePath);
    return JSON.parse(content) as ICachedPageData;
  },

  // 호환성을 위한 alias
  async readDownloadedPage(
    table: TDataTable,
    page: number,
  ): Promise<ICachedPageData> {
    return this.readCachedPageData(table, page);
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

  // 호환성을 위한 alias
  async verifyAllTablePagesDownloaded(
    table: TDataTable,
    totalPages: number,
  ): Promise<boolean> {
    return this.verifyAllTablePagesCached(table, totalPages);
  },

  // 임시 캐시 파일 및 암호화 키 전체 삭제
  async cleanTempCache(): Promise<void> {
    try {
      const dir = this.getTempDirectory();
      const dirInfo = await FileSystem.getInfoAsync(dir);
      const isDirExisting: boolean = dirInfo.exists;

      if (isDirExisting) {
        await FileSystem.deleteAsync(dir, { idempotent: true });
      }
      await databaseEncryptionService.clearKey();
    } catch (error) {
      logger.warn(
        `[CLEANUP-TEMP] Failed to delete temp cache directory: ${(error as Error).message}`,
      );
    }
  },

  // 호환성을 위한 alias
  async cleanTempFiles(): Promise<void> {
    return this.cleanTempCache();
  },

  // 영속 업데이트 상태 저장
  async saveUpdateState(state: IPersistedUpdateState): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY_UPDATE_STATE,
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
      const json = await AsyncStorage.getItem(STORAGE_KEY_UPDATE_STATE);
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
      await AsyncStorage.removeItem(STORAGE_KEY_UPDATE_STATE);
    } catch (error) {
      logger.warn(
        `[CLEAR-STATE] Failed to clear persisted state: ${(error as Error).message}`,
      );
    }
  },
};
