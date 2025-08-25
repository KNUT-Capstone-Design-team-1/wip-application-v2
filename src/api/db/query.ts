type TPillSearchParam = {
  COLOR_CLASS1: string[];
  COLOR_CLASS2: string[];
  PRINT_FRONT: string;
  PRINT_BACK: string;
  PRODUCT: string;
  COMPANY: string;
  DRUG_SHAPE: string[];
  LINE_FRONT: string[];
  LINE_BACK: string[];
  CHART: string[];
  MARK: string;
};

/**
 * 알약 검색을 위한 쿼리 필터 생성
 * @param param 검색 속성
 * @returns
 */
function getQueryForSearch(param: TPillSearchParam | null) {
  if (!param) {
    return { filter: '', params: [] };
  }
  let filter = '';
  let index = 0;
  const printFilter: string[] = [];
  const filters: string[] = [];
  const params: string[] = [];

  if (param.PRINT_FRONT !== '') {
    printFilter.push(
      `PRINT_FRONT LIKE[c] $${index++} OR PRINT_BACK LIKE[c] $${index++}`,
    );
    params.push(param.PRINT_FRONT);
    params.push(param.PRINT_FRONT);
  }

  if (param.PRINT_BACK !== '') {
    printFilter.push(
      `PRINT_BACK LIKE[c] $${index++} OR PRINT_FRONT LIKE[c] $${index++}`,
    );
    params.push(param.PRINT_BACK);
    params.push(param.PRINT_BACK);
  }

  if (printFilter.length > 0) {
    filters.push('(' + printFilter.join(' OR ') + ')');
  }

  if (param.COLOR_CLASS1.length !== 0) {
    filters.push(
      `(COLOR_CLASS1 CONTAINS[c] {${param.COLOR_CLASS1.map((v) => {
        params.push(v);
        return `$${index++}`;
      }).join(', ')}} OR COLOR_CLASS2 CONTAINS[c] {${param.COLOR_CLASS2.map(
        (v) => {
          params.push(v);
          return `$${index++}`;
        },
      ).join(', ')}})`,
    );
  }

  if (param.DRUG_SHAPE.length !== 0) {
    filters.push(
      `DRUG_SHAPE LIKE[c] {${param.DRUG_SHAPE.map((v) => {
        params.push(v);
        return `$${index++}`;
      }).join(', ')}}`,
    );
  }

  filter = filters.join(' AND ');

  return { filter, params };
}

export type { TPillSearchParam };

export { getQueryForSearch };
