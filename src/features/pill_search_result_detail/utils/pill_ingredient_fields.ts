import { IPillDetail } from '../types/pill_detail_type';

// 성분 영역의 표시·탐색 데이터 구성.
export const getPillIngredientFields = (data: IPillDetail) => [
  {
    id: 'material',
    label: '원료 성분',
    text: data.MATERIAL_NAME?.replace(/[;|]/g, '\n') || '',
  },
  { id: 'english', label: '영문 성분명', text: data.MATERIAL_ENG_NAME || '' },
  {
    id: 'additives',
    label: '첨가제',
    text: data.INGR_NAME?.replace(/[;|]/g, '\n') || '',
  },
  { id: 'total', label: '총량', text: data.TOTAL_CONTENT || '' },
  { id: 'storage', label: '저장 방법', text: data.STORAGE_METHOD || '' },
];
