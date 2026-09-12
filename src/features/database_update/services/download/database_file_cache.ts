import * as FileSystem from 'expo-file-system/legacy';
import { TDataTable } from '@services/database/types';
import logger from '@utils/logger';
import { ICachedPageData } from '../../types';

// 로컬 파일 시스템 캐시 관리 서비스
export const databaseFileCache = {
  // 임시 캐시 디렉토리 경로 반환
  getTempDirectory(): string {
    const baseDir = FileSystem.documentDirectory || FileSystem.cacheDirectory;
    return `${baseDir}db_updates/`;
  },

  // 임시 캐시 디렉토리 생성 및 보장
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

  // 캐시된 페이로드 구조 무결성 검증
  validatePayloadStructure(parsed: unknown): boolean {
    const data = parsed as Record<string, unknown> | null;
    const hasValidResource: boolean = Array.isArray(data?.resource);
    const hasValidTotal: boolean = typeof data?.total === 'number';
    const hasValidTotalPage: boolean = typeof data?.totalPage === 'number';

    return hasValidResource && hasValidTotal && hasValidTotalPage;
  },

  // 해당 페이지의 JSON 데이터가 올바르게 캐시되어 있는지 검증 (손상 파일 자동 삭제)
  async isPageDataCached(table: TDataTable, page: number): Promise<boolean> {
    const filePath = this.getPageFilePath(table, page);
    try {
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      const isFileExistingAndNotEmpty: boolean =
        fileInfo.exists && (fileInfo.size ?? 0) > 0;

      if (!isFileExistingAndNotEmpty) {
        return false;
      }

      const content = await FileSystem.readAsStringAsync(filePath);
      const parsed = JSON.parse(content);
      const isValid: boolean = this.validatePayloadStructure(parsed);

      if (!isValid) {
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

  // 캐시된 페이지 파일 데이터 읽기
  async readCachedPageData(
    table: TDataTable,
    page: number,
  ): Promise<ICachedPageData | null> {
    const filePath = this.getPageFilePath(table, page);
    try {
      const content = await FileSystem.readAsStringAsync(filePath);
      const parsed = JSON.parse(content) as ICachedPageData;
      const isValid: boolean = this.validatePayloadStructure(parsed);

      if (isValid) {
        return parsed;
      }

      await FileSystem.deleteAsync(filePath, { idempotent: true });
      return null;
    } catch {
      try {
        await FileSystem.deleteAsync(filePath, { idempotent: true });
      } catch {
        // ignore
      }
      return null;
    }
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

  // 임시 캐시 디렉토리 전체 삭제
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
};
