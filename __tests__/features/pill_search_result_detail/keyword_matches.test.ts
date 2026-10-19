import {
  findKeywordMatches,
  nextKeywordTarget,
} from '../../../src/features/pill_search_result_detail/utils/keyword_matches';

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
  { id: 'a', y: 100 },
  { id: 'b', y: 100 },
  { id: 'c', y: 300 },
];
test('같은 줄의 결과도 전진하고 마지막에서는 순환하지 않는다', () => {
  expect(nextKeywordTarget(targets, 0)?.id).toBe('a');
  expect(nextKeywordTarget(targets, 100, 'a')?.id).toBe('b');
  expect(nextKeywordTarget(targets, 100, 'b')?.id).toBe('c');
  expect(nextKeywordTarget(targets, 300, 'c')).toBeUndefined();
});
test('위로 스크롤해 이전 인덱스가 해제되면 화면 위치부터 다시 찾는다', () => {
  expect(nextKeywordTarget(targets, 50)?.id).toBe('a');
  expect(nextKeywordTarget(targets, 150)?.id).toBe('c');
});

test('아래로 스크롤한 뒤에는 화면 위의 결과로 되돌아가지 않는다', () => {
  expect(nextKeywordTarget(targets, 150, 'a')?.id).toBe('c');
});
