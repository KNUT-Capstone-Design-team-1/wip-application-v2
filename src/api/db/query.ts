type TPillSearchParam = {
  ITEM_SEQ?: string;
  ITEM_NAME?: string;
  ENTP_NAME?: string;
  COLOR_CLASS1?: string;
  COLOR_CLASS2?: string;
  PRINT_FRONT?: string;
  PRINT_BACK?: string;
  LINE_FRONT?: string;
  LINE_BACK?: string;
  CHARTIN?: string;
  DRUG_SHAPE?: string[];
};

type TPillSearchIdParam = {
  COLOR_CLASS1?: string[];
  COLOR_CLASS2?: string[];
  PRINT_FRONT?: string;
  PRINT_BACK?: string;
  DRUG_SHAPE?: string[];
}

type TPillSearchImageParam = {
  ITEM_SEQ: string[]
}

/**
 *
 * @returns
 */
function getColumnOfOperator() {
  return {
    andCols: ['ITEM_SEQ', 'ITEM_NAME', 'ENTP_NAME'],
    orCols: [
      'COLOR_CLASS1',
      'COLOR_CLASS2',
      'PRINT_FRONT',
      'PRINT_BACK',
      'LINE_FRONT',
      'LINE_BACK',
      'CHARTIN',
    ],
    inCols: ['DRUG_SHAPE'],
  };
}

/**
 * 알약 검색을 위한 쿼리 필터 생성
 * @param param 검색 속성
 * @returns
 */
function getQueryByType(param: TPillSearchParam) {
  const { andCols, orCols, inCols } = getColumnOfOperator();

  let andQuery = '';
  let orQuery = '';
  let inQuery = '';
  const params: string[] = [];

  let index = 0;

  for (const [column, value] of Object.entries(param)) {
    if (andCols.includes(column)) {
      const queryStr = `${column} CONTAINS[c] $${index}`;

      andQuery += !andQuery ? queryStr : ` AND ${queryStr}`;
      params.push(value as string);

      index += 1;
    }

    if (orCols.includes(column)) {
      const queryStr = `${column} CONTAINS[c] $${index}`;

      orQuery += !orQuery ? queryStr : ` OR ${queryStr}`;
      params.push(value as string);

      index += 1;
    }

    if (inCols.includes(column)) {
      (value as string[]).forEach((v) => {
        const queryStr = `${column} == $${index}`;

        inQuery += !inQuery ? queryStr : ` OR ${queryStr}`;
        params.push(v);

        index += 1;
      });
    }
  }

  let filter = '';
  [andQuery, orQuery, inQuery].forEach((query) => {
    if (query) {
      filter += filter ? ` OR (${query})` : `(${query})`;
    }
  });

  return { filter, params };
}
//TODO: Search Id 쿼리 만들기 => string similarity check
function getQueryForSearchId(param: TPillSearchIdParam) {

  let filter = '';
  let index = 0;
  const params: string[] = []

  for (const [column, value] of Object.entries(param)) {
    if (['COLOR_CLASS1', 'COLOR_CLASS2', 'DRUG_SHAPE'].includes(column)) {
      const arr = [...value]
      const queryStr = `${column} CONTAINS[c] {${arr.map((val) => {
        params.push(val)
        return `$${index++}`
      }).join(',')}}`
      filter += filter ? ` OR ${queryStr}` : `${queryStr}`
    } else {
      if (value === "") continue

      const queryStr = `${column} CONTAINS[c] $${index++}`
      params.push(value as string)
      filter += filter ? ` OR ${queryStr}` : `${queryStr}`
    }
  }

  return { filter, params }
}

function getQueryForSearchImage(param: TPillSearchImageParam) {

  const filter = `ITEM_SEQ CONTAINS[c] {${param.ITEM_SEQ.map((v, idx) => `$${idx}`).join(',')}}`
  const params = param.ITEM_SEQ

  return { filter, params }
}

export type {
  TPillSearchImageParam,
  TPillSearchIdParam
}

export {
  getQueryByType,
  getQueryForSearchImage,
  getQueryForSearchId
}
