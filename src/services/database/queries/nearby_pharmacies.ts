import { getDatabase } from '../sqlite';
import {
  INearbyPharmacies,
  TNearbyPharmaciesSearchParam,
  TQuerySearchParamResult,
  TWhereQueryClauseFunc,
} from '../types';
import { buildWhereClause } from '../util';
import { getDistance } from '@utils/location';

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
    address: {
      query: `address LIKE ?`,
      values: (address: string) => [`%${address}%`],
    },
    coordinate: {
      query: `(Y BETWEEN ? AND ?) AND (X BETWEEN ? AND ?)`,
      values: (coordinate: { x: number; y: number }) => {
        const { x, y } = coordinate;
        /**
         * 약 3km 반경을 위경도로 변환 (근사치)
         * 위도 1도 ≒ 111km -> 3km ≒ 0.027도
         * 경도 1도 ≒ 88km (한국 위도 기준) -> 3km ≒ 0.034도
         */
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
  queryOption: { page: number; limit: number; maxRadiusKm?: number },
) => {
  const { whereClause, whereValues } = buildWhereClause(
    getNearbyPharmaciesWhereQuery,
    params,
  );

  const db = await getDatabase();
  const { page = 1, limit = 30, maxRadiusKm = 3 } = queryOption;

  if (params.coordinate) {
    const { x, y } = params.coordinate;

    // Bounding Box 영역의 약국 후보군을 충분히 조회 (밀집 지역 고려 최대 300개)
    const candidateLimit = 300;
    const sql = `SELECT * FROM nearby_pharmacies ${whereClause}
                 LIMIT ?`;

    const candidates = await db.getAllAsync<INearbyPharmacies>(sql, [
      ...whereValues,
      candidateLimit,
    ]);

    // 1. 실제 거리 계산 (단위: m)
    const withDistance = candidates.map((pharmacy) => {
      const dist = getDistance(
        y,
        x,
        parseFloat(pharmacy.Y),
        parseFloat(pharmacy.X),
      );
      return { ...pharmacy, distance: dist };
    });

    // 2. 최대 반경(기본 3km) 이내 필터링
    const maxRadiusM = maxRadiusKm * 1000;
    const filtered = withDistance.filter(
      (item) => item.distance !== undefined && item.distance <= maxRadiusM,
    );

    // 3. 거리순 정렬
    filtered.sort(
      (a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity),
    );

    // 4. 페이징 적용
    const offset = (page - 1) * limit;
    return filtered.slice(offset, offset + limit);
  }

  const offset = (page - 1) * limit;
  const sql = `SELECT * FROM nearby_pharmacies ${whereClause}
               LIMIT ?, ?`;

  return await db.getAllAsync<INearbyPharmacies>(sql, [
    ...whereValues,
    offset,
    limit,
  ]);
};
