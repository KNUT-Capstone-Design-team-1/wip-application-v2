import { getDatabase } from '../sqlite';

export type ClassificationKind =
  'narcotic' | 'cannabis' | 'psychotropic' | 'prohibited';
export interface ClassificationEntry {
  kind: ClassificationKind;
  kr: string;
  en: string;
  contents: string;
  synonyms?: string;
  casNumber?: string;
  isomerCasNumber?: string;
  molecularFormula?: string;
  molecularWeight?: string;
}

let catalog: Promise<ClassificationEntry[]> | undefined;

// 갱신 중 시작된 이전 조회도 다음 조회의 캐시로 재사용하지 않는다.
export const invalidateClassificationCatalog = (table: string) => {
  if (
    ['narcotics', 'cannabis', 'psychotropics', 'prohibited_list'].includes(
      table,
    )
  ) {
    catalog = undefined;
  }
};

export const getClassificationCatalog = (): Promise<ClassificationEntry[]> => {
  if (!catalog) {
    const pending = getDatabase().then((db) =>
      db.getAllAsync<ClassificationEntry>(
        `SELECT 'narcotic' AS kind, chemicalNameKr AS kr, chemicalNameEn AS en, '' AS contents, synonyms, casNumber, isomerCasNumber, molecularFormula, molecularWeight FROM narcotics
       UNION ALL SELECT 'cannabis', chemicalNameKr, chemicalNameEn, '', synonyms, casNumber, isomerCasNumber, molecularFormula, molecularWeight FROM cannabis
       UNION ALL SELECT 'psychotropic', chemicalNameKr, chemicalNameEn, '', synonyms, casNumber, isomerCasNumber, molecularFormula, molecularWeight FROM psychotropics
       UNION ALL SELECT 'prohibited', '', '', contents, '', '', '', '', '' FROM prohibited_list WHERE contents IS NOT NULL AND length(trim(contents)) > 0`,
      ),
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
