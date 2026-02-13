import { getDatabase } from '../sqlite';
import {
  IMarkImages,
  IMarkImagesSearchParam,
  TQuerySearchParamResult,
  TWhereQueryClauseFunc,
} from '../types';
import { buildWhereClause } from '../util';

const ALL_MARK_IMAGES_COLUMNS: (keyof IMarkImages)[] = [
  'code',
  'title',
  'base64',
];

const bufferToDataUrl = (buffer: string, mime = 'image/gif') => {
  const base64 = buffer.toString();
  return `data:${mime};base64,${base64}`;
};

/**
 * mark_images 테이블 조회를 위한 WHERE param 생성
 * @param params 조회할 데이터
 * @returns
 */
const getMarkImagesWhereQuery: TWhereQueryClauseFunc = (
  _params: Partial<IMarkImagesSearchParam>,
): TQuerySearchParamResult<IMarkImagesSearchParam> => {
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
  params: Partial<IMarkImagesSearchParam>,
  queryOption: { page: number; limit: number },
) => {
  const { whereClause, whereValues } = buildWhereClause(
    getMarkImagesWhereQuery,
    params,
  );

  const db = await getDatabase();

  const sql = `SELECT ${ALL_MARK_IMAGES_COLUMNS} FROM pill_data ${whereClause}
               LIMIT ?, ?`;

  const { page = 1, limit = 30 } = queryOption;
  const offset = (page - 1) * limit;

  const result = await db.getAllAsync<IMarkImages>(sql, [
    ...whereValues,
    offset,
    limit,
  ]);

  return result.map((v) => ({
    ...v,
    base64: bufferToDataUrl(v.base64),
  }));
};
