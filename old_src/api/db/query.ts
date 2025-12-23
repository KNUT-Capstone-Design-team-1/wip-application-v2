export type TPillSearchParam = {
  COLOR_CLASS1: string[];
  COLOR_CLASS2: string[];
  PRINT_FRONT: string;
  PRINT_BACK: string;
  ITEM_NAME: string;
  ENTP_NAME: string;
  DRUG_SHAPE: string[];
  DIVIDING: string[];
  LINE_FRONT: string[];
  LINE_BACK: string[];
  FORM_CODE: string[];
  MARK: string;
  MARK_CODE_FRONT: string;
  MARK_CODE_BACK: string;
};

type TFilterFuncRes = { filter: string; params: string[] };

/**
 * 검색 필터 병합
 * @param filters 검색 필터 배열
 * @treturns
 */
function mergeSearchFilter(filters: TFilterFuncRes[]): TFilterFuncRes {
  if (!filters?.length) {
    return { filter: '', params: [] };
  }

  const totalFilters: string[] = [];
  const totalParams: string[] = [];

  const validateFilters = filters.filter((v) => v.filter && v.params.length);
  let paramsIndex = 0;

  for (let i = 0; i < validateFilters.length; i += 1) {
    const { filter, params } = validateFilters[i];

    totalFilters.push(filter.replace(/\?/g, () => `$${String(paramsIndex++)}`));
    totalParams.push(...params);
  }

  return {
    filter: totalFilters.join(' AND '),
    params: totalParams,
  };
}

/**
 * 앞면 문자 및 뒷면 문자 검색 필터 생성
 * @param front 앞면 문자
 * @param back 뒷면 문자
 * @returns
 */
function generatePrintFilter(front: string, back: string): TFilterFuncRes {
  if (!front && !back) {
    return { filter: '', params: [] };
  }

  const generateParam = (param: string) => `*${param.split('').join('*')}`;

  const printFilters: string[] = [];
  const params: string[] = [];

  if (front) {
    printFilters.push(`(PRINT_FRONT LIKE[c] ? OR PRINT_BACK LIKE[c] ?)`);
    const param = generateParam(front);
    params.push(param, param);
  }

  if (back) {
    printFilters.push(`(PRINT_BACK LIKE[c] ? OR PRINT_FRONT LIKE[c] ?)`);
    const param = generateParam(front);
    params.push(param, param);
  }

  return {
    filter: `(${printFilters.join(' OR ')})`,
    params,
  };
}

/**
 * 알약 색상 검색 필터 생성
 * @param colorClass1 색상1
 * @param colorClass2 색상2
 * @returns
 */
function generateColorClassFilter(
  colorClass1: string[],
  colorClass2: string[],
): TFilterFuncRes {
  if (!colorClass1?.length && !colorClass2?.length) {
    return { filter: '', params: [] };
  }

  const colorFilters: string[] = [];
  const params: string[] = [];

  if (colorClass1?.length) {
    const placeHolder = colorClass1.map(() => `?`).join(', ');
    colorFilters.push(
      `(COLOR_CLASS1 CONTAINS[c] {${placeHolder}} OR COLOR_CLASS2 CONTAINS[c] {${placeHolder}})`,
    );
    params.push(...colorClass1, ...colorClass1);
  }

  if (colorClass2?.length) {
    const placeHolder = colorClass2.map(() => `?`).join(', ');
    colorFilters.push(
      `(COLOR_CLASS2 CONTAINS[c] {${placeHolder}} OR COLOR_CLASS1 CONTAINS[c] {${placeHolder}})`,
    );
    params.push(...colorClass2, ...colorClass2);
  }

  return {
    filter: `(${colorFilters.join(' OR ')})`,
    params,
  };
}

/**
 * 모양 검색 필터 생성
 * @param drugShape 모양
 * @returns
 */
function generateDrugShapeFilter(drugShape: string[]): TFilterFuncRes {
  return {
    filter: `DRUG_SHAPE CONTAINS[c] {${drugShape.map(() => `?`).join(', ')}}`,
    params: drugShape,
  };
}

/**
 * 제품명 검색 필터 생성
 * @param itemName 제품명
 * @returns
 */
function generateItemNameFilter(itemName: string): TFilterFuncRes {
  return {
    filter: itemName ? `ITEM_NAME LIKE[c] ?` : '',
    params: itemName ? [`*${itemName}*`] : [],
  };
}

/**
 * 제조사명 검색 필터 생성
 * @param entpName 제조사명
 * @returns
 */
function generateEntpNameFilter(entpName: string): TFilterFuncRes {
  return {
    filter: entpName ? `ENTP_NAME LIKE[c] ?` : '',
    params: entpName ? [`*${entpName}*`] : [],
  };
}

/**
 * 제형 검색 필터 생성
 * @param formCode 제형
 * @returns
 */
