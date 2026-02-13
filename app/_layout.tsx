import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { initDatabase } from '../src/services/database';
import Layout from '../src/layouts/Layout';
import { logger } from '../src/utils';
import UpdateDB from './UpdateDB';
import { DatabaseUpdateService } from '../src/services';
import { TDataTable } from '../src/services/database/types';
import {
  MarkImagesQuery,
  NearbyPharmaciesQuery,
  PillDataQuery,
} from '@/src/services/database/queries';

// FIXME 커스텀 훅으로 옮기고 useEffect를 커스텀 훅으로 대체해야한다
export interface IUpdateProgress {
  status: string;
  progress: number;
  currentPage?: number;
  totalPages?: number;
}

const DATABASE_INIT_STATUS = {
  COMPLETE: 'COMPLETE',
} as const;

// for test

/**
 * 데이터 테이블 업데이트
 * @returns
 */
const hook = async (table: TDataTable) => {
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
    currentPage++;

    // 여기서 progress 업데이트
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

/**
 * 모든 데이터 테이블 업데이트
 */
const updateAllDataTables = async () => {
  const targetTables: TDataTable[] = [
    'pill_data',
    'mark_images',
    'nearby_pharmacies',
  ];

  for (let i = 0; i < targetTables.length; i += 1) {
    const table = targetTables[i];

    await hook(table);
  }
  console.log(`COMPLETE UPDATE ALL TABLE`);

  console.log(await MarkImagesQuery.getMarkImages({}, { page: 0, limit: 1 }));
  console.log(
    await NearbyPharmaciesQuery.getNearbyPharmacies({}, { page: 0, limit: 1 }),
  );
  console.log(await PillDataQuery.getPillDatas({}, { page: 0, limit: 1 }));
};

/**
 * 전역 스크린 옵션
 * @returns
 */
const RootLayout = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [updateProgress, setUpdateProgress] = useState<any>({
    status: 'DB 초기화 중',
    progress: 0,
  });

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const result = await initDatabase();

        if (result) {
          setUpdateProgress({
            status: DATABASE_INIT_STATUS.COMPLETE,
            progress: 1,
          });
        }

        // 초기화 완료 후 잠시 대기
        setTimeout(() => {
          setIsInitializing(false);
        }, 500);
      } catch (error) {
        logger.error(`Failed to init Database. error: ${error}`);
        setIsInitializing(false);
      }

      await updateAllDataTables(); // 이 함수는 커스텀 훅이 되어야 한다
    };

    initializeDatabase();
  }, []);

  // 초기화 중이면 로딩 화면 표시
  if (isInitializing) {
    return (
      <SafeAreaProvider>
        <UpdateDB
          status={updateProgress.status}
          progress={updateProgress.progress}
          currentPage={updateProgress.currentPage}
          totalPages={updateProgress.totalPages}
        />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <Layout>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ title: '홈' }} />
        </Stack>
      </Layout>
    </SafeAreaProvider>
  );
};

export default RootLayout;
