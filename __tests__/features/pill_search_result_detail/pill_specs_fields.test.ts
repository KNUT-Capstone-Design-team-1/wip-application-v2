import {
  getPillPhysicalFields,
  getPillManagementFields,
  getPillOtherFields,
  hasMoreInfoKeyword,
} from '../../../src/features/pill_search_result_detail/utils/pill_specs_fields';
import { IPillDetail } from '../../../src/features/pill_search_result_detail/types/pill_detail_type';

const basic: IPillDetail = {
  ITEM_SEQ: '1',
  ITEM_NAME: '약',
  ENTP_NAME: '제조사',
};

test.each([
  'ITEM_ENG_NAME',
  'ETC_OTC_CODE',
  'CLASS_NO',
  'COLOR_CLASS1',
  'COLOR_CLASS2',
  'LINE_FRONT',
  'LINE_BACK',
  'LENGTH_LONG',
  'LENGTH_SHORT',
  'LENGTH_THICK',
  'INSURANCE_CODE',
  'COVERAGE_ENG_NAME',
  'ITEM_PERMIT_DATE',
  'ENTP_ENG_NAME',
  'OEM_ENTP_NAME',
  'CHANGE_DATE',
  'CHANGE_CONTENT',
  'DRUG_CLASS',
  'NEW_DRUG_YN',
  'RARE_DRUG_YN',
])('%s에만 키워드가 있어도 더보기를 펼친다', (field) => {
  expect(hasMoreInfoKeyword({ ...basic, [field]: '모르핀' }, ['모르핀'])).toBe(
    true,
  );
});

test('표시되는 가공 문구를 기준으로 검색하고 숨겨진 보험코드 대체값은 제외한다', () => {
  const data = {
    ...basic,
    CHANGE_CONTENT: '성분/모르핀',
    INSURANCE_CODE: '123',
    COVERAGE_ENG_NAME: '숨김',
  };
  expect(
    getPillManagementFields(data).find((field) => field.id === 'changes')?.text,
  ).toBe('성분\n모르핀');
  expect(hasMoreInfoKeyword(data, ['모르핀'])).toBe(true);
  expect(hasMoreInfoKeyword(data, ['숨김'])).toBe(false);
});

test('빈 항목·null 문자열·관련 없는 일반 정보는 펼침 조건에서 제외한다', () => {
  expect(
    hasMoreInfoKeyword({ ...basic, MAIN_ITEM_INGR: '모르핀' }, ['모르핀']),
  ).toBe(false);
  expect(hasMoreInfoKeyword({ ...basic, DRUG_CLASS: 'null' }, ['null'])).toBe(
    false,
  );
  expect(hasMoreInfoKeyword(basic, [])).toBe(false);
});

test('동일한 줄의 항목도 서로 다른 탐색 식별자를 사용한다', () => {
  const physical = getPillPhysicalFields(basic);
  const groups = [
    physical.identity,
    physical.details,
    getPillManagementFields(basic),
    getPillOtherFields(basic),
  ];
  const ids = groups.flat().map((field) => field.id);
  expect(new Set(ids).size).toBe(ids.length);
});
