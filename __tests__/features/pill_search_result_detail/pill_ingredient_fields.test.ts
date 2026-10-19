import {
  getPillIngredientFields,
  hasMoreInfoKeyword,
} from '../../../src/features/pill_search_result_detail/utils/pill_specs_fields';
import { collectPillWarningKeywords } from '../../../src/features/pill_search_result_detail/utils/pill_warning_keywords';

const data = {
  ITEM_SEQ: '1',
  ITEM_NAME: '약',
  ENTP_NAME: '제조사',
  MATERIAL_NAME: '모르핀;대마',
  MATERIAL_ENG_NAME: 'Diazepam',
  INGR_NAME: '에페드린|첨가제',
  narcoticIngredients: ['모르핀'],
  cannabisIngredients: ['대마'],
  psychotropicIngredients: ['Diazepam'],
  prohibitedIngredients: ['에페드린'],
  drivingWarningKeywords: ['졸음'],
};

test.each(['모르핀', '대마', 'Diazepam', '에페드린'])(
  '%s 분류 키워드가 더보기 성분에 있으면 펼침 대상으로 판별한다',
  (keyword) => {
    expect(hasMoreInfoKeyword(data, [keyword])).toBe(true);
  },
);

test('더보기에 없는 문구와 빈 검색어는 펼치지 않는다', () => {
  expect(hasMoreInfoKeyword(data, ['졸음'])).toBe(false);
  expect(hasMoreInfoKeyword(data, [])).toBe(false);
});

test('표시 텍스트와 탐색 대상의 줄바꿈·고유 식별자를 일치시킨다', () => {
  const fields = getPillIngredientFields(data);
  expect(fields.find((field) => field.id === 'material')?.text).toBe(
    '모르핀\n대마',
  );
  expect(fields.find((field) => field.id === 'additives')?.text).toBe(
    '에페드린\n첨가제',
  );
  expect(new Set(fields.map((field) => field.id)).size).toBe(fields.length);
});

test('운전·마약·대마·향정·도핑 키워드를 동일한 탐색 목록에 포함한다', () => {
  expect(collectPillWarningKeywords(data)).toEqual([
    '졸음',
    '모르핀',
    '대마',
    'Diazepam',
    '에페드린',
  ]);
});
