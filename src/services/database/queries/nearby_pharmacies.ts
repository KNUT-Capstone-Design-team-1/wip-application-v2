import { getDatabase } from '../sqlite';
import {
  INearbyPharmacies,
  INearbyPharmaciesSearchParam,
  TQuerySearchParamResult,
  TWhereQueryClauseFunc,
} from '../types';
import { buildWhereClause } from '../util';

const ALL_NEARBY_PHARMACIES_COLUMNS: (keyof INearbyPharmacies)[] = [
  'id',
  'name',
  'states',
  'region',
  'district',
  'postalCode',
  'address',
  'telephone',
  'openData',
  'x',
  'y',
];

/**
 * nearby_pharmacies 테이블 조회를 위한 WHERE param 생성
 * @param params 조회할 데이터
 * @returns
 */
const getNearbyPhamaciesWhereQuery: TWhereQueryClauseFunc = (
  _params: Partial<INearbyPharmaciesSearchParam>,
): TQuerySearchParamResult<INearbyPharmaciesSearchParam> => {
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
      query: `? * acos(
      cos(radians(?)) * cos(radians(y)) *
      cos(radians(x) - radians(?)) +
      sin(radians(?)) * sin(radians(y))
    ) < ?`,
      values: (coordinate: { x: number; y: number }) => {
        const { x, y } = coordinate;
        const earthRadius = 6371; // km
        const distanceLimit = 3; // km

        return [earthRadius, y, x, y, distanceLimit];
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
  params: Partial<INearbyPharmaciesSearchParam>,
  queryOption: { page: number; limit: number },
) => {
  const { whereClause, whereValues } = buildWhereClause(
    getNearbyPhamaciesWhereQuery,
    params,
  );

  const db = await getDatabase();

  const sql = `SELECT ${ALL_NEARBY_PHARMACIES_COLUMNS} FROM nearby_pharmacies ${whereClause}
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
