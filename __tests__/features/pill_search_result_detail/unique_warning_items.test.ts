import { uniqueWarningItems } from '../../../src/features/pill_search_result_detail/utils/unique_warning_items';

test('띄어쓰기와 탭 차이는 제거하고 최초 표기와 순서를 보존한다', () => {
  expect(
    uniqueWarningItems([
      'Test Ingredient',
      'TestIngredient',
      'Test\tIngredient',
      '다른 성분',
      '다른성분',
      '',
      '  ',
    ]),
  ).toEqual(['Test Ingredient', '다른 성분']);
});

test('서로 다른 성분명과 조건은 합치지 않는다', () => {
  const items = ['2,5-Test', '25-Test', 'S3: 투여 제한', 'S3: 농도 제한'];
  expect(uniqueWarningItems(items)).toEqual(items);
});
