import { getDatabase } from '../sqlite';
import {
  INearbyPharmacies,
  TNearbyPharmaciesSearchParam,
  TQuerySearchParamResult,
  TWhereQueryClauseFunc,
} from '../types';
import { buildWhereClause } from '../util';

/**
 * nearby_pharmacies 테이블 조회를 위한 WHERE param 생성
 * @param params 조회할 데이터
 * @returns
 */
const getNearbyPharmaciesWhereQuery: TWhereQueryClauseFunc = (
  _params: Partial<TNearbyPharmaciesSearchParam>,
): TQuerySearchParamResult<TNearbyPharmaciesSearchParam> => {
  return {
    id: {
      query: `id = ?`,
      values: (id: string) => [id],
    },
    name: {
      query: `name LIKE ?`,
      values: (name: string) => [`%${name}%`],
    },
    states: {
      query: `states = ?`,
      values: (states: string) => [states],
    },
    region: {
      query: `region LIKE ?`,
      values: (region: string) => [`%${region}%`],
    },
    district: {
      query: `district LIKE ?`,
      values: (district: string) => [`%${district}%`],
    },
    address: {
      query: `address LIKE ?`,
      values: (address: string) => [`%${address}%`],
    },
    coordinate: {
      query: `(Y BETWEEN ? AND ?) AND (X BETWEEN ? AND ?)`,
      values: (coordinate: { x: number; y: number }) => {
        const { x, y } = coordinate;
        // 약 3km 반경을 위경도로 변환 (근사치)
        // 위도 1도 ≒ 111km -> 3km ≒ 0.027도
        // 경도 1도 ≒ 88km (한국 위도 기준) -> 3km ≒ 0.034도
        const latDelta = 0.027;
        const lonDelta = 0.034;

        return [y - latDelta, y + latDelta, x - lonDelta, x + lonDelta];
      },
    },
  };
};

/**
 * 주변 약국 목록 조회
 * @param params 검색 조건
 * @param queryOption 쿼리 옵션
 * @returns
 */
export const getNearbyPharmacies = async (
  params: Partial<TNearbyPharmaciesSearchParam>,
  queryOption: { page: number; limit: number },
) => {
  const { whereClause, whereValues } = buildWhereClause(
    getNearbyPharmaciesWhereQuery,
    params,
  );

  const db = await getDatabase();

  const sql = `SELECT * FROM nearby_pharmacies ${whereClause}
               LIMIT ?, ?`;

  const { page = 1, limit = 30 } = queryOption;
  const offset = (page - 1) * limit;

  const result = await db.getAllAsync<INearbyPharmacies>(sql, [
    ...whereValues,
    offset,
    limit,
  ]);

  return result;
};
