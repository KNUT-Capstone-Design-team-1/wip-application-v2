import { getDatabase } from '../sqlite';
import type {
  IFunctionalFoodClassification,
  IHealthFunctionalFoodRawMaterial,
  TFunctionalFoodSearchParam,
} from '../types';

const PRODUCT_TABLE = 'health_functional_food_raw_material';
const CLASSIFICATION_TABLE = 'functional_food_classification';
const LINKS = 'json_each(p.CLASSIFICATION_IDS)';
const contains = (value: string) =>
  '%' + value.replace(/[!%_]/g, (char) => '!' + char) + '%';

/** 미분류 제품도 검색 결과에 포함하며 분류 필터만 참조 ID로 결합한다. */
export function buildFunctionalFoodWhere(
  params: TFunctionalFoodSearchParam = {},
) {
  const clauses: string[] = [];
  const values: string[] = [];
  if (params.keyword?.trim()) {
    clauses.push("p.PRDLST_NM LIKE ? ESCAPE '!'");
    values.push(contains(params.keyword.trim()));
  }
  if (params.manufacturer?.trim()) {
    clauses.push("p.BSSH_NM LIKE ? ESCAPE '!'");
    values.push(contains(params.manufacturer.trim()));
  }
  if (params.productForm?.trim()) {
    clauses.push('TRIM(p.PRDT_SHAP_CD_NM) = ?');
    values.push(params.productForm.trim());
  }
  if (params.classificationName) {
    clauses.push(
      `EXISTS (SELECT 1 FROM ${LINKS} link JOIN ${CLASSIFICATION_TABLE} c ON c.id = link.value WHERE c.PRDCT_NM = ?)`,
    );
    values.push(params.classificationName);
  }
  return {
    where: clauses.length ? 'WHERE ' + clauses.join(' AND ') : '',
    values,
  };
}

/** 하나의 제품에 분류가 여럿이어도 EXISTS로 중복 행을 방지한다. */
export async function getFunctionalFoods(
  params: TFunctionalFoodSearchParam = {},
  options = { page: 1, limit: 30 },
) {
  const { where, values } = buildFunctionalFoodWhere(params);
  const db = await getDatabase();
  const page = Math.max(1, Math.floor(options.page));
  const limit = Math.max(1, Math.floor(options.limit));
  return db.getAllAsync<IHealthFunctionalFoodRawMaterial>(
    `WITH page AS (
       SELECT p.rowid AS product_rowid FROM ${PRODUCT_TABLE} p ${where}
       ORDER BY p.PRMS_DT DESC, p.PRDLST_REPORT_NO LIMIT ? OFFSET ?
     )
     SELECT p.* FROM page
     JOIN ${PRODUCT_TABLE} p ON p.rowid = page.product_rowid
     ORDER BY p.PRMS_DT DESC, p.PRDLST_REPORT_NO`,
    [...values, limit, (page - 1) * limit],
  );
}

export async function getFunctionalFoodsCount(
  params: TFunctionalFoodSearchParam = {},
) {
  const { where, values } = buildFunctionalFoodWhere(params);
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) AS count FROM ${PRODUCT_TABLE} p ${where}`,
    values,
  );
  return result?.count ?? 0;
}

export async function getFunctionalFoodByReportNumber(reportNumber: string) {
  const db = await getDatabase();
  return db.getFirstAsync<IHealthFunctionalFoodRawMaterial>(
    `SELECT * FROM ${PRODUCT_TABLE} WHERE PRDLST_REPORT_NO = ? LIMIT 1`,
    [reportNumber],
  );
}

/** 분류 ID 참조를 이용해 두 테이블을 JOIN한다. */
export async function getFunctionalFoodClassifications(reportNumber: string) {
  const db = await getDatabase();
  return db.getAllAsync<IFunctionalFoodClassification>(
    `SELECT c.* FROM ${PRODUCT_TABLE} p JOIN ${LINKS} link JOIN ${CLASSIFICATION_TABLE} c ON c.id = link.value WHERE p.PRDLST_REPORT_NO = ? ORDER BY c.PRDCT_NM, c.id`,
    [reportNumber],
  );
}

export async function getFunctionalFoodCategoryNames() {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{ name: string }>(
    `SELECT DISTINCT c.PRDCT_NM AS name FROM ${PRODUCT_TABLE} p JOIN ${LINKS} link JOIN ${CLASSIFICATION_TABLE} c ON c.id = link.value ORDER BY name`,
  );
  return rows
    .map((row) => row.name)
    .filter((name) => /^[\p{L}\p{N}\s]+$/u.test(name));
}

/** 실제 제품에 등록된 제품형태를 검색 필터로 제공한다. */
export async function getFunctionalFoodProductForms() {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{ name: string }>(
    `SELECT DISTINCT TRIM(PRDT_SHAP_CD_NM) AS name FROM ${PRODUCT_TABLE} WHERE PRDT_SHAP_CD_NM IS NOT NULL ORDER BY name`,
  );
  return rows
    .map((row) => row.name)
    .filter((name) => name !== '해당없음' && /^[\p{L}\p{N}\s]+$/u.test(name));
}
