import type { IPillDetail, PillSpecField } from '../types/pill_detail_type';
import { findKeywordMatches } from './keyword_matches';

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

// 상세 식별 제원의 실제 표시 문구 구성.
export const getPillPhysicalFields = (data: IPillDetail) => ({
  identity: [
    { id: 'englishName', label: '영문명', text: data.ITEM_ENG_NAME || '' },
    { id: 'prescription', label: '전문/일반', text: data.ETC_OTC_CODE || '' },
    { id: 'classNumber', label: '분류 번호', text: data.CLASS_NO || '' },
  ],
  details: [
    {
      id: 'color',
      label: '색상',
      text:
        (data.COLOR_CLASS1 || '-') +
        (data.COLOR_CLASS2 ? ' / ' + data.COLOR_CLASS2 : ''),
    },
    {
      id: 'line',
      label: '분할선',
      text:
        '앞: ' + (data.LINE_FRONT || '-') + ' / 뒤: ' + (data.LINE_BACK || '-'),
    },
    {
      id: 'size',
      label: '크기 (mm)',
      text:
        '장축: ' +
        (data.LENGTH_LONG || '-') +
        ' / 단축: ' +
        (data.LENGTH_SHORT || '-') +
        ' / 두께: ' +
        (data.LENGTH_THICK || '-'),
    },
  ],
});

// 허가·보험·변경 정보의 표시 문구 구성.
export const getPillManagementFields = (data: IPillDetail): PillSpecField[] => [
  {
    id: 'insurance',
    label: '보험 코드',
    text: data.INSURANCE_CODE || data.COVERAGE_ENG_NAME || '',
  },
  { id: 'permitDate', label: '허가 일자', text: data.ITEM_PERMIT_DATE || '' },
  {
    id: 'companyEnglish',
    label: '업체 영문명',
    text: data.ENTP_ENG_NAME || '',
  },
  { id: 'manufacturer', label: '위탁제조업체', text: data.OEM_ENTP_NAME || '' },
  { id: 'changeDate', label: '변경 일자', text: data.CHANGE_DATE || '' },
  {
    id: 'changes',
    label: '변경 내용',
    text: data.CHANGE_CONTENT?.replace(/[/]/g, '\n') || '',
  },
];

// 기타 분류 정보의 표시 문구 구성.
export const getPillOtherFields = (data: IPillDetail): PillSpecField[] => [
  { id: 'drugClass', label: '마약류 분류', text: data.DRUG_CLASS || '' },
  { id: 'newDrug', label: '신약 여부', text: data.NEW_DRUG_YN || '' },
  { id: 'rareDrug', label: '희귀의약품', text: data.RARE_DRUG_YN || '' },
];

// 더보기 전체에서 표시되는 키워드 포함 여부 확인.
export const hasMoreInfoKeyword = (
  data: IPillDetail,
  keywords: readonly string[],
): boolean => {
  const physical = getPillPhysicalFields(data);
  const fields = [
    ...physical.identity,
    ...physical.details,
    ...getPillIngredientFields(data),
    ...getPillManagementFields(data),
    ...getPillOtherFields(data),
  ];

  return fields.some(
    (field) =>
      field.text !== 'null' &&
      findKeywordMatches(field.text, keywords).length > 0,
  );
};
