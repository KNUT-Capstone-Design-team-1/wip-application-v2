import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { initDatabase } from '../src/services/database';
import Layout from '../src/layouts/Layout';
import { logger } from '../src/utils';
import UpdateDB from './UpdateDB';
import { DatabaseUpdateService } from '../src/services';
import {
  DATABSE_UPDATE_RESULT_CODE,
  TDataTable,
} from '../src/services/database/types';

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
const updateDataTable = async (
  table: TDataTable,
): Promise<DATABSE_UPDATE_RESULT_CODE> => {
  // 데이터베이스 업데이트 필요 여부 체크
  const checkResult =
    await DatabaseUpdateService.checkRequireTableUpdate(table);

  const requireUpdate = checkResult === 'REQUIRE-UPDATE';
  if (!requireUpdate) {
    return 'NO-UPDATED';
  }

  // 테이블 초기화
  const result = await DatabaseUpdateService.initTable(table);

  if (result !== 'OK') {
    return result;
  }

  // 테이블에 최신 데이터 반영
  const insertResult = await DatabaseUpdateService.insertData(table);

  return insertResult;
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

  const updatePromises = targetTables.map((table) => updateDataTable(table));

  // 테이블 별 비동기 처리 (겹치지 않으므로)
  return Promise.all(updatePromises);
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

      await updateAllDataTables(); // for test
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
