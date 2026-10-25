import { getDatabase } from '../sqlite';
import { buildIngredientAliasIndex } from '../matching/substance_names';
import type {
  ClassificationCatalog,
  ClassificationEntry,
  IngredientNamePair,
} from '../types/classification';

let catalog: Promise<ClassificationCatalog> | undefined;

// 갱신 중 시작된 이전 조회도 다음 조회의 캐시로 재사용하지 않는다.
export const invalidateClassificationCatalog = (table: string) => {
  const affectsClassification = [
    'pill_data',
    'narcotics',
    'cannabis',
    'psychotropics',
    'prohibited_list',
  ].includes(table);

  if (affectsClassification) {
    catalog = undefined;
  }
};

// DB 조회와 캐시 세대 관리를 분리한다.
const readClassificationCatalog = async (): Promise<ClassificationCatalog> => {
  const db = await getDatabase();

  const entries = await db.getAllAsync<ClassificationEntry>(
    `SELECT 'narcotic' AS kind, chemicalNameKr AS kr, chemicalNameEn AS en, '' AS contents, synonyms, casNumber, isomerCasNumber, molecularFormula, molecularWeight FROM narcotics
       UNION ALL SELECT 'cannabis', chemicalNameKr, chemicalNameEn, '', synonyms, casNumber, isomerCasNumber, molecularFormula, molecularWeight FROM cannabis
       UNION ALL SELECT 'psychotropic', chemicalNameKr, chemicalNameEn, '', synonyms, casNumber, isomerCasNumber, molecularFormula, molecularWeight FROM psychotropics
       UNION ALL SELECT 'prohibited', '', '', contents, '', '', '', '', '' FROM prohibited_list WHERE contents IS NOT NULL AND length(trim(contents)) > 0`,
  );
  const ingredients = await db.getAllAsync<IngredientNamePair>(
    `SELECT DISTINCT MAIN_ITEM_INGR, MATERIAL_ENG_NAME FROM pill_data
         WHERE MAIN_ITEM_INGR IS NOT NULL AND MATERIAL_ENG_NAME IS NOT NULL`,
  );

  return {
    entries,
    ingredientAliases: buildIngredientAliasIndex(ingredients),
  };
};

export const getClassificationCatalog = (): Promise<ClassificationCatalog> => {
  const cached = catalog;
  const hasCachedCatalog = !!cached;

  if (hasCachedCatalog) {
    return cached;
  }

  const pending: Promise<ClassificationCatalog> =
    readClassificationCatalog().then((loaded) => {
      // 조회 중 DB가 갱신됐으면 최신 조회로 연결한다.
      const isCurrentCatalog = catalog === pending;

      return isCurrentCatalog ? loaded : getClassificationCatalog();
    });

  catalog = pending;

  pending.catch(() => {
    const isCurrentCatalog = catalog === pending;

    if (isCurrentCatalog) {
      catalog = undefined;
    }
  });

  return pending;
};
