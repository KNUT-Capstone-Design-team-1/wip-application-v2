import { initDatabase } from '@services/database';
import { logger } from '../utils';
import { TDataTable } from '@services/database/types';
import { DatabaseUpdateService } from '@services/index';
import { requestExternalURL } from '@services/apis/google_cloud/wip_external_url';
import { useExternalUrlStore } from '@store/external_url_store';

const DATABASE_INIT_STATUS = {
  COMPLETE: '완료',
} as const;

const TABLE_NAME_MAP: Record<TDataTable, string> = {
  pill_data: '알약 정보',
  mark_images: '알약 마크',
  nearby_pharmacies: '주변 약국',
  cannabis: '대마 정보',
  narcotics: '마약 정보',
  psychotropics: '향정신성 의약품 정보',
  prohibited_list: '금지 약물 정보',
};

export const useAppInitializer = () => {
  const initializeDataBase = async (
    setUpdateProgress: (progress: any) => void,
    setIsInitializing: (isInitializing: boolean) => void,
  ) => {
    try {
      // 외부 URL 정보 가져오기
      setUpdateProgress({
        status: '외부 설정 정보 로드 중',
        progress: 0,
      });
      try {
        const externalUrls = await requestExternalURL();
        useExternalUrlStore.getState().setUrls(externalUrls);
        console.log('✅ 외부 URL 로드 완료:', externalUrls);
      } catch (urlError) {
        logger.error(
          `Failed to fetch external URLs. Using defaults. error: ${urlError}`,
        );
      }

      // 데이터베이스 초기화
      setUpdateProgress({
        status: 'DB 초기화 중',
        progress: 0.05,
      });

      const result = await initDatabase();

      if (!result) {
        throw new Error('Database initialization failed');
      }

      // 모든 데이터 테이블 업데이트
      await updateAllDataTables(setUpdateProgress);

      // 완료 상태
      setUpdateProgress({
        status: DATABASE_INIT_STATUS.COMPLETE,
        progress: 1,
      });

      // 초기화 완료 후 잠시 대기
      setTimeout(() => {
        setIsInitializing(false);
      }, 500);
    } catch (error) {
      logger.error(`Failed to init Database. error: ${error}`);
      setUpdateProgress({
        status: '데이터베이스 초기화 실패',
        progress: 0,
      });
      setIsInitializing(false);
    }
  };

  const updateAllDataTables = async (
    setUpdateProgress: (progress: any) => void,
  ) => {
    const targetTables: TDataTable[] = [
      'pill_data',
      'mark_images',
      'nearby_pharmacies',
      'cannabis',
      'narcotics',
      'psychotropics',
      'prohibited_list',
    ];

    for (let i = 0; i < targetTables.length; i += 1) {
      const table = targetTables[i];

      // 데이터 테이블 업데이트 시켜주기
      await dataTableUpdate(
        table,
        setUpdateProgress,
        i + 1,
        targetTables.length,
      );
    }
    console.log(`COMPLETE UPDATE ALL TABLE`);
  };

  /**
   * 데이터 테이블 업데이트
   * @param table - 업데이트할 테이블명
   * @param setUpdateProgress - 진행률 업데이트 함수
   * @param currentTableIndex - 현재 테이블 인덱스 (1부터 시작)
   * @param totalTables - 전체 테이블 개수
   */
  const dataTableUpdate = async (
    table: TDataTable,
    setUpdateProgress: (progress: any) => void,
    currentTableIndex: number,
    totalTables: number,
  ) => {
    console.log(`UPDATE TO ${table} table`);

    // 데이터베이스 업데이트 필요 여부 체크
    const checkResult =
      await DatabaseUpdateService.checkRequireTableUpdate(table);

    if (checkResult.code !== 'REQUIRE-UPDATE') {
      console.log(`NO-UPDATED ${table}`);
      // 바로 넘어가게 처리
      return;
    }

    // 테이블 초기화
    setUpdateProgress({
      status: `${TABLE_NAME_MAP[table]} 테이블 초기화 중`,
      progress: (currentTableIndex - 1) / totalTables,
    });

    const result = await DatabaseUpdateService.initTable(table);

    if (result !== 'OK') {
      console.log(`INIT-FAILED ${table}`);
      // UI에 실패를 알림
      return;
    }

    // 테이블 INSERT
    let currentPage = 1;
    let totalPage = 1;

    do {
      const insertResult = await DatabaseUpdateService.insertData(
        currentPage,
        table,
      );

      if (insertResult.code !== 'OK') {
        console.log(`INSERT-FAILED ${table}`);
        break;
      }

      totalPage = insertResult.totalPage;

      // 진행률 업데이트
      const tableProgress = currentPage / totalPage;
      const overallProgress =
        (currentTableIndex - 1 + tableProgress) / totalTables;

      setUpdateProgress({
        status: `${TABLE_NAME_MAP[table]} 데이터 다운로드 중`,
        progress: overallProgress,
        currentPage,
        totalPages: totalPage,
      });

      currentPage++;
    } while (currentPage <= totalPage);

    const { newSchemaVersion, newDataVersion } = checkResult;

    // config 테이블에 데이터베이스 버전 업데이트
    await DatabaseUpdateService.updateDatabaseVersion(
      table,
      newSchemaVersion,
      newDataVersion,
    );

    // progress 100%로 처리
    console.log(`UPDATE COMPLETE ${table}`);
  };

  return {
    initializeDataBase,
  };
};
