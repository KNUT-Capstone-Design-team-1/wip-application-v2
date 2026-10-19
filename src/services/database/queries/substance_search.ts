import {
  ClassificationKind,
  getClassificationCatalog,
} from './classification_catalog';
import { findControlledMatches } from '../matching/classification_matcher';
import { chemicalNameKey, substanceAliases } from '../matching/substance_names';
import { ICannabis } from '../types';

export const assertSubstanceSearch = (
  params: Record<string, unknown>,
  keys: readonly string[],
): boolean => {
  for (const [key, value] of Object.entries(params)) {
    if (!keys.includes(key)) {
      throw new TypeError(`Unsupported substance search parameter: ${key}`);
    }

    if (
      value !== undefined &&
      (typeof value !== 'string' ||
        !value.replace(/[\u200B-\u200D\uFEFF]/g, '').trim())
    ) {
      return false;
    }
  }

  return true;
};

interface Params {
  containedInKr?: string;
  containedInEn?: string;
  chemicalNameKr?: string;
  chemicalNameEn?: string;
}
export const getContainedSubstances = async (
  kind: Exclude<ClassificationKind, 'prohibited'>,
  params: Params,
  options: { page: number; limit: number },
): Promise<ICannabis[]> => {
  const catalog = await getClassificationCatalog();
  const kr =
    params.containedInKr !== undefined
      ? new Set(findControlledMatches(catalog, params.containedInKr))
      : null;
  const en =
    params.containedInEn !== undefined
      ? new Set(findControlledMatches(catalog, params.containedInEn))
      : null;
  const rows = catalog
    .filter(
      (row) =>
        row.kind === kind && (!kr || kr.has(row)) && (!en || en.has(row)),
    )
    .filter((row) =>
      [params.chemicalNameKr, params.chemicalNameEn].every(
        (search) =>
          search === undefined ||
          substanceAliases(row).some((alias) =>
            chemicalNameKey(alias).includes(chemicalNameKey(search)),
          ),
      ),
    )
    .map((row) => ({
      chemicalNameKr: row.kr,
      chemicalNameEn: row.en,
      synonyms: row.synonyms || '',
      casNumber: row.casNumber || '',
      isomerCasNumber: row.isomerCasNumber || '',
      molecularFormula: row.molecularFormula || '',
      molecularWeight: row.molecularWeight || '',
    }));
  const { page = 1, limit = 30 } = options;

  return rows.slice((page - 1) * limit, page * limit);
};
