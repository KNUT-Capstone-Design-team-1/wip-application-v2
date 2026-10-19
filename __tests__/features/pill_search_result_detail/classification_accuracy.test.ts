import fixture from './fixtures/classification_resources.json';
import { ClassificationEntry } from '../../../src/services/database/queries/classification_catalog';
import {
  chemicalNameKey,
  ingredientNameVariants,
  splitChemicalList,
  substanceAliases,
} from '../../../src/services/database/matching/substance_names';
import {
  findControlledMatches,
  findClassificationProhibitedMatches,
  getClassificationIndex,
} from '../../../src/services/database/matching/classification_matcher';
import { prepareProhibitedDocument } from '../../../src/services/database/matching/prohibited_substances';

const catalog = fixture as ClassificationEntry[];
const controlled = (input: string) =>
  findControlledMatches(catalog, input).map((row) => row.en);
const doping = (input: string) =>
  findClassificationProhibitedMatches(catalog, input);

test('실제 494개 분류 행의 정식명과 파싱된 모든 이명으로 원래 행을 찾는다', () => {
  const rows = catalog.filter((row) => row.kind !== 'prohibited');
  expect(rows).toHaveLength(494);

  for (const row of rows) {
    for (const alias of substanceAliases(row)) {
      expect(findControlledMatches(catalog, alias)).toContain(row);
    }
  }
});
test.each([
  ['[M249060]디히드로코데인타르타르산염', ['Dihydrocodeine']],
  [
    'Dihydrocodeine Tartrate/Guaifenesin/Chlorpheniramine Maleate',
    ['Dihydrocodeine'],
  ],
  ['Methamphetamine Hydrochloride', ['Methamphetamine']],
  ['Meperidine Hydrochloride', ['Pethidine']],
  ['Desoxypipradrol', ['2-Benzhydrylpiperidine']],
  ['엑스터시', ['3,4-Methylenedioxy-N-methylamphetamine']],
  ['2C-B-NBOH', ['25B-NBOH']],
  ['α-PVT', ['α-PVT']],
  ['alpha-PVT', ['α-PVT']],
  ['２Ｃ－Ｂ－ＮＢＯＨ', ['25B-NBOH']],
  ['', []],
  ['   ', []],
  ['Ascorbic Acid', []],
  ['Hydrochloride Hydrate', []],
])('성분 단위 판정: %s', (input, expected) =>
  expect(controlled(input)).toEqual(expected),
);
test('복합성분 경계를 지워서 다른 성분을 만들지 않는다', () => {
  expect(controlled('메트|암페타민')).toEqual(['Amphetamine']);
  expect(controlled('펜|타닐')).toEqual([]);
});
test('숫자 위치번호와 괄호 내부 쉼표는 성분 구분자로 취급하지 않는다', () => {
  expect(
    splitChemicalList(
      '2,5-Dimethoxyphenethylamine, Codeine/(5-aminopropyl)benzofuran',
    ),
  ).toEqual([
    '2,5-Dimethoxyphenethylamine',
    'Codeine',
    '(5-aminopropyl)benzofuran',
  ]);
  expect(chemicalNameKey('2,5-Dimethoxyphenethylamine')).not.toBe(
    chemicalNameKey('25-Dimethoxyphenethylamine'),
  );
  expect(ingredientNameVariants('Hydrochloride Hydrate')).toEqual([]);
});
test.each([
  'Cannabidiol',
  'Caffeine Hydrate',
  'Anhydrous Caffeine',
  'Bupropion Hydrochloride',
  'Phenylephrine Hydrochloride',
  'Nicotine',
  'Codeine Phosphate',
  'Dihydrocodeine Tartrate',
  'Hydrocodone',
  'Tapentadol Hydrochloride',
  'Semaglutide',
  'Tirzepatide',
  'Drospirenone',
  'Pamabrom',
  'Clonidine Hydrochloride',
  'Guanfacine Hydrochloride',
  'Dimethyl Fumarate Micronized',
  'Sodium Chloride',
  'Ascorbic Acid',
  '',
  ' ',
  '\u200B',
  'Hydrate',
  'Hydrochloride Hydrate',
])('예외·감시대상·공백·구성 단어로 금지 오탐하지 않는다: %s', (input) => {
  expect(doping(input)).toEqual([]);
});
test.each([
  ['Formoterol Fumarate Hydrate', 'S3'],
  ['Salbutamol Sulfate', 'S3'],
  ['Salmeterol Xinafoate Micronized', 'S3'],
  ['Indacaterol Acetate', 'S3'],
  ['Methamphetamine', 'S6'],
  ['Pseudoephedrine Hydrochloride', 'S6'],
  ['DL-Methylephedrine Hydrochloride', 'S6'],
  ['Tramadol Hydrochloride', 'S7'],
  ['Meperidine', 'S7'],
  ['Dexamethasone', 'S9'],
  ['Hydrochlorothiazide', 'S5'],
  ['Atenolol', 'P1'],
  ['Bisoprolol Fumarate', 'P1'],
  ['수도에페드린염산염', 'S6'],
  ['슈도에페드린염산염', 'S6'],
  ['주석산졸피뎀', 'NONE'],
  ['Cannabinol', 'S8'],
  ['Δ9-Tetrahydrocannabinol', 'S8'],
])('실제 금지 본문 및 국문 표기 변형: %s', (input, section) => {
  if (section === 'NONE') {
    expect(doping(input)).toEqual([]);
  } else {
    expect(doping(input).map((match) => match.section)).toContain(section);
  }
});
test('24개 문서 중 본문 15개만 사용하고 목차·서문·방법·모니터링·주해는 배제한다', () => {
  expect(getClassificationIndex(catalog).prohibited).toHaveLength(15);
  expect(prepareProhibitedDocument({ contents: '' })).toBeNull();
  expect(prepareProhibitedDocument({ contents: '   ' })).toBeNull();
});
test('농도·투여 경로·특정 종목 조건을 결과에 보존한다', () => {
  expect(doping('Pseudoephedrine')[0].note).toContain('소변 농도');
  expect(doping('Prednisolone')[0].note).toContain('투여');
  expect(doping('Atenolol')[0].note).toContain('특정 종목');
});
test('동일 성분의 국문·영문 결과가 중복 표시되지 않는다', () => {
  expect(
    doping('[M203364]슈도에페드린염산염|Pseudoephedrine Hydrochloride'),
  ).toHaveLength(1);
});
