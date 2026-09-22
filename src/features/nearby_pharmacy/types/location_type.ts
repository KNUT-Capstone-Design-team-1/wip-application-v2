// 위치 가용성 검증 결과 타입
export type TLocationCheckResult =
  | { success: true }
  | { success: false; reason: 'permission_denied' | 'gps_disabled' };
