// 두 좌표(위도, 경도) 간의 거리를 미터(m) 단위로 계산하는 함수
export const getDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const isInvalidCoords =
    isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2);

  if (isInvalidCoords) {
    return Infinity;
  }

  const R = 6371e3; // metres
  const lat1Rad = (lat1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;
  const deltaLatRad = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLonRad = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLonRad / 2) *
      Math.sin(deltaLonRad / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in metres
};

// 계산된 거리를 UI에 표시하기 위해 문자열(m 또는 km)로 포맷팅하는 함수 (undefined/null 안전 지원)
export const getFormattedDistance = (
  distanceInMeters?: number | null,
): string => {
  const isInvalidDistance =
    distanceInMeters === undefined ||
    distanceInMeters === null ||
    isNaN(distanceInMeters) ||
    distanceInMeters === Infinity;

  if (isInvalidDistance) {
    return '';
  }

  const isUnderOneKm = distanceInMeters < 1000;

  if (isUnderOneKm) {
    return `${Math.round(distanceInMeters)}m`;
  }

  return `${(distanceInMeters / 1000).toFixed(1)}km`;
};
