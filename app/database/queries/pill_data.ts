import { getDatabase } from '../sqlite';
import {
  IPillData,
  IPillDataSearchParam,
  ITableColumnSchema,
  IWhereQueryClause,
  TWhereQueryClauseFunc,
} from '../types';
import {
  ALL_PILL_DATA_COLUMNS,
  buildWhereClause,
  getColumnPlaceholderForTableCreate,
  INSERT_BATCH_SIZE,
} from '../util';

/**
 * pill_data 테이블 조회를 위한 WHERE param 생성
 * @param pillData 조회할 데이터
 * @returns
 */
const getPillDataWhereQuery: TWhereQueryClauseFunc = (
  pillData: Partial<IPillDataSearchParam>,
): Record<keyof IPillDataSearchParam, IWhereQueryClause> => {
  return {
    ITEM_SEQ: {
      query: `ITEM_SEQ = ?`,
      values: (itemSeq: string) => [itemSeq],
    },
    ENTP_SEQ: {
      query: `ENTP_SEQ = ?`,
      values: (entpSeq: string) => [entpSeq],
    },
    ITEM_NAME: {
      query: `ITEM_NAME LIKE ?`,
      values: (itemName: string) => [`%${itemName}%`],
    },
    ENTP_NAME: {
      query: `ENTP_NAME LIKE ?`,
      values: (entpName: string) => [`%${entpName}%`],
    },
    ITEM_PERMIT_DATE: {
      query: `ITEM_PERMIT_DATE = ?`,
      values: (itemPermitDate: string) => [itemPermitDate],
    },
    ETC_OTC_CODE: {
      query: `ETC_OTC_CODE = ?`,
      values: (etcOtcCode: string) => [etcOtcCode],
    },
    CHART: {
      query: `CHART LIKE ?`,
      values: (chart: string) => [`%${chart}%`],
    },
    BAR_CODE: {
      query: `BAR_CODE = ?`,
      values: (barCode: string) => [barCode],
    },
    MATERIAL_NAME: {
      query: `MATERIAL_NAME LIKE ?`,
      values: (materialName: string) => [`%${materialName}%`],
    },
    VALID_TERM: {
      query: `VALID_TERM LIKE ?`,
      values: (validTerm: string) => [`%${validTerm}%`],
    },
    STORAGE_METHOD: {
      query: `STORAGE_METHOD LIKE ?`,
      values: (storageMethod: string) => [`%${storageMethod}%`],
    },
    PACK_UNIT: {
      query: `PACK_UNIT LIKE ?`,
      values: (packUnit: string) => [`%${packUnit}%`],
    },
    MAIN_ITEM_INGR: {
      query: `MAIN_ITEM_INGR LIKE ?`,
      values: (mainItemIngr: string) => [`%${mainItemIngr}%`],
    },
    INGR_NAME: {
      query: `INGR_NAME LIKE ?`,
      values: (ingrName: string) => [`%${ingrName}%`],
    },
    ITEM_IMAGE: {
      query: `ITEM_IMAGE = ?`,
      values: (itemImage: string) => [itemImage],
    },
    // 식별문자의 경우 중간에 공백이나 특수문자가 들어갈 수 있어 %L%I%K%E% 형식으로 조회한다
    PRINT_FRONT: {
      query: `(PRINT_FRONT LIKE ? OR PRINT_BACK LIKE ?)`,
      values: (printFront: string) => [
        `%${printFront.split('').join('%')}%`,
        `%${printFront.split('').join('%')}%`,
      ],
    },
    PRINT_FRONT_EXACTLY: {
      query: `PRINT_FRONT = ?`,
      values: (printFront: string) => [printFront],
    },
    // 식별문자의 경우 중간에 공백이나 특수문자가 들어갈 수 있어 %L%I%K%E% 형식으로 조회한다
    PRINT_BACK: {
      query: `(PRINT_BACK LIKE ? OR PRINT_FRONT LIKE ?)`,
      values: (printBack: string) => [
        `%${printBack.split('').join('%')}%`,
        `%${printBack.split('').join('%')}%`,
      ],
    },
    PRINT_BACK_EXACTLY: {
      query: `PRINT_BACK = ?`,
      values: (printBack: string) => [printBack],
    },
    DRUG_SHAPE: {
      query: `DRUG_SHAPE IN (${pillData.DRUG_SHAPE?.map(() => '?').join(', ')})`,
      values: (drugShape: string[]) => [...drugShape],
    },
    COLOR_CLASS1: {
      query: `(COLOR_CLASS1 IN (${pillData.COLOR_CLASS1?.map(() => '?').join(', ')}) 
               OR COLOR_CLASS2 IN (${pillData.COLOR_CLASS1?.map(() => '?').join(', ')}))`,
      values: (colorClass1: string[]) => [...colorClass1, ...colorClass1],
    },
    COLOR_CLASS2: {
      query: `(COLOR_CLASS2 IN (${pillData.COLOR_CLASS2?.map(() => '?').join(', ')}) 
               OR COLOR_CLASS1 IN (${pillData.COLOR_CLASS2?.map(() => '?').join(', ')}))`,
      values: (colorClass2: string[]) => [...colorClass2, ...colorClass2],
    },
    LINE_FRONT: {
      query: `(LINE_FRONT IN (${pillData.LINE_FRONT?.map(() => '?').join(', ')}) 
               OR LINE_BACK IN (${pillData.LINE_FRONT?.map(() => '?').join(', ')}))`,
      values: (lineFront: string[]) => [...lineFront, ...lineFront],
    },
    LINE_BACK: {
      query: `(LINE_BACK IN (${pillData.LINE_BACK?.map(() => '?').join(', ')})
               OR LINE_FRONT IN (${pillData.LINE_BACK?.map(() => '?').join(', ')}))`,
      values: (lineBack: string[]) => [...lineBack, ...lineBack],
    },
    IMG_REGIST_TS: {
      query: `IMG_REGIST_TS = ?`,
      values: (imgRegistTs: string) => [imgRegistTs],
    },
    CLASS_NAME: {
      query: `CLASS_NAME LIKE ?`,
      values: (className: string) => [`%${className}%`],
    },
    MARK_CODE_FRONT: {
      query: `(MARK_CODE_FRONT = ? OR MARK_CODE_BACK = ?)`,
      values: (markCodeFront: string) => [markCodeFront, markCodeFront],
    },
    MARK_CODE_BACK: {
      query: `(MARK_CODE_BACK = ? OR MARK_CODE_FRONT = ?)`,
      values: (markCodeBack: string) => [markCodeBack, markCodeBack],
    },
    FORM_CODE: {
      query: `(${pillData.FORM_CODE?.map(() => 'FORM_CODE LIKE ?').join(' AND ')})`,
      values: (formCode: string[]) =>
        formCode.map((formCode) => `%${formCode}%`),
    },
  };
};

