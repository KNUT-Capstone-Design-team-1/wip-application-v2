import fixture from './fixtures/classification_resources.json';
import { getClassificationCatalog } from '../../../src/services/database/queries/classification_catalog';
import { getDatabase } from '../../../src/services/database/sqlite';
import { getNarcotics } from '../../../src/services/database/queries/narcotics';
import { getCannabis } from '../../../src/services/database/queries/cannabis';
import { getPsychotropics } from '../../../src/services/database/queries/psychotropics';
import { getProhibitedList } from '../../../src/services/database/queries/prohibited_list';
jest.mock(
  '../../../src/services/database/queries/classification_catalog',
  () => ({ getClassificationCatalog: jest.fn() }),
);
jest.mock('../../../src/services/database/sqlite', () => ({
  getDatabase: jest.fn(),
}));
const options = { page: 1, limit: 100 };
const sqlQuery = jest.fn();
beforeEach(() => {
  (getClassificationCatalog as jest.Mock).mockResolvedValue(fixture);
  (getDatabase as jest.Mock).mockResolvedValue({ getAllAsync: sqlQuery });
  sqlQuery.mockReset().mockResolvedValue([]);
});
test('동일 판별을 테이블 쿼리에서도 사용한다', async () => {
  expect(
    (
      await getNarcotics({ containedInEn: 'Dihydrocodeine Tartrate' }, options)
    ).map((row) => row.chemicalNameEn),
  ).toEqual(['Dihydrocodeine']);
  expect(
    (await getPsychotropics({ containedInEn: 'Desoxypipradrol' }, options)).map(
      (row) => row.chemicalNameEn,
    ),
  ).toEqual(['2-Benzhydrylpiperidine']);
  expect(
    (await getCannabis({ containedInEn: 'Cannabidiol' }, options)).map(
      (row) => row.chemicalNameEn,
    ),
  ).toEqual(['Cannabidiol']);
  expect(
    await getProhibitedList({ containedInEn: 'Cannabidiol' }, options),
  ).toEqual([]);
  expect(
    await getProhibitedList({ containedInEn: 'Caffeine' }, options),
  ).toEqual([]);
  expect(
    await getProhibitedList({ containedInKr: '슈도에페드린염산염' }, options),
  ).toHaveLength(1);
});
test.each(['', ' ', '\t\n', '\u200B', '\uFEFF'])(
  '공백만 있는 조건은 DB 조회 없이 빈 결과를 반환한다: %j',
  async (value) => {
    expect(await getProhibitedList({ contents: value }, options)).toEqual([]);
    expect(await getProhibitedList({ containedInEn: value }, options)).toEqual(
      [],
    );
    expect(await getNarcotics({ containedInKr: value }, options)).toEqual([]);
    expect(sqlQuery).not.toHaveBeenCalled();
    expect(getClassificationCatalog).not.toHaveBeenCalled();
  },
);
test('미지원 필드가 조건 없는 전체 조회로 바뀌지 않는다', async () => {
  await expect(
    getProhibitedList({ chemicalNameEn: 'Caffeine' } as any, options),
  ).rejects.toThrow('Unsupported');
});
test('국문·영문 조건은 AND로 적용하며 제한·페이지는 판별 후 적용한다', async () => {
  expect(
    await getNarcotics(
      { containedInKr: '코데인', containedInEn: 'Morphine' },
      options,
    ),
  ).toEqual([]);
  expect(
    await getNarcotics(
      { containedInEn: 'Codeine/Morphine' },
      { page: 2, limit: 1 },
    ),
  ).toHaveLength(1);
});
test('원문 문서 검색도 공백 데이터 행을 제외하고 검색 문자를 리터럴로 바인딩한다', async () => {
  sqlQuery.mockResolvedValue([
    { contents: ' ' },
    { contents: '\u200B' },
    { contents: 'S6 example' },
    { contents: null },
  ]);
  expect(await getProhibitedList({ contents: '%' }, options)).toEqual([
    { contents: 'S6 example' },
  ]);
  expect(sqlQuery.mock.calls[0][0]).toContain('length(trim(contents, ?)) > 0');
  expect(sqlQuery.mock.calls[0][1]).toContain('%');
});