function generateFormCodeFilter(formCode: string[]): TFilterFuncRes {
  if (!formCode?.length) {
    return { filter: '', params: [] };
  }

  const generateParam = (param: string) => {
    switch (param) {
      // 정제의 경우 FORM_CODE에 *정으로 들어간다
      case '정제':
        return `*${param.replace(/제/, '')}`;

      case '연질캡슐':
      case '경질캡슐':
        return `*${param.replace(/캡슐/, '')}*`;

      default:
        return `*${param}*`;
    }
  };
  const etcFormCode = '기타';
  const nonETCFormCode = ['정제', '연질캡슐', '경질캡슐'];

  const formCodeFilters: string[] = [];
  const params: string[] = [];

  const hasETCFormCode = formCode.some((v) => v === etcFormCode);
  if (hasETCFormCode) {
    formCodeFilters.push(
      `(${nonETCFormCode.map(() => `NOT FORM_CODE LIKE[c] ?`).join(' AND ')})`,
    );
    params.push(...nonETCFormCode.map((v) => generateParam(v)));
  }

  const nonETCFormCodeParams = formCode.filter((v) => v !== etcFormCode);
  if (nonETCFormCodeParams.length) {
    formCodeFilters.push(
      `(${nonETCFormCodeParams.map(() => `FORM_CODE LIKE[c] ?`).join(' OR ')})`,
    );
    params.push(...nonETCFormCodeParams.map((v) => generateParam(v)));
  }

  return {
    filter: `(${formCodeFilters.join(' OR ')})`,
    params,
  };
}

/**
 * 분할선 검색 필터 생성
 * @param lineFront 분할선 앞
 * @param lineBack 분할선 뒤
 * @returns
 */
function generateLineFilter(
  lineFront: string[],
  lineBack: string[],
): TFilterFuncRes {
  if (!lineFront?.length && !lineBack?.length) {
    return { filter: '', params: [] };
  }

  const lineFilters: string[] = [];
  const params: string[] = [];

  if (lineFront?.length) {
    const placeHolder = lineFront.map(() => `?`).join(',');
    lineFilters.push(
      `(LINE_FRONT CONTAINS[c] {${placeHolder}} OR LINE_BACK CONTAINS[c] {${placeHolder}})`,
    );
    params.push(...lineFront, ...lineFront);
  }

  if (lineBack?.length) {
    const placeHolder = lineBack.map(() => `?`).join(',');
    lineFilters.push(
      `(LINE_BACK CONTAINS[c] {${placeHolder}} OR LINE_FRONT CONTAINS[c] {${placeHolder}})`,
    );
    params.push(...lineBack, ...lineBack);
  }

  return {
    filter: `(${lineFilters.join(' OR ')})`,
    params,
  };
}

/**
 * 표기 코드 검색 필터 생성
 * @param markCodeFront 표기코드 앞
 * @param markCodeBack 표기코드 뒤
 * @returns
 */
function generateMarkFilter(
  markCodeFront: string,
  markCodeBack: string,
): TFilterFuncRes {
  if (!markCodeFront && !markCodeBack) {
    return { filter: '', params: [] };
  }

  const params: string[] = [];
  const markFilters: string[] = [];

  if (markCodeFront) {
    markFilters.push(`(MARK_CODE_FRONT = ? OR MARK_CODE_BACK = ?)`);
    params.push(markCodeFront, markCodeFront);
  }

  if (markCodeBack) {
    markFilters.push(`(MARK_CODE_BACK = ? OR MARK_CODE_FRONT = ?)`);
    params.push(markCodeBack, markCodeBack);
  }

  return {
    filter: `(${markFilters.join(' OR ')})`,
    params,
  };
}

/**
 * 알약 검색을 위한 쿼리 필터 생성
 * @param param 검색 속성
 * @returns
 */
export function getQueryForSearch(
  param: TPillSearchParam | null,
): TFilterFuncRes {
  if (!param) {
    return { filter: '', params: [] };
  }

  const {
    PRINT_FRONT,
    PRINT_BACK,
    COLOR_CLASS1,
    COLOR_CLASS2,
    DRUG_SHAPE,
    ITEM_NAME,
    ENTP_NAME,
    FORM_CODE,
    LINE_FRONT,
    LINE_BACK,
    MARK_CODE_FRONT,
    MARK_CODE_BACK,
  } = param;

  const filterResults: TFilterFuncRes[] = [];

  const printFilterRes = generatePrintFilter(PRINT_FRONT, PRINT_BACK);
  filterResults.push(printFilterRes);

  const colorClassFilterRes = generateColorClassFilter(
    COLOR_CLASS1,
    COLOR_CLASS2,
  );
  filterResults.push(colorClassFilterRes);

  const drugShapeFilterRes = generateDrugShapeFilter(DRUG_SHAPE);
  filterResults.push(drugShapeFilterRes);

  const itemNameFilterRes = generateItemNameFilter(ITEM_NAME);
  filterResults.push(itemNameFilterRes);

  const entpNameFilterRes = generateEntpNameFilter(ENTP_NAME);
  filterResults.push(entpNameFilterRes);

  const formCodeFilterRes = generateFormCodeFilter(FORM_CODE);
  filterResults.push(formCodeFilterRes);

  const lineFilterRes = generateLineFilter(LINE_FRONT, LINE_BACK);
  filterResults.push(lineFilterRes);

  const markCodeFilterRes = generateMarkFilter(MARK_CODE_FRONT, MARK_CODE_BACK);
  filterResults.push(markCodeFilterRes);

  return mergeSearchFilter(filterResults);
}
