const DRIVING_WARNING_KEYWORDS = [
  // 운전/기계조작
  '운전',
  '자동차',
  '차량',
  '기계조작',
  '기계 조작',
  '위험한 기계',
  '중장비',

  // 졸음/진정
  '졸음',
  '졸리',
  '수면',
  '진정',
  '진정작용',
  '몽롱',
  '의식저하',

  // 어지러움
  '어지러움',
  '어지럼',
  '어지럼증',
  '현기증',
  '실신',

  // 인지/반응
  '집중력',
  '주의력',
  '판단력',
  '반응속도',
  '반응시간',
  '인지기능',
  '운동실조',

  // 시야
  '시야흐림',
  '복시',
  '시력장애',
];

// 문서 내 운전 주의 문구 추출.
export const getDrivingWarningKeywords = (
  eeData?: string,
  udData?: string,
  nbData?: string,
): string[] => {
  const combined = [eeData ?? '', udData ?? '', nbData ?? ''].join(' ');

  return DRIVING_WARNING_KEYWORDS.filter((keyword) =>
    combined.includes(keyword),
  );
};
