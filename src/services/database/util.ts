import {
  IPillData,
  ITableColumnSchema,
  IWhereQueryClause,
  TWhereQueryClauseFunc,
} from './types';

export const INSERT_BATCH_SIZE = 500;

export const ALL_PILL_DATA_COLUMNS: (keyof IPillData)[] = [
  'ITEM_SEQ',
  'ITEM_NAME',
  'ENTP_NAME',
  'ITEM_PERMIT_DATE',
  'ETC_OTC_CODE',
  'CHART',
  'BAR_CODE',
  'MATERIAL_NAME',
  'VALID_TERM',
  'STORAGE_METHOD',
  'PACK_UNIT',
  'MAIN_ITEM_INGR',
  'INGR_NAME',
  'ITEM_IMAGE',
  'PRINT_FRONT',
  'PRINT_BACK',
  'DRUG_SHAPE',
  'COLOR_CLASS1',
  'COLOR_CLASS2',
  'LINE_FRONT',
  'LINE_BACK',
  'IMG_REGIST_TS',
  'CLASS_NAME',
  'MARK_CODE_FRONT',
  'MARK_CODE_BACK',
  'FORM_CODE',
] as const;

/**
 * 테이블 생성을 생성을 위한 컬럼 플레이스 홀더 반환
 * @param columnData 컬럼 정보
 * @returns
 */
export const getColumnPlaceholderForTableCreate = (
  columnData: ITableColumnSchema[],
) => {
  const result = columnData.map((col) => {
    const parts: string[] = [];

    parts.push(`${col.name} ${col.type}`);

    if (col.isPK) {
      parts.push('PRIMARY KEY');
    }

    if (!col.nullable) {
      parts.push('NOT NULL');
    }

    if (col.defaultValue !== null) {
      parts.push(
        typeof col.defaultValue === 'string'
          ? `DEFAULT '${col.defaultValue}'`
          : `DEFAULT ${col.defaultValue}`,
      );
    }

    return parts.join(' ');
  });

  return result;
};

/**
 * 파라미터에 대한 WHERE 절을 생성
 * @param whereQueryClauseFunc WHERE 절을 만들어주는 함수
 * @param param 파라미터
 * @returns
 */
export const buildWhereClause = (
  whereQueryClauseFunc: TWhereQueryClauseFunc,
  param: Record<string, any>,
) => {
  const queryClauseMap = whereQueryClauseFunc(param);

  const whereParts: string[] = [];
  const whereValues: any[] = [];

  for (const key in param) {
    const value = param[key as keyof typeof param];

    if (value != null && queryClauseMap[key as keyof typeof queryClauseMap]) {
      const queryClause = queryClauseMap[
        key as keyof typeof queryClauseMap
      ] as IWhereQueryClause;

      whereParts.push(queryClause.query);

      whereValues.push(...queryClause.values(value));
    }
  }

  const whereClause = whereParts.length
    ? `WHERE ${whereParts.join(' AND ')}`
    : '';

  return { whereClause, whereValues };
};
