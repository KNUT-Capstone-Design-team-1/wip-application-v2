export const SEARCH_CONDITION_LABELS = {
  KEYWORD: '검색어',
  ITEM_NAME: '제품명',
  ENTP_NAME: '제조사명',
  PRINT_FRONT: '식별(앞)',
  PRINT_BACK: '식별(뒤)',
  SIDE_LABEL: '식별 문자',
  SHAPE: '모양',
  COLOR: '색상',
  LINE: '분할선',
  FORM: '제형',
  MARK: '마크',
} as const;

export const SEARCH_FORM_OPTIONS = {
  ALL: '전체',
  PILL: '정제',
  HARD_CAPSULE: '경질캡슐',
  SOFT_CAPSULE: '연질캡슐',
  ETC: '기타',
} as const;

export const SEARCH_LINE_OPTIONS = {
  ALL: '전체',
  NONE: '선없음',
  CROSS: '십자(+)형',
  STRAIGHT: '일자(-)형',
  ETC: '기타',
} as const;

export const SEARCH_SHAPE_OPTIONS = {
  ALL: '전체',
  CIRCLE: '원형',
  ELLIPSE: '타원형',
  LONG: '장방형',
  HALF_CIRCLE: '반원형',
  TRIANGLE: '삼각형',
  RECTANGLE: '사각형',
  DIAMOND: '마름모형',
  PENTAGON: '오각형',
  HEXAGON: '육각형',
  OCTAGON: '팔각형',
  ETC: '기타',
} as const;

export const SEARCH_COLOR_OPTIONS = {
  ALL: '전체',
  WHITE: '흰색',
  YELLOW: '노란색',
  ORANGE: '주황색',
  PINK: '분홍색',
  RED: '빨간색',
  BROWN: '갈색',
  YELLOW_GREEN: '연두색',
  GREEN: '초록색',
  BLUE_GREEN: '청록색',
  BLUE: '파란색',
  NAVY: '남색',
  PURPLE_RED: '자주색',
  PURPLE: '보라색',
  GRAY: '회색',
  BLACK: '검정색',
  TRANSPARENT: '투명색',
} as const;
