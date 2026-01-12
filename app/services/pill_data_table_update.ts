import { ConfigQuery, PillDataQuery } from '../database/queries';
import { GoogleCloud } from '../apis';

type CODE =
  | 'OK'
  | 'NO-UPDATED'
  | 'REQUIRE-UPDATE'
  | 'UNNECESSARY-UPDATE'
  | 'ERROR-CHECK-VERSION'
  | 'INVALID-SCHEMA'
  | 'ERROR-DROP-TABLE'
  | 'ERROR-CREATE-TABLE'
  | 'ERROR-INITIALIZE-TABLE'
  | 'ERROR-GET-RESOURCE'
  | 'ERROR-NO-RESOURCE-DATA'
  | 'ERROR-INSERT-TABLE';

/**
 * pill_data 테이블의 버전이 이전인지 최신인지 확인
 * @returns
 */
const hasLatestPillData = async (): Promise<CODE> => {
  const currentVersion = await ConfigQuery.getSpecificConfigs([
    'pillDataSchemaVersion',
    'pillDataResourceVersion',
  ]);

  if (!currentVersion?.length) {
    return 'REQUIRE-UPDATE';
  }

  const currentPillDataSchemaVersion = currentVersion.find(
    (v) => v.key === 'pillDataSchemaVersion',
  );
  const currentPillDataResourceVersion = currentVersion.find(
    (v) => v.key === 'pillDataResourceVersion',
  );

  if (!currentPillDataSchemaVersion || !currentPillDataResourceVersion) {
    return 'REQUIRE-UPDATE';
  }

  const serverVersion =
    await GoogleCloud.DatabaseVersionAPI.requestDatabaseVersion();

  const { schemaVersion, dataVersion } = serverVersion.pillData;

  const isOldSchema =
    Number(currentPillDataSchemaVersion) < Number(schemaVersion);
  if (isOldSchema) {
    return 'REQUIRE-UPDATE';
  }

  const isOldData =
    Number(currentPillDataResourceVersion) < Number(dataVersion);
  if (isOldData) {
    return 'REQUIRE-UPDATE';
  }

  return 'UNNECESSARY-UPDATE';
};

/**
 * pill_data 테이블 초기화
 * @returns
 */
const initPillDataTable = async (): Promise<CODE> => {
  const schema =
    await GoogleCloud.PillDataTableSchemaAPI.requestPillDataTableSchema();

  if (!schema.columns?.length) {
    return 'INVALID-SCHEMA';
  }

  try {
    await PillDataQuery.dropPillDataTable();
  } catch (e) {
    console.log(
      '[INIT-PILL-DATA-TABLE] Error occurred from drop pill_data table. %s',
      (e as Error).stack || e,
    );

    return 'ERROR-DROP-TABLE';
  }

  try {
    await PillDataQuery.createPillDataTable(schema.columns);
  } catch (e) {
    console.log(
      '[INIT-PILL-DATA-TABLE] Error occurred from create pill_data table. %s',
      (e as Error).stack || e,
    );

    return 'ERROR-CREATE-TABLE';
  }

  return 'OK';
};

/**
 * pill_data 테이블 데이터 최신 데이터 반영
 * @returns
 */
const insertPillData = async (): Promise<CODE> => {
  let currentPage = 1;
  let totalPages = 1;

  let code: CODE = 'OK';
  do {
    // 최신 데이터 요청
    let response: GoogleCloud.PillDataResourceAPI.IPillDataResourceResponse;
    try {
      response =
        await GoogleCloud.PillDataResourceAPI.requestPillDataResource(
          currentPage,
        );

      if (!response?.datas?.length || !response?.totalPage) {
        code = 'ERROR-NO-RESOURCE-DATA';
        break;
      }
    } catch (e) {
      console.log(
        '[INSERT-PILL-DATA] Error Occurred from request pill data resource. %s',
        (e as Error).stack || e,
      );

      code = 'ERROR-GET-RESOURCE';
      break;
    }

    const { totalPage, datas } = response;

    // pill_data 테이블에 INSERT
    try {
      await PillDataQuery.insertPillData(datas);
    } catch (e) {
      console.log(
        '[INSERT-PILL-DATA] Error Occurred from insert pill data resource. %s',
        (e as Error).stack || e,
      );

      code = 'ERROR-INSERT-TABLE';
      break;
    }

    totalPages = totalPage;
    currentPage++;
  } while (currentPage <= totalPages);

  return code;
};

/**
 * pill_data 테이블 업데이트
 * @returns
 */
const updatePillDataTable = async (): Promise<CODE> => {
  // 데이터베이스 업데이트 필요 여부 체크
  let requireUpdate = false;
  try {
    requireUpdate = (await hasLatestPillData()) === 'REQUIRE-UPDATE';
  } catch (e) {
    console.log(
      '[UPDATE-PILL-DATA-TABLE] Error occurred from data version check. %s',
      (e as Error).stack || e,
    );

    return 'ERROR-CHECK-VERSION';
  }

  if (!requireUpdate) {
    return 'NO-UPDATED';
  }

  // pill_data 테이블 초기화
  try {
    const result = await initPillDataTable();

    if (result !== 'OK') {
      return result;
    }
  } catch (e) {
    console.log(
      '[UPDATE-PILL-DATA-TABLE] Error occurred from initialize table. %s',
      (e as Error).stack || e,
    );

    return 'ERROR-INITIALIZE-TABLE';
  }

  // pill_data 테이블 최신 데이터 반영
  const insertResult = await insertPillData();

  return insertResult;
};

export default updatePillDataTable;
