// 그룹화할 키들 정의
const GROUP_KEYS = {
  COLOR: 'COLOR_CLASS',
  LINE: 'LINE',
  MARK_CODE: 'MARK_CODE',
  DRUG_SHAPE: 'DRUG_SHAPE',
  FORM_CODE: 'FORM_CODE',
} as const;

export const searchResultTagData = (items: any) => {
  const groupedMap = new Map();
  const result = [];

  // 1. 그룹화
  for (const [key, values] of items) {
    if (!values || values.length === 0) continue;

    // 그룹 키 결정
    let groupKey: string = key;
    for (const [_, group] of Object.entries(GROUP_KEYS)) {
      if (key.startsWith(group)) {
        groupKey = group;
        break;
      }
    }

    // 값 처리
    const valueArray = Array.isArray(values) ? values : [values];

    if (groupedMap.has(groupKey)) {
      const existingValues = groupedMap.get(groupKey);
      const newValues = [...new Set([...existingValues, ...valueArray])];
      groupedMap.set(groupKey, newValues);
    } else {
      groupedMap.set(groupKey, [...new Set(valueArray)]);
    }
  }

  // 2. 결과 생성
  for (const [key, values] of groupedMap.entries()) {
    // 모든 그룹화된 항목은 값들을 합쳐서 하나의 항목으로 만듦
    result.push({
      key,
      value: values.join(', '),
    });
  }

  return result;
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
export const getMappedTitle = (title: string): string => {
  // COLOR_CLASS로 시작하는 모든 문자열을 COLOR_CLASS로 변환
  // LINE_로 시작하는 모든 문자열을 LINE으로 변환
  const normalizedTitle = title
    .replace(/^COLOR_CLASS.+$/, 'COLOR_CLASS')
    .replace(/^LINE_.+$/, 'LINE')
    .replace(/^MARK_CODE_.+$/, 'MARK_CODE');

  return TITLE_MAPPING[normalizedTitle] || title;
};
