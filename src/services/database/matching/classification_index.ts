import type {
  ClassificationCatalog,
  ClassificationEntry,
  ClassificationIndex,
} from '../types/classification';
import { chemicalNameKey, substanceAliases } from './substance_names';
import { prepareProhibitedDocument } from './prohibited_substances';

const indexes = new WeakMap<ClassificationCatalog, ClassificationIndex>();

// 정식명·이명 인덱스 등록.
const addSubstanceNames = (
  index: ClassificationIndex,
  entry: ClassificationEntry,
) => {
  for (const alias of substanceAliases(entry)) {
    const key = chemicalNameKey(alias);
    const rows = index.names.get(key) || [];

    const hasEntry = rows.includes(entry);

    if (hasEntry) {
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
  const isControlledIngredient = entry.kind !== 'prohibited';

  if (isControlledIngredient) {
    addSubstanceNames(index, entry);

    return;
  }

  const document = prepareProhibitedDocument(entry);

  const hasNoDocument = !document;

  if (hasNoDocument) {
    return;
  }

  index.prohibited.push(document);
};

// 카탈로그별 인덱스 재사용.
export const getClassificationIndex = (
  catalog: ClassificationCatalog,
): ClassificationIndex => {
  const cached = indexes.get(catalog);

  const hasCachedValue = !!cached;

  if (hasCachedValue) {
    return cached;
  }

  const index: ClassificationIndex = { names: new Map(), prohibited: [] };

  for (const entry of catalog.entries) {
    addClassificationEntry(index, entry);
  }

  indexes.set(catalog, index);

  return index;
};
