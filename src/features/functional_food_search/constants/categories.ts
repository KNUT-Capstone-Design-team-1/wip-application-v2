// 한 번에 불러올 검색 결과 개수
export const PAGE_LIMIT = 30;

/**
 * 카테고리 그룹 정의 (사람이 관리하는 큐레이션 매핑)
 *
 * DB 중분류(foodMediumCategoryName)는 71종으로 세분화·난립해 있어 날것 그대로는
 * 사용자가 구분하기 어렵다. 그래서 의미가 통하는 상위 그룹으로 묶어서 노출한다.
 * - key   : 칩의 내부 식별값(= 선택 상태 비교용 value)
 * - label : 화면에 표시할 친화적 이름
 * - match : 해당 그룹에 포함시킬 중분류 LIKE 매칭 키워드(부분 일치, OR 결합)
 *
 * 예) '복합제품(영양소, 기능성)' / '복합제품(영양소)' / '복합제품(기능성)'
 *     → match '복합제품' 하나로 묶여 '종합영양제' 칩으로 노출된다.
 *
 * 긴 꼬리(한두 건짜리 단일 성분)는 칩에서 제외하고 상단 검색창으로 찾게 둔다.
 */
export interface ICategoryGroup {
  key: string;
  label: string;
  match: string[];
}

export const CATEGORY_GROUPS: ICategoryGroup[] = [
  { key: 'multi', label: '종합영양제', match: ['복합제품'] },
  {
    key: 'vitamin',
    label: '비타민',
    match: ['비타민', '비오틴', '엽산', '판토텐산', '나이아신', '베타카로틴'],
  },
  { key: 'probiotics', label: '유산균', match: ['프로바이오틱스', '올리고당'] },
  { key: 'protein', label: '단백질', match: ['단백질', '크레아틴'] },
  {
    key: 'omega',
    label: '오메가·지방산',
    match: ['EPA', 'DHA', '감마리놀렌산', '지방산', '리놀레산', '상어간유'],
  },
  {
    key: 'mineral',
    label: '미네랄',
    match: ['마그네슘', '칼슘', '아연', '철', '칼륨', '셀레늄', '크롬'],
  },
  { key: 'propolis', label: '프로폴리스', match: ['프로폴리스'] },
  {
    key: 'joint',
    label: '관절건강',
    match: ['엠에스엠', '글루코사민', 'NAG', '뮤코다당'],
  },
  { key: 'redGinseng', label: '홍삼', match: ['홍삼'] },
];
