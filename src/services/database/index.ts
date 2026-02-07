import { SQLiteDatabase } from 'expo-sqlite';
import { getDatabase } from './sqlite';
import { IConfig, IPillData } from './types';
import { getSpecificConfig, updateSpecificConfig } from './queries/config';
import { DatabaseVersionAPI, PillDataResourceAPI } from '../apis/google_cloud';

const CREATE_CONFIG_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS config (
  \`key\` VARCHAR(255) PRIMARY KEY NOT NULL,
  \`value\` TEXT NULL DEFAULT NULL
)`;

const CREATE_PILL_DATA_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS pill_data (
  ITEM_SEQ VARCHAR(255) PRIMARY KEY NOT NULL,
  ITEM_NAME TEXT NOT NULL,
  ENTP_NAME TEXT,
  ENTP_SEQ TEXT,
  ITEM_PERMIT_DATE TEXT,
  ETC_OTC_CODE TEXT,
  CHART TEXT,
  BAR_CODE TEXT,
  MATERIAL_NAME TEXT,
  EE_DOC_DATA TEXT,
  UD_DOC_DATA TEXT,
  NB_DOC_DATA TEXT,
  VALID_TERM TEXT,
  STORAGE_METHOD TEXT,
  PACK_UNIT TEXT,
  MAIN_ITEM_INGR TEXT,
  INGR_NAME TEXT,
  ITEM_IMAGE TEXT,
  PRINT_FRONT TEXT,
  PRINT_BACK TEXT,
  DRUG_SHAPE TEXT,
  COLOR_CLASS1 TEXT,
  COLOR_CLASS2 TEXT,
  LINE_FRONT TEXT,
  LINE_BACK TEXT,
  IMG_REGIST_TS TEXT,
  CLASS_NAME TEXT,
  MARK_CODE_FRONT TEXT,
  MARK_CODE_BACK TEXT,
  FORM_CODE TEXT
)`;

const DEFAULT_CONFIG: IConfig[] = [
  { key: 'pillDataSchemaVersion', value: 0 },
  { key: 'pillDataResourceVersion', value: 0 },
];

/**
 * 환경설정 테이블 초기화
 * @param db 데이터베이스
 */
const initConfigTable = async (db: SQLiteDatabase) => {
  await db.execAsync(CREATE_CONFIG_TABLE_SQL);

  const sql = `INSERT OR IGNORE INTO config (\`key\`, \`value\`) VALUES
    ${DEFAULT_CONFIG.map(() => `(?, ?)`).join(', ')}`;

  await db.runAsync(
    sql,
    DEFAULT_CONFIG.flatMap(({ key, value }) => [key, value]),
  );
};

/**
 * 최신 PillData가 있는지 확인
 * @returns 최신 데이터 여부
 */
export const hasLatestPillData = async (): Promise<boolean> => {
  try {
    // 서버에서 최신 버전 정보 가져오기
    const versionInfo = await DatabaseVersionAPI.requestDatabaseVersion();
    const serverVersion = `${versionInfo.pill_data.schemaVersion}_${versionInfo.pill_data.dataVersion}`;

    const localVersion = await getSpecificConfig('pillDataResourceVersion');

    if (!localVersion || localVersion.value === 0) {
      return false;
    }

    return localVersion.value === serverVersion;
  } catch (error) {
    console.error('hasLatestPillData error:', error);
    return false;
  }
};

/**
 * PillData를 SQLite에 배치 삽입
 * @param db 데이터베이스
 * @param pillDataList pill data 배열
 */
const batchInsertPillData = async (
  db: SQLiteDatabase,
  pillDataList: IPillData[],
) => {
  if (!pillDataList || pillDataList.length === 0) {
    console.warn('batchInsertPillData: empty data list');
    return;
  }

  const columnNames = Object.keys(pillDataList[0]);
  const placeholders = columnNames.map(() => '?').join(', ');
  const sql = `INSERT OR REPLACE INTO pill_data (${columnNames.join(', ')})
               VALUES (${placeholders})`;

  for (const pillData of pillDataList) {
    try {
      const values = columnNames.map((key) => pillData[key as keyof IPillData]);
      await db.runAsync(sql, values);
    } catch (error) {
      console.error('Failed to insert pill data:', pillData.ITEM_SEQ, error);
      // 개별 항목 실패 시 계속 진행
    }
  }
};

export interface IUpdateProgress {
  status: string;
  progress: number;
  currentPage?: number;
  totalPages?: number;
}

/**
 * PillData 테이블 초기화 및 데이터 다운로드
 * @param db 데이터베이스
 * @param onProgress 프로그레스 콜백
 */
const initPillDataTable = async (
  db: SQLiteDatabase,
  onProgress?: (progress: IUpdateProgress) => void,
) => {
  // 테이블 생성
  await db.execAsync(CREATE_PILL_DATA_TABLE_SQL);

  // 최신 데이터 확인
  onProgress?.({ status: 'DB 버전 확인 중', progress: 0 });
  const isLatest = await hasLatestPillData(); // 최신 버전 확인

  if (isLatest) {
    console.log('PillData is up to date');
    onProgress?.({ status: 'DB 최신 상태', progress: 1 });
    return;
  }

  console.log('PillData update required - starting download');

  try {
    // 서버에서 최신 버전 정보 가져오기
    onProgress?.({ status: '서버 정보 확인 중', progress: 0 });
    // 서버 버전 조회
    const versionInfo = await DatabaseVersionAPI.requestDatabaseVersion();
    console.log('Version info:', versionInfo);
    const serverVersion = `${versionInfo.pill_data.schemaVersion}_${versionInfo.pill_data.dataVersion}`;

    // 기존 데이터 삭제
    onProgress?.({ status: '기존 데이터 삭제 중', progress: 0 });
    await db.execAsync('DELETE FROM pill_data');

    // 첫 페이지 조회 (total, totalPage 정보 얻기)
    let currentPage = 1;
    // 페이지별 데이터 다운로드
    const firstPageData =
      await PillDataResourceAPI.requestResourceData<IPillData>(
        'pill_data',
        currentPage,
      );

    // 응답 검증
    if (!firstPageData) {
      throw new Error(
        'Invalid API response: firstPageData is null or undefined',
      );
    }

    // API 응답에서 데이터 추출 (resource 필드 사용)
    const datas = firstPageData.resource;
    const total = firstPageData.total;
    const totalPage = firstPageData.totalPage;

    if (!datas || !Array.isArray(datas)) {
      console.error(
        '❌ Invalid response structure:',
        Object.keys(firstPageData || {}),
      );
      throw new Error(
        `Invalid API response: resource is missing or not an array`,
      );
    }

    console.log(
      `📦 Total pills: ${total}, Total pages: ${totalPage}, Items per page: ${datas.length}`,
    );

    // 첫 페이지 데이터 삽입
    if (datas && datas.length > 0) {
      await batchInsertPillData(db, datas);
      console.log(`Downloaded page 1/${totalPage} (${datas.length} items)`);
      onProgress?.({
        status: '약품 데이터 다운로드 중',
        progress: 1 / totalPage,
        currentPage: 1,
        totalPages: totalPage,
      });
    }

    // 나머지 페이지 다운로드
    for (currentPage = 2; currentPage <= totalPage; currentPage++) {
      const pageData = await PillDataResourceAPI.requestResourceData<IPillData>(
        'pill_data',
        currentPage,
      );

      if (!pageData || !pageData.resource) {
        console.warn(
          `⚠️ Page ${currentPage} has invalid response, skipping...`,
        );
        continue;
      }

      if (pageData.resource.length > 0) {
        await batchInsertPillData(db, pageData.resource);
        console.log(
          `📥 Downloaded page ${currentPage}/${totalPage} (${pageData.resource.length} items)`,
        );
      }

      onProgress?.({
        status: '약품 데이터 다운로드 중',
        progress: currentPage / totalPage,
        currentPage,
        totalPages: totalPage,
      });
    }

    // 버전 업데이트
    onProgress?.({ status: '버전 정보 업데이트 중', progress: 0.99 });
    await updateSpecificConfig('pillDataResourceVersion', serverVersion);

    console.log(`PillData download completed: ${total} items`);
    onProgress?.({ status: '다운로드 완료', progress: 1 });
  } catch (error) {
    console.error('PillData download failed:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    } else {
      console.error('Error details:', error);
    }
    throw error;
  }
};

/**
 * 데이터베이스 초기화
 * @param onProgress 프로그레스 콜백
 */
export const initDatabase = async (
  onProgress?: (progress: IUpdateProgress) => void,
) => {
  const db = await getDatabase();

  onProgress?.({ status: 'DB 초기화 중', progress: 0 });
  await initConfigTable(db); // config 테이블 초기화
  await initPillDataTable(db, onProgress); // PillData 테이블 초기화 및 다운로드

  // 전체 데이터 개수 확인
  const countResult = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM pill_data`,
  );
  console.log('✅ Total PillData count:', countResult?.count || 0);

  onProgress?.({ status: '초기화 완료', progress: 1 });
};
