// 그룹화할 키들 정의
const GROUP_KEYS = {
  COLOR: 'COLOR_CLASS',
  LINE: 'LINE',
  MARK_CODE: 'MARK_CODE',
  DRUG_SHAPE: 'DRUG_SHAPE',
  FORM_CODE: 'FORM_CODE',
} as const;

/*
 * searchResultTagData 함수는 입력 데이터(items)를 그룹화한 뒤,
 * 같은 그룹에 속한 값들을 중복 없이 합쳐서 하나의 문자열로 묶어 반환
 * */
export const searchResultTagData = (items: any) => {
  const groupedMap = new Map();

  // 1. 유효한 데이터만 필터링 (데이터 중 결과 값이 빈값이거나, 배열의 길이가 0개인 경우 표시되지 않도록)
  const validItems = items.filter(([_key, values]: [unknown, unknown]) => {
    if (Array.isArray(values)) {
      return values.length > 0;
    }

    return typeof values === 'string' && values.trim().length > 0;
  });

  /* 2. 그룹화
   * 각 key가 어떤 그룹에 속하는지 확인
   * */
  for (const [key, values] of validItems) {
    // 그룹 키 결정
    let groupKey: string = key;
    for (const group of Object.values(GROUP_KEYS)) {
      // startsWith로 어떤 문자열로 시작했는지 기준을 잡아줌 ex. COLOR_CLASS1 / 2 -> COLOR_CLASS
      if (key.startsWith(group)) {
        groupKey = group;
        break;
      }
    }

    // 값 처리
    const valueArray = Array.isArray(values) ? values : [values];

    // ex. COLOR_CLASS1 이랑 COLOR_CLASS2 는 명칭도 동일하고, 값도 동일해 한번만 들어가지도록 적용
    if (groupedMap.has(groupKey)) {
      const existingValues = groupedMap.get(groupKey);
      const newValues = [...new Set([...existingValues, ...valueArray])];
      groupedMap.set(groupKey, newValues);
    } else {
      groupedMap.set(groupKey, [...new Set(valueArray)]);
    }
  }

  return [...groupedMap.entries()].map(([key, values]) => ({
    key,
    value: values.join(', '),
  }));
};

const TITLE_MAPPING: Record<string, string> = {
  'COLOR_CLASS': '색상',  // COLOR_CLASS1, COLOR_CLASS2 모두 매칭
  'DRUG_SHAPE': '모양',
  'LINE': '분할선',
  'MARK_CODE': '마크',
  'FORM_CODE': '제형',
  'PRINT_FRONT': '앞면',
  'PRINT_BACK': '뒷면',
  'ITEM_NAME': '이름',
  'ENTP_NAME': '제조사'
};

// 매핑된 title 가져오는 함수
export const getReplacedTitle = (title: string): string => {
  // COLOR_CLASS로 시작하는 모든 문자열을 COLOR_CLASS로 변환
  // LINE_로 시작하는 모든 문자열을 LINE으로 변환
  const normalizedTitle = title
    .replace(/^COLOR_CLASS.+$/, 'COLOR_CLASS')
    .replace(/^LINE_.+$/, 'LINE')
    .replace(/^MARK_CODE_.+$/, 'MARK_CODE');

  return TITLE_MAPPING[normalizedTitle] || title;
};
