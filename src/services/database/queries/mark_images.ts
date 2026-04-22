import { binaryToBase64 } from '@utils/index';
import { getDatabase } from '../sqlite';
import {
  IMarkImages,
  TMarkImagesSearchParam,
  TQuerySearchParamResult,
  TWhereQueryClauseFunc,
} from '../types';
import { buildWhereClause } from '../util';

const ALL_MARK_IMAGES_COLUMNS: (keyof IMarkImages)[] = [
  'code',
  'title',
  'base64',
];

/**
 * mark_images 테이블 조회를 위한 WHERE param 생성
 * @param params 조회할 데이터
 * @returns
 */
const getMarkImagesWhereQuery: TWhereQueryClauseFunc = (
  _params: Partial<TMarkImagesSearchParam>,
): TQuerySearchParamResult<TMarkImagesSearchParam> => {
  return {
    code: {
      query: `code = ?`,
      values: (code: string) => [code],
    },
    title: {
      query: `title LIKE ?`,
      values: (title: string) => [`%${title}%`],
    },
  };
};

/**
 * 마크 이미지 목록 조회
 * @param params 검색 조건
 * @param queryOption 쿼리 옵션
 * @returns
 */
export const getMarkImages = async (
  params: Partial<TMarkImagesSearchParam> = {},
  queryOption: { page: number; limit: number },
) => {
  const { whereClause, whereValues } = buildWhereClause(
    getMarkImagesWhereQuery,
    params,
  );

  const db = await getDatabase();

  const sql = `SELECT ${ALL_MARK_IMAGES_COLUMNS} FROM mark_images ${whereClause}
               LIMIT ?, ?`;

  const { page = 1, limit = 30 } = queryOption;
  const offset = (page - 1) * limit;

  const result = await db.getAllAsync<IMarkImages>(sql, [
    ...whereValues,
    offset,
    limit,
  ]);

  // BLOB으로 저장된 base64 컬럼의 값을 이미지로 표시할 수 있도록 base64로 변환한다
  return result.map((v) => ({
    ...v,
    base64: binaryToBase64(v.base64),
  }));
};
