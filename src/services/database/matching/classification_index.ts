import type { ClassificationEntry } from '../queries/classification_catalog';
import { chemicalNameKey, substanceAliases } from './substance_names';
import {
  prepareProhibitedDocument,
  PreparedProhibitedDocument,
} from './prohibited_substances';

interface ClassificationIndex {
  names: Map<string, ClassificationEntry[]>;
  prohibited: PreparedProhibitedDocument<ClassificationEntry>[];
}
const indexes = new WeakMap<ClassificationEntry[], ClassificationIndex>();

// 정식명·이명 인덱스 등록.
const addSubstanceNames = (
  index: ClassificationIndex,
  entry: ClassificationEntry,
) => {
  for (const alias of substanceAliases(entry)) {
    const key = chemicalNameKey(alias);
    const rows = index.names.get(key) || [];

    if (rows.includes(entry)) {
      continue;
    }

    rows.push(entry);
    index.names.set(key, rows);
  }
};

// 분류별 인덱스 등록.
const addClassificationEntry = (
  index: ClassificationIndex,
  entry: ClassificationEntry,
) => {
  if (entry.kind !== 'prohibited') {
    addSubstanceNames(index, entry);

    return;
  }

  const document = prepareProhibitedDocument(entry);

  if (!document) {
    return;
  }

  index.prohibited.push(document);
};

// 카탈로그별 인덱스 재사용.
export const getClassificationIndex = (
  catalog: ClassificationEntry[],
): ClassificationIndex => {
  const cached = indexes.get(catalog);

  if (cached) {
    return cached;
  }

  const index: ClassificationIndex = { names: new Map(), prohibited: [] };

  for (const entry of catalog) {
    addClassificationEntry(index, entry);
  }

  indexes.set(catalog, index);

  return index;
};
