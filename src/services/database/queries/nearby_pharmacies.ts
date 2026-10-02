import { getDatabase } from '../sqlite';
import {
  INearbyPharmacies,
  INearbyPharmaciesQueryOption,
  TNearbyPharmaciesSearchParam,
  TQuerySearchParamResult,
} from '../types';
import { buildWhereClause } from '../util';
import { getDistance } from '@utils/location';

// 위도 1도 ≒ 111km, 경도 1도 ≒ 88km (한국 위도 기준)
const KM_PER_LAT_DEGREE = 111.0;
const KM_PER_LON_DEGREE = 88.0;

/**
 * nearby_pharmacies 테이블 조회를 위한 WHERE param 생성
 * @param params 조회할 데이터
 * @param maxRadiusKm 최대 검색 반경 (km)
 * @returns
 */
const getNearbyPharmaciesWhereQuery = (
  _params: Partial<TNearbyPharmaciesSearchParam>,
  maxRadiusKm = 3,
): TQuerySearchParamResult<TNearbyPharmaciesSearchParam> => {
  const latDelta = maxRadiusKm / KM_PER_LAT_DEGREE;
  const lonDelta = maxRadiusKm / KM_PER_LON_DEGREE;

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
  queryOption: Partial<INearbyPharmaciesQueryOption> = {},
): Promise<INearbyPharmacies[]> => {
  const { page = 1, limit = 30, maxRadiusKm = 3 } = queryOption;

  const { whereClause, whereValues } = buildWhereClause(
    (p) => getNearbyPharmaciesWhereQuery(p, maxRadiusKm),
    params,
  );

  const db = await getDatabase();
  const offset = (page - 1) * limit;

  // 1. 좌표 조건이 없는 경우 기본 페이징 쿼리 후 early return
  if (!params.coordinate) {
    const defaultSql = `SELECT * FROM nearby_pharmacies ${whereClause}
                        LIMIT ?, ?`;

    return await db.getAllAsync<INearbyPharmacies>(defaultSql, [
      ...whereValues,
      offset,
      limit,
    ]);
  }

  // 2. 좌표 기준 거리순 오름차순 정렬 쿼리 (SQLite 레벨 정렬)
  const { x, y } = params.coordinate;

  const sql = `SELECT * FROM nearby_pharmacies ${whereClause}
               ORDER BY (
                 ((CAST(Y AS REAL) - ?) * ${KM_PER_LAT_DEGREE}) * ((CAST(Y AS REAL) - ?) * ${KM_PER_LAT_DEGREE}) +
                 ((CAST(X AS REAL) - ?) * ${KM_PER_LON_DEGREE}) * ((CAST(X AS REAL) - ?) * ${KM_PER_LON_DEGREE})
               ) ASC
               LIMIT ?, ?`;

  const rows = await db.getAllAsync<INearbyPharmacies>(sql, [
    ...whereValues,
    y,
    y,
    x,
    x,
    offset,
    limit,
  ]);

  if (rows.length === 0) {
    return [];
  }

  // 3. 반경 이내 검증 및 정밀 거리 계산 (Haversine)
  const maxRadiusM = maxRadiusKm * 1000;
  const filteredPharmacies: INearbyPharmacies[] = [];

  for (const pharmacy of rows) {
    const pharmacyLat = Number(pharmacy.Y);
    const pharmacyLng = Number(pharmacy.X);

    // 유효하지 않은 좌표는 건너뜀
    if (Number.isNaN(pharmacyLat) || Number.isNaN(pharmacyLng)) {
      continue;
    }

    const dist = getDistance(y, x, pharmacyLat, pharmacyLng);

    // 반경(maxRadiusM) 이내 약국만 추가
    if (dist <= maxRadiusM) {
      filteredPharmacies.push({
        ...pharmacy,
        distance: dist,
      });
    }
  }

  // 정밀 거리 기준 정렬 보장
  filteredPharmacies.sort((a, b) => a.distance! - b.distance!);

  return filteredPharmacies;
};
