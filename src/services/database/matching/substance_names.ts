import type {
  IngredientAliasIndex,
  IngredientNamePair,
  IngredientTranslation,
  SubstanceNameEntry,
} from '../types/classification';

// 성분 구분자와 화학명 내부의 위치번호(2,5-...), 괄호를 구분한다.
export const splitChemicalList = (value = ''): string[] => {
  const text = value.replace(/\[M\d+\]/gi, '');
  const parts: string[] = [];
  let depth = 0,
    start = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    const opensGroup = '([{'.includes(char);

    if (opensGroup) {
      depth++;
    }

    const closesGroup = ')]}'.includes(char);

    if (closesGroup) {
      depth = Math.max(0, depth - 1);
    }

    const numericComma =
      char === ',' &&
      /\d/.test(text[i - 1] || '') &&
      /^\s*\d/.test(text.slice(i + 1));

    const isSeparator =
      !depth && (/[\/|;\n]/.test(char) || (char === ',' && !numericComma));

    if (isSeparator) {
      parts.push(text.slice(start, i).trim());
      start = i + 1;
    }
  }

  parts.push(text.slice(start).trim());

  return parts.filter(Boolean);
};

export const normalizeChemicalText = (value: string): string =>
  value
    .normalize('NFKC')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .toLowerCase()
    .replace(/[‐‑‒–—−]/g, '-')
    .replace(/[αɑ]/g, 'alpha')
    .replace(/[βß]/g, 'beta')
    .replace(/γ/g, 'gamma')
    .replace(/[δΔ]/g, 'delta')
    .replace(/[’‘]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

// 위치번호/입체이성질체는 유지한다. 공백·하이픈 표기 차이만 허용한다.
export const chemicalNameKey = (value: string): string =>
  normalizeChemicalText(value).replace(/[\s-]+/g, '');

const englishSuffix =
  /(?:\s+|^)(?:(?:mono|di|tri|tetra|penta|hemi|sesqui)?hydrate|anhydrous|micronized|hydrochloride|hydrobromide|bromide|xinafoate|bromhydrate|bitartrate|tartrate|sulfate|sulphate|phosphate|maleate|fumarate|citrate|mesylate|besylate|oxalate|nitrate|sodium|potassium|calcium)(?:\s*\((?:\d+(?:\.\d+)?:\d+(?:\.\d+)?)\))?$/i;
const koreanSuffix =
  /(?:[일이삼사오육칠팔구십반]?수화물|무수물|염산염|브롬화수소산염|황산염|인산염|타르타르산염|주석산염|말레산염|푸마르산염|시트르산염|구연산염|메실산염|베실산염|옥살산염|질산염|나트륨|칼륨|칼슘)$/;

// 화학 구조를 바꾸는 acetyl/메틸/ethyl 등은 제거하지 않는다.
export const ingredientNameVariants = (value: string): string[] => {
  const original = value.replace(/\[M\d+\]/gi, '').trim();
  let base = normalizeChemicalText(original)
    .replace(/\((?:미분화|무수물|수화물|micronized|anhydrous)\)/gi, ' ')
    .replace(/^(?:anhydrous|micronized|diluted?)\s+/i, '')
    .trim();
  const variants = [original, base];

  while (base) {
    const next = base
      .replace(englishSuffix, '')
      .replace(koreanSuffix, '')
      .trim();

    const hasNoBaseName = !next;

    if (hasNoBaseName) {
      return [];
    }

    const isUnchangedName = next === base;

    if (isUnchangedName) {
      break;
    }

    variants.push(next);
    base = next;
  }

  return [...new Set(variants.filter(Boolean))];
};

export const substanceAliases = (entry: SubstanceNameEntry): string[] => {
  const names = [
    entry.kr,
    entry.en,
    ...splitChemicalList(entry.synonyms || ''),
    entry.casNumber || '',
  ];

  for (const name of [...names]) {
    // '엑스터시(Ecstasy)' 같은 이명만 분리한다. 화학식의 괄호는 보존한다.
    const bilingual = name.match(/^([가-힣\s]+)\(([a-zA-Z\s]+)\)$/);

    const hasBilingualName = !!bilingual;

    if (hasBilingualName) {
      names.push(bilingual[1], bilingual[2]);
    }
  }

  return [
    ...new Set(names.filter((name) => chemicalNameKey(name).length >= 2)),
  ];
};

// 단일 한영 성분 쌍만 정규화하며 복합제와 불완전한 쌍은 제외한다.
const getIngredientTranslation = (
  row: IngredientNamePair,
): IngredientTranslation | undefined => {
  const kr = splitChemicalList(row.MAIN_ITEM_INGR || '');
  const en = splitChemicalList(row.MATERIAL_ENG_NAME || '');

  const isAmbiguousPair =
    kr.length !== 1 ||
    en.length !== 1 ||
    !/[가-힣]/.test(kr[0]) ||
    !/[a-z]/i.test(en[0]) ||
    /[가-힣]/.test(en[0]);

  if (isAmbiguousPair) {
    return undefined;
  }

  const korean = ingredientNameVariants(kr[0]).at(-1);
  const english = ingredientNameVariants(en[0]).at(-1);

  const hasIncompletePair = !korean || !english;

  if (hasIncompletePair) {
    return undefined;
  }

  return [korean, english];
};

// 현재 DB의 단일 성분 한영 대응만 사용한다. 복합제의 순서는 추정하지 않는다.
export const buildIngredientAliasIndex = (
  rows: IngredientNamePair[],
): IngredientAliasIndex => {
  const pairs = new Map<string, Map<string, IngredientTranslation>>();

  for (const row of rows) {
    const translation = getIngredientTranslation(row);
    const hasTranslation = !!translation;

    if (!hasTranslation) {
      continue;
    }

    const [korean, english] = translation;
    const key = chemicalNameKey(korean);
    const options = pairs.get(key) || new Map();
    options.set(chemicalNameKey(english), [korean, english]);
    pairs.set(key, options);
  }

  const aliases = new Map<string, string[]>();
  const add = (name: string, alias: string) => {
    const key = chemicalNameKey(name);
    aliases.set(key, [...new Set([...(aliases.get(key) || []), alias])]);
  };

  for (const options of pairs.values()) {
    // 같은 국문명에 서로 다른 영문명이 있으면 변환하지 않는다.
    const hasSingleTranslation = options.size === 1;

    if (hasSingleTranslation) {
      const [kr, en] = [...options.values()][0];
      add(kr, en);
      add(en, kr);
    }
  }

  return aliases;
};

// 기존 성분 표기 정규화는 유지하고 한영 대응만 현재 DB에서 확장한다.
export const expandIngredientNames = (
  value: string,
  aliases?: IngredientAliasIndex,
): string[] => {
  const variants = ingredientNameVariants(value);

  return [
    ...new Set(
      variants.flatMap((name) => [
        name,
        ...(aliases?.get(chemicalNameKey(name)) || []),
      ]),
    ),
  ];
};

export const ingredientKeys = (
  text: string,
  aliases?: IngredientAliasIndex,
): Set<string> =>
  new Set(
    splitChemicalList(text)
      .flatMap((name) => expandIngredientNames(name, aliases))
      .map(chemicalNameKey)
      .filter(Boolean),
  );
