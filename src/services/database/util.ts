import { base64ToBinary } from '@/src/utils';
import {
  ITableColumnSchema,
  IWhereQueryClause,
  TWhereQueryClauseFunc,
} from './types';

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

/**
 * 테이블에 INSERT 할 수 있는 데이터로 반환
 * @param row INSERT 할 row
 * @returns
 */
export const prepareRowForInsert = (row: Record<string, any>) => {
  const blobColumnNames = ['base64'];

  const prepareObj: Record<string, any> = {};

  Object.entries(row).forEach(([key, value]) => {
    const isBlobColumn = blobColumnNames.some((c) => c === key);

    if (isBlobColumn && value) {
      const pureBase64 = value.includes('base64,')
        ? value.split('base64,')[1]
        : value;
      prepareObj[key] = base64ToBinary(pureBase64);
      return;
    }

    prepareObj[key] = value;
  });

  return prepareObj;
};
