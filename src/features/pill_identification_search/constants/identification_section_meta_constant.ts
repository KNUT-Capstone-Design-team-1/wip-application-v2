// 섹션 키 -> Zustand 스토어 배열 상태 키 매핑
export const SECTION_KEY_TO_STORE_KEY: Record<string, string> = {
  manufacturerName: 'manufacturerName',
  dividerLineData: 'dividerLineData',
  shape: 'shape',
  colors: 'colors',
};

// 섹션 키 -> Zustand 스토어 텍스트 상태 키 매핑 (데이터 인덱스 기준)
export const SECTION_KEY_TO_TEXT_STORE_KEYS: Record<string, string[]> = {
  sideLabelText: ['sideLabelFrontText', 'sideLabelBackText'],
  productNameText: ['productNameText'],
  companyName: ['companyName'],
};
