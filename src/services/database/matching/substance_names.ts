import ingredientNamePairs from './ingredient_name_pairs.json';

// 성분 구분자와 화학명 내부의 위치번호(2,5-...), 괄호를 구분한다.
export const splitChemicalList = (value = ''): string[] => {
  const text = value.replace(/\[M\d+\]/gi, '');
  const parts: string[] = [];
  let depth = 0,
    start = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if ('([{'.includes(char)) {
      depth++;
    }

    if (')]}'.includes(char)) {
      depth = Math.max(0, depth - 1);
    }

    const numericComma =
      char === ',' &&
      /\d/.test(text[i - 1] || '') &&
      /^\s*\d/.test(text.slice(i + 1));

    if (!depth && (/[\/|;\n]/.test(char) || (char === ',' && !numericComma))) {
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

    if (!next) {
      return [];
    }

    if (next === base) {
      break;
    }

    variants.push(next);
    base = next;
  }

  return [...new Set(variants.filter(Boolean))];
};

export const substanceAliases = (entry: {
  kr: string;
  en: string;
  synonyms?: string;
  casNumber?: string;
}): string[] => {
  const names = [
    entry.kr,
    entry.en,
    ...splitChemicalList(entry.synonyms || ''),
    entry.casNumber || '',
  ];

  for (const name of [...names]) {
    // '엑스터시(Ecstasy)' 같은 이명만 분리한다. 화학식의 괄호는 보존한다.
    const bilingual = name.match(/^([가-힣\s]+)\(([a-zA-Z\s]+)\)$/);

    if (bilingual) {
      names.push(bilingual[1], bilingual[2]);
    }
  }

  return [
    ...new Set(names.filter((name) => chemicalNameKey(name).length >= 2)),
  ];
};

const translations = new Map<string, string>(
  ingredientNamePairs.map(([kr, en]) => [chemicalNameKey(kr), en]),
);
// 단일 성분 실제 데이터에서 확인한 한영 대응만 사용한다.
export const expandIngredientNames = (value: string): string[] => {
  const variants = ingredientNameVariants(value);

  for (const variant of [...variants]) {
    const translated = translations.get(chemicalNameKey(variant));

    if (translated) {
      variants.push(translated);
    }
  }

  return [...new Set(variants)];
};

export const ingredientKeys = (text: string): Set<string> =>
  new Set(
    splitChemicalList(text)
      .flatMap(expandIngredientNames)
      .map(chemicalNameKey)
      .filter(Boolean),
  );

export const matchesSubstance = (
  entry: Parameters<typeof substanceAliases>[0],
  ingredients: string,
): boolean => {
  const keys = ingredientKeys(ingredients);

  return substanceAliases(entry).some((alias) =>
    keys.has(chemicalNameKey(alias)),
  );
};
