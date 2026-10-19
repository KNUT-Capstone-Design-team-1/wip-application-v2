import type { ClassificationEntry } from '../queries/classification_catalog';
import { chemicalNameKey, ingredientKeys } from './substance_names';
import { getClassificationIndex } from './classification_index';
import {
  findProhibitedMatches,
  ProhibitedMatch,
  sectionNote,
} from './prohibited_substances';
export { getClassificationIndex } from './classification_index';

// 성분별 정식명·이명 일치 조회.
export const findControlledMatches = (
  catalog: ClassificationEntry[],
  ingredients: string,
): ClassificationEntry[] => {
  const { names } = getClassificationIndex(catalog);
  const matches = [...ingredientKeys(ingredients)].flatMap(
    (key) => names.get(key) || [],
  );

  return [...new Set(matches)];
};

// CBD를 제외한 S8 적용 성분 확인.
const isProhibitedCannabis = (entry: ClassificationEntry): boolean =>
  entry.kind === 'cannabis' && chemicalNameKey(entry.en) !== 'cannabidiol';

// S8 중복 결과 확인.
const hasCannabisMatch = (
  matches: ProhibitedMatch<ClassificationEntry>[],
  entry: ClassificationEntry,
): boolean =>
  matches.some(
    (match) =>
      match.section === 'S8' &&
      chemicalNameKey(match.ingredient) === chemicalNameKey(entry.en),
  );

// S8 포괄 규정 보완.
const appendCannabisMatches = (
  catalog: ClassificationEntry[],
  controlled: ClassificationEntry[],
  matches: ProhibitedMatch<ClassificationEntry>[],
) => {
  const source = getClassificationIndex(catalog).prohibited.find(
    (doc) =>
      doc.section === 'S8' &&
      /all natural and synthetic cannabinoids/i.test(doc.searchable),
  );

  if (!source) {
    return matches;
  }

  for (const entry of controlled.filter(isProhibitedCannabis)) {
    if (hasCannabisMatch(matches, entry)) {
      continue;
    }

    matches.push({
      ingredient: entry.kr || entry.en,
      section: 'S8',
      note: sectionNote('S8'),
      source: source.source,
    });
  }

  return matches;
};

// 이명·S8 규정을 포함한 금지 성분 조회.
export const findClassificationProhibitedMatches = (
  catalog: ClassificationEntry[],
  ingredients: string,
) => {
  const { prohibited } = getClassificationIndex(catalog);
  const controlled = findControlledMatches(catalog, ingredients);
  const names =
    ingredients + '|' + controlled.map((entry) => entry.en).join('|');
  const matches = findProhibitedMatches(prohibited, names);

  return appendCannabisMatches(catalog, controlled, matches);
};
