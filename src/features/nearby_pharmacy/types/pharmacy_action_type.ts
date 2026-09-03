// 전화 걸기 액션 결과 모델
export interface IPharmacyCallResult {
  // 성공 여부
  success: boolean;

  // 실패 시 에러 사유
  errorMessage?: string;
}

// 텍스트 클립보드 복사 결과 모델
export interface IPharmacyCopyResult {
  // 성공 여부
  success: boolean;

  // 복사된 텍스트 내용
  copiedText?: string;
}
