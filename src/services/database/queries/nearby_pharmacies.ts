import { getDatabase } from '../sqlite';
import {
  INearbyPharmacies,
  INearbyPharmaciesQueryOption,
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

        // 약 3km 반경을 위경도 델타로 근사 변환
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
  queryOption: Partial<INearbyPharmaciesQueryOption> = {},
): Promise<INearbyPharmacies[]> => {
  const { whereClause, whereValues } = buildWhereClause(
    getNearbyPharmaciesWhereQuery,
    params,
  );

  const db = await getDatabase();

  const { page = 1, limit = 30, maxRadiusKm = 3 } = queryOption;

  // 1. 좌표 조건이 없는 경우 기본 페이징 쿼리 후 early return
  if (!params.coordinate) {
    const offset = (page - 1) * limit;

    const defaultSql = `SELECT * FROM nearby_pharmacies ${whereClause}
                        LIMIT ?, ?`;

    return await db.getAllAsync<INearbyPharmacies>(defaultSql, [
      ...whereValues,
      offset,
      limit,
    ]);
  }

  // 2. Bounding Box 후보군 추출 (중심점 가까운 약국 누락 방지를 위해 최대 300개 조회)
  const candidateLimit = 300;

  const candidateSql = `SELECT * FROM nearby_pharmacies ${whereClause}
                        LIMIT ?`;

  const candidates = await db.getAllAsync<INearbyPharmacies>(candidateSql, [
    ...whereValues,
    candidateLimit,
  ]);

  // 후보군이 비어 있으면 즉시 early return
  if (candidates.length === 0) {
    return [];
  }

  // 3. 단일 루프에서 거리 계산과 반경 필터링을 동시 수행 (불필요한 중간 배열 생성 및 객체 복사 제거)
  const { x, y } = params.coordinate;

  const maxRadiusM = maxRadiusKm * 1000;

  const filteredPharmacies: INearbyPharmacies[] = [];

  for (const pharmacy of candidates) {
    const pharmacyLat = Number(pharmacy.Y);
    const pharmacyLng = Number(pharmacy.X);

    // 유효하지 않은 좌표는 건너뜀
    if (Number.isNaN(pharmacyLat) || Number.isNaN(pharmacyLng)) {
      continue;
    }

    const dist = getDistance(y, x, pharmacyLat, pharmacyLng);

    // 반경 3km(maxRadiusM) 이내 약국만 추가
    if (dist <= maxRadiusM) {
      filteredPharmacies.push({
        ...pharmacy,
        distance: dist,
      });
    }
  }

  // 4. 거리순 오름차순 정렬 (이미 distance가 검증되었으므로 직관적인 a.distance - b.distance)
  filteredPharmacies.sort((a, b) => a.distance! - b.distance!);

  // 5. 요청된 페이지 및 개수만큼 슬라이스 반환
  const offset = (page - 1) * limit;

  return filteredPharmacies.slice(offset, offset + limit);
};
