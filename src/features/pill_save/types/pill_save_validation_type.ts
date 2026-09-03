// 도메인 유효성 검사 결과 모델
export interface IValidationResult {
  // 유효 여부
  isValid: boolean;

  // 유효하지 않을 때 에러 메시지
  errorMessage?: string;
}
