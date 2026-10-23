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
  if (
    [
      'pill_data',
      'narcotics',
      'cannabis',
      'psychotropics',
      'prohibited_list',
    ].includes(table)
  ) {
    catalog = undefined;
  }
};

export const getClassificationCatalog = (): Promise<ClassificationCatalog> => {
  if (!catalog) {
    const pending: Promise<ClassificationCatalog> = getDatabase().then(
      async (db) => {
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

        const loaded = {
          entries,
          ingredientAliases: buildIngredientAliasIndex(ingredients),
        };

        // 조회 도중 DB가 갱신됐으면 이전 스냅샷을 상세 결과로 전달하지 않는다.
        return catalog === pending ? loaded : getClassificationCatalog();
      },
    );
    catalog = pending;
    pending.catch(() => {
      if (catalog === pending) {
        catalog = undefined;
      }
    });
  }

  return catalog;
};