/**
 * pill_data 테이블 유무 체크
 * @returns
 */
export const checkPillDataTableExist = async () => {
  const db = await getDatabase();

  const sql = `SELECT EXISTS (
    SELECT 1
    FROM sqlite_master
    WHERE type = 'table'
      AND name = ?
  ) AS exists`;

  const result = await db.getFirstAsync<{ exists: 0 | 1 }>(sql, ['pill_data']);

  return result?.exists;
};

/**
 * pill_data 테이블 삭제
 */
export const dropPillDataTable = async () => {
  const db = await getDatabase();

  await db.execAsync(`DROP TABLE IF EXISTS pill_data`);
};

/**
 * pill_data 테이블 생성
 * @param columnData 컬럼 정보
 */
export const createPillDataTable = async (columnData: ITableColumnSchema[]) => {
  const db = await getDatabase();

  const columnDefs = getColumnPlaceholderForTableCreate(columnData);

  const sql = `
    CREATE TABLE IF NOT EXISTS pill_data (
      ${columnDefs.join(',\n')}
    )`;

  await db.execAsync(sql);
};

/**
 * pill_data 테이블에 데이터 삽입
 * @param data 삽입할 데이터
 */
export const insertPillData = async (data: Partial<IPillData>[]) => {
  if (data.length === 0) {
    return;
  }

  const db = await getDatabase();

  for (let i = 0; i < data.length; i += INSERT_BATCH_SIZE) {
    const batch = data.slice(i, i + INSERT_BATCH_SIZE);

    await db.withTransactionAsync(async () => {
      for (const row of batch) {
        const entries = Object.entries(row).filter(([, v]) => v !== undefined);

        if (!entries.length) {
          continue;
        }

        const columns = entries.map(([key]) => key);
        const values = entries.map(([, v]) => v);
        const placeholders = columns.map(() => '?').join(', ');

        const sql = `INSERT INTO pill_data (${columns.join(', ')}) VALUES (${placeholders})`;

        await db.runAsync(sql, values);
      }
    });
  }
};

/**
 * pill_data 목록 조회
 * @param option
 * @returns
 */
export const getPillDatas = async (param: Partial<IPillDataSearchParam>) => {
  const db = await getDatabase();

  const { whereClause, whereValues } = buildWhereClause(
    getPillDataWhereQuery,
    param,
  );

  const sql = `SELECT ${ALL_PILL_DATA_COLUMNS} FROM pill_data ${whereClause}`;

  const result = await db.getAllAsync<IPillData>(sql, [...whereValues]);

  return result;
};

/**
 * ID 값인 ITEM_SEQ를 기준으로 pill_data 목록 조회
 * @param itemSeqs ITEM_SEQ 배열
 * @returns
 */
export const getPillDatasByItemSeq = async (itemSeqs: string[]) => {
  if (itemSeqs.length === 0) {
    return [];
  }

  const db = await getDatabase();

  const sql = `SELECT ${ALL_PILL_DATA_COLUMNS} FROM pill_data 
               WHERE ITEM_SEQ IN (${itemSeqs.map(() => '?').join(', ')})`;

  const result = await db.getAllAsync<IPillData>(sql, itemSeqs);

  return result;
};
