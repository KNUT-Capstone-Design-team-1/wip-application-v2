import { checkSpecialClassifications } from '../../../src/features/pill_search_result_detail/services/special_classification_service';
import { ClassificationEntry } from '../../../src/services/database/queries/classification_catalog';
jest.mock(
  '@features/pill_search_result_detail/data/repositories/pill_detail_repository',
  () => ({ pillDetailRepository: {} }),
);
jest.mock(
  '../../../src/services/database/queries/classification_catalog',
  () => ({}),
);

const catalog: ClassificationEntry[] = [
  { kind: 'narcotic', kr: '모르핀', en: 'Morphine', contents: '' },
  { kind: 'cannabis', kr: '', en: '', contents: '' },
  {
    kind: 'psychotropic',
    kr: '테스트성분',
    en: 'TestIngredient',
    contents: '',
  },
  {
    kind: 'prohibited',
    kr: '',
    en: '',
    contents: 'S6 Including, but not limited to: • Ephedrine',
  },
];
test('실제 contents 필드로 도핑을 판별하고 빈 분류명은 일치시키지 않는다', async () => {
  const repo = {
    getClassificationCatalog: jest.fn().mockResolvedValue(catalog),
  };
  const result = await checkSpecialClassifications(
    '모르핀 / 에페드린',
    'Morphine hydrate, Ephedrine',
    repo,
  );
  expect(result.narcoticIngredients).toEqual(['모르핀']);
  expect(result.isCannabis).toBe(false);
  expect(result.prohibitedIngredients).toEqual(['Ephedrine']);
  expect(result.prohibitedIngredients).not.toContain(undefined);
});
test('도핑 영문 부분 단어는 매칭하지 않는다', async () => {
  const result = await checkSpecialClassifications('', 'methasone', {
    getClassificationCatalog: async () => catalog,
  });
  expect(result.isProhibited).toBe(false);
});
test('동일 성분 계산을 재사용하고 새 카탈로그는 다시 계산한다', async () => {
  const repo = {
    getClassificationCatalog: jest.fn().mockResolvedValue(catalog),
  };
  const first = await checkSpecialClassifications('모르핀', '', repo);
  expect(await checkSpecialClassifications('모르핀', '', repo)).toBe(first);
  repo.getClassificationCatalog.mockResolvedValue([]);
  expect(
    (await checkSpecialClassifications('모르핀', '', repo)).isNarcotic,
  ).toBe(false);
});
test('성분이 없으면 DB를 조회하지 않는다', async () => {
  const repo = { getClassificationCatalog: jest.fn() };
  expect((await checkSpecialClassifications('', '', repo)).isProhibited).toBe(
    false,
  );
  expect(repo.getClassificationCatalog).not.toHaveBeenCalled();
});

test('보이지 않는 공백만 있어도 DB를 읽거나 빈 키워드를 반환하지 않는다', async () => {
  const repo = { getClassificationCatalog: jest.fn() };
  const result = await checkSpecialClassifications(' \u200B ', '\t\n', repo);
  expect(result.prohibitedIngredients).toEqual([]);
  expect(repo.getClassificationCatalog).not.toHaveBeenCalled();
});
