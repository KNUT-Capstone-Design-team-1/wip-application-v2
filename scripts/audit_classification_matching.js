/* global __dirname */
/* Run: node scripts/audit_classification_matching.js <resource-directory> */
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
// Run the same pure TypeScript matcher as the application without a native SQLite runtime.
require.extensions['.ts'] = (module, filename) => {
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
      resolveJsonModule: true,
    },
  }).outputText;
  module._compile(code, filename);
};

const directory = process.argv[2];

if (!directory) {
  throw new Error('Provide the resource directory.');
}

const read = (name) =>
  JSON.parse(fs.readFileSync(path.join(directory, name + '.json'), 'utf8'))
    .resources;
const {
  splitChemicalList,
  substanceAliases,
  ingredientNameVariants,
  chemicalNameKey,
} = require('../src/services/database/matching/substance_names.ts');
const {
  findControlledMatches,
  getClassificationIndex,
} = require('../src/services/database/matching/classification_matcher.ts');
const {
  findProhibitedMatches,
} = require('../src/services/database/matching/prohibited_substances.ts');
const catalog = Object.entries({
  cannabis: 'cannabis',
  narcotics: 'narcotic',
  psychotropics: 'psychotropic',
  prohibited_list: 'prohibited',
}).flatMap(([table, kind]) =>
  read(table).map((row) => ({
    ...row,
    kind,
    kr: row.chemicalNameKr || '',
    en: row.chemicalNameEn || '',
    contents: row.contents || '',
  })),
);
const pills = read('pill_data');
const docs = getClassificationIndex(catalog).prohibited;
const ingredients = [
  ...new Set(
    pills.flatMap((pill) => splitChemicalList(pill.MATERIAL_ENG_NAME || '')),
  ),
];
const selfFailures = [];

for (const entry of catalog.filter((row) => row.kind !== 'prohibited')) {
  for (const alias of substanceAliases(entry)) {
    const matches = findControlledMatches(catalog, alias);

    if (!matches.includes(entry)) {
      selfFailures.push({ expected: entry.en, alias });
    }
  }
}

if (process.argv.includes('--write-aliases')) {
  const pairs = new Map();

  for (const pill of pills) {
    const kr = splitChemicalList(pill.MAIN_ITEM_INGR || '');
    const en = splitChemicalList(pill.MATERIAL_ENG_NAME || '');

    // 복합제는 두 언어의 성분 순서가 달라 추측해서 짝짓지 않는다.
    if (kr.length !== 1 || en.length !== 1 || !/[가-힣]/.test(kr[0])) {
      continue;
    }

    if (
      !findControlledMatches(catalog, en[0]).length &&
      !findProhibitedMatches(docs, en[0]).length
    ) {
      continue;
    }

    const korean = ingredientNameVariants(kr[0]).at(-1);
    const english = ingredientNameVariants(en[0]).at(-1);
    const key = chemicalNameKey(korean);
    const options = pairs.get(key) || new Map();
    options.set(chemicalNameKey(english), [korean, english]);
    pairs.set(key, options);
  }

  const aliases = [...pairs.values()]
    .filter((options) => options.size === 1)
    .map((options) => [...options.values()][0])
    .sort((a, b) => a[0].localeCompare(b[0], 'ko'));
  fs.writeFileSync(
    path.join(
      __dirname,
      '../src/services/database/matching/ingredient_name_pairs.json',
    ),
    JSON.stringify(aliases, null, 2) + '\n',
  );
}

const report = {
  pills: pills.length,
  classifiedRows: catalog.length,
  positiveSections: docs.map((doc) => doc.section),
  uniqueEnglishIngredients: ingredients.length,
  selfFailures,
  prohibited: ingredients.flatMap((ingredient) =>
    findProhibitedMatches(docs, ingredient).map((match) => ({
      ingredient,
      matched: match.ingredient,
      section: match.section,
    })),
  ),
};
console.log(JSON.stringify(report, null, 2));

if (selfFailures.length) {
  process.exitCode = 1;
}
