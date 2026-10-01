import { NativeError } from 'react-native-google-mobile-ads/src/internal/NativeError';
// 1. 최신 v17 규격의 Reason 유니온 타입 정의
export type KnownAdErrorReason =
  | 'no-fill'
  | 'mediation-no-fill'
  | 'network-error'
  | 'timeout'
  | 'invalid-request'
  | 'app-id-missing'
  | 'internal-error'
  | 'unknown';
export type AdErrorReason = KnownAdErrorReason | (string & {});
// 2. v15와 v17을 모두 아우르는 통합 AdError 타입 정의
export type AdError = (Error | NativeError) & {
  code?: string;
  reason?: AdErrorReason;
  phase?: 'load' | 'show';
  userInfo?: { code: string; message: string; reason?: string };
};
