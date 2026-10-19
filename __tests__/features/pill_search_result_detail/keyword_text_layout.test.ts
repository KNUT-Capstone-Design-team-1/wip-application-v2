import {
  buildKeywordLineRanges,
  findKeywordLineOffset,
} from '../../../src/features/pill_search_result_detail/utils/keyword_text_layout';
import { collectPillWarningKeywords } from '../../../src/features/pill_search_result_detail/utils/pill_warning_keywords';

test('반복 문구와 줄바꿈의 실제 문자 위치를 유지한다', () => {
  const ranges = buildKeywordLineRanges('어지러움\n어지러움 주의', [
    { text: '어지러움', y: 0 },
    { text: '어지러움 주의', y: 24 },
  ]);
  expect(ranges).toEqual([
    { start: 0, end: 4, y: 0 },
    { start: 5, end: 12, y: 24 },
  ]);
  expect(findKeywordLineOffset(ranges, 5)).toBe(24);
  expect(findKeywordLineOffset(ranges, 1)).toBe(0);
});
test('분류별 문구 중복과 빈 문구를 제외한다', () => {
  expect(collectPillWarningKeywords(null)).toEqual([]);
  expect(
    collectPillWarningKeywords({
      ITEM_SEQ: '1',
      ITEM_NAME: '약',
      ENTP_NAME: '제조사',
      drivingWarningKeywords: ['졸음', ''],
      prohibitedIngredients: ['졸음', '코데인'],
    }),
  ).toEqual(['졸음', '코데인']);
});
