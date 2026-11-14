import { TDataTable } from '@services/database/types';
import logger from '@utils/logger';
import { databaseUpdateRepository } from '../../data/repositories/database_update_repository';
import { DOWNLOAD_CONFIG } from '../../constants';
import {
  ICachedPageData,
  IUpdateNeeded,
  ISyncPipelineCallbacks,
} from '../../types';
import { databaseDownloadService } from '../database_download_service';
import { databaseUpdateService } from '../database_update_service';

type PageResult =
  { data: ICachedPageData; error?: never } | { data?: never; error: unknown };

// 다운로드 창을 제한해 DB가 느려도 페이지가 메모리에 계속 쌓이지 않게 한다.
export const executeStreamingPhase = async (
  tables: IUpdateNeeded[],
  currentTableIndexRef: React.RefObject<number>,
  isCancelled: () => boolean,
  callbacks: ISyncPipelineCallbacks,
): Promise<void> => {
  for (let index = 0; index < tables.length; index++) {
    if (isCancelled()) return;
    const update = tables[index];
    const table = update.table as TDataTable;
    const startedAt = Date.now();
    currentTableIndexRef.current = index;
    callbacks.setUpdateCurrentTable(table);
    callbacks.setUpdateStatus('downloading');
    callbacks.setUpdateProgress({
      status: '데이터를 받아 기기에 적용하는 중...',
      progress: index / tables.length,
      isUpdating: true,
    });

    const first = await databaseDownloadService.fetchAndCachePageData(table, 1);
    if (isCancelled()) return;
    const totalPages = first.totalPage || 1;
    callbacks.setTotalPages(totalPages);
    const pending = new Map<number, Promise<PageResult>>();
    let nextPage = 2;
    const fillWindow = () => {
      while (
        !isCancelled() &&
        nextPage <= totalPages &&
        pending.size < DOWNLOAD_CONFIG.MAX_CONCURRENT_DOWNLOADS
      ) {
        const page = nextPage++;
        // 실패도 값으로 보관해 앞 페이지를 삽입하는 동안 unhandled rejection을 방지한다.
        pending.set(
          page,
          databaseDownloadService.fetchAndCachePageData(table, page).then(
            (data): PageResult => ({ data }),
            (error): PageResult => ({ error }),
          ),
        );
      }
    };

    let waitMs = 0;
    let insertMs = 0;
    let lastSavedAt = 0;
    const saveProgress = async (page: number, progress: number) => {
      await databaseDownloadService.saveUpdateState({
        status: 'installing',
        tablesToUpdate: tables,
        currentTableIndex: index,
        currentTable: table,
        currentPage: page,
        totalPages,
        overallProgress: progress,
        completedTables: tables.slice(0, index).map((item) => item.table),
        lastUpdated: Date.now(),
      });
      lastSavedAt = Date.now();
    };
    try {
      fillWindow();
      // 테이블을 교체하기 전에 중단 복구 표시를 반드시 저장한다.
      await saveProgress(0, index / tables.length);
      if (isCancelled()) return;
      const initResult = await databaseUpdateService.initTable(table);
      if (initResult !== 'OK')
        throw new Error(`Failed to init ${table}: ${initResult}`);
      const initializedAt = Date.now();
      callbacks.setUpdateStatus('installing');
      for (let page = 1; page <= totalPages; page++) {
        if (isCancelled()) return;
        const waitStartedAt = Date.now();
        let data = first;
        if (page > 1) {
          const result = await pending.get(page)!;
          pending.delete(page);
          if ('error' in result) throw result.error;
          data = result.data;
          fillWindow();
        }
        if (isCancelled()) return;
        waitMs += Date.now() - waitStartedAt;
        const insertStartedAt = Date.now();
        if (data.resource.length) {
          await databaseUpdateRepository.insertData(table, data.resource);
        }
        insertMs += Date.now() - insertStartedAt;
        const progress = (index + (page / totalPages) * 0.9) / tables.length;
        callbacks.setUpdateCurrentPage(page);
        callbacks.setOverallProgress(progress);
        callbacks.setUpdateProgress({
          status: '데이터를 받아 기기에 적용하는 중...',
          progress,
          isUpdating: true,
        });
        if (page === totalPages || Date.now() - lastSavedAt >= 1000) {
          await saveProgress(page, progress);
        }
      }
      if (isCancelled()) return;
      callbacks.setUpdateProgress({
        status: '검색을 준비하는 중...',
        progress: (index + 0.9) / tables.length,
        isUpdating: true,
      });
      const indexStartedAt = Date.now();
      await databaseUpdateRepository.initTableIndexes(table);
      const indexMs = Date.now() - indexStartedAt;
      await databaseUpdateService.verifyInsertedRowCount(table, first.total);
      if (isCancelled()) return;
      const versionResult = await databaseUpdateService.updateDatabaseVersion(
        table,
        update.schemaVer,
        update.dataVer,
      );
      if (versionResult !== 'OK')
        throw new Error(`Failed to update version for ${table}`);
      callbacks.setOverallProgress((index + 1) / tables.length);
      logger.info(
        `[STREAM-DB] ${table}: total=${Date.now() - startedAt}ms, prepare=${initializedAt - startedAt}ms, wait=${waitMs}ms, insert=${insertMs}ms, indexes=${indexMs}ms`,
      );
    } finally {
      // 취소/실패해도 진행 중인 파일 쓰기가 끝난 뒤 캐시 정리 또는 재시도를 허용한다.
      await Promise.all(pending.values());
    }
  }
};
