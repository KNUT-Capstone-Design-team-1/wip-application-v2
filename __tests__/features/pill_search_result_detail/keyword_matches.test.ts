import { findKeywordMatches } from '../../../src/features/pill_search_result_detail/utils/keyword_matches';
import { findKeywordTargetIndex } from '../../../src/features/pill_search_result_detail/utils/keyword_navigation_targets';

test('대소문자, 정규식 문자, 중복 키워드와 반복 문구를 처리한다', () => {
  expect(
    findKeywordMatches('어지러움 어지러움 A+B a+b', [
      '어지러움',
      'A+B',
      '어지러움',
    ]).map((m) => m.start),
  ).toEqual([0, 5, 10, 14]);
});
test('겹치는 주의 키워드도 개별 검색 결과로 유지한다', () => {
  expect(
    findKeywordMatches('어지럼증', ['어지럼', '어지럼증']).map(
      (m) => m.keyword,
    ),
  ).toEqual(['어지럼증', '어지럼']);
});
const targets = [
  { id: 'a', keyword: '졸음', y: 100 },
  { id: 'b', keyword: '어지러움', y: 100 },
  { id: 'c', keyword: '졸음', y: 300 },
];
test('같은 줄의 결과도 전진하고 마지막에서는 순환하지 않는다', () => {
  expect(findKeywordTargetIndex(targets, 0, null, 'next')).toBe(0);
  expect(findKeywordTargetIndex(targets, 100, 'a', 'next')).toBe(1);
  expect(findKeywordTargetIndex(targets, 100, 'b', 'next')).toBe(2);
  expect(findKeywordTargetIndex(targets, 300, 'c', 'next')).toBe(3);
});
test('위로 스크롤해 이전 인덱스가 해제되면 화면 위치부터 다시 찾는다', () => {
  expect(findKeywordTargetIndex(targets, 50, null, 'next')).toBe(0);
  expect(findKeywordTargetIndex(targets, 150, null, 'next')).toBe(2);
});

test('이전은 현재 화면 위쪽에서 찾고 첫 항목에서 순환하지 않는다', () => {
  expect(findKeywordTargetIndex(targets, 150, null, 'previous')).toBe(1);
  expect(findKeywordTargetIndex(targets, 100, 'a', 'previous')).toBe(-1);
});
