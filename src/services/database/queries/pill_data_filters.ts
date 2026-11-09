import type {
  TPillDataSearchParam,
  TQuerySearchParamResult,
  TWhereQueryClauseFunc,
  IWhereQueryClause,
} from '../types';

const ETC_FORM_CODE = '기타';
const NON_ETC_FORM_CODE = ['정제', '연질캡슐', '경질캡슐'];

const generateFormCodeParam = (param: string) => {
  switch (param) {
    // 정제의 경우 FORM_CODE에 *정으로 들어간다
    case '정제':
      return `%${param.replace(/제/, '')}`;

    case '연질캡슐':
    case '경질캡슐':
      return `%${param.replace(/캡슐/, '')}%`;

    default:
      return `%${param}%`;
  }
};

const generateFormCodeQuery = (formCodes: string[]) => {
  if (!formCodes.length) {
    return '';
  }

  const whereClause: string[] = [];

  const hasETCFormCode = formCodes.some((v) => v === ETC_FORM_CODE);

  if (hasETCFormCode) {
    whereClause.push(
      `(${NON_ETC_FORM_CODE.map(() => `FORM_CODE NOT LIKE ?`).join(' AND ')})`,
    );
  }

  const nonETCFormCodeParams = formCodes.filter((v) => v !== ETC_FORM_CODE);

  if (nonETCFormCodeParams.length) {
    whereClause.push(
      `(${nonETCFormCodeParams.map(() => `FORM_CODE LIKE ?`).join(' OR ')})`,
    );
  }

  return `(${whereClause.join(' OR ')})`;
};

// 양면 검색과 가중치 규칙을 한 곳에서 관리한다.
const createExactPrintFilter = (
  front: string,
  back: string,
): IWhereQueryClause => ({
  query: `(${front} = ? OR ${back} = ?)`,
  values: (value: string) => [value, value],
});

const createPrintFilter = (front: string, back: string): IWhereQueryClause => ({
  query: `(${front} LIKE ? OR ${back} LIKE ?)`,
  values: (value: string) => {
    const pattern = '%' + value.split('').join('%') + '%';
    return [pattern, pattern];
  },
  weight: {
    query:
      '(' +
      [front, back]
        .map(
          (column) => `
      CASE WHEN ${column} = ? THEN 100
           WHEN ${column} LIKE ? THEN 60
           WHEN ${column} LIKE ? THEN 30 ELSE 0 END
    `,
        )
        .join(' + ') +
      ')',
    values: (value: string) => [
      value,
      value + '%',
      '%' + value + '%',
      value,
      value + '%',
      '%' + value + '%',
    ],
  },
});

const ARRAY_FILTER_COLUMNS = {
  DRUG_SHAPE: ['DRUG_SHAPE'],
  COLOR_CLASS1: ['COLOR_CLASS1', 'COLOR_CLASS2'],
  COLOR_CLASS2: ['COLOR_CLASS2', 'COLOR_CLASS1'],
  LINE_FRONT: ['LINE_FRONT', 'LINE_BACK'],
  LINE_BACK: ['LINE_BACK', 'LINE_FRONT'],
} as const;

const BASE_FILTERS: TQuerySearchParamResult<TPillDataSearchParam> = {
  ITEM_SEQ: {
    query: `ITEM_SEQ = ?`,
    values: (itemSeq: string) => [itemSeq],
  },

  ITEM_NAME: {
    query: `ITEM_NAME LIKE ?`,
    values: (itemName: string) => [`%${itemName}%`],
  },
  ENTP_NAME: {
    query: `ENTP_NAME LIKE ?`,
    values: (entpName: string) => [`%${entpName}%`],
  },
  ITEM_PERMIT_DATE: {
    query: `ITEM_PERMIT_DATE = ?`,
    values: (itemPermitDate: string) => [itemPermitDate],
  },
  ETC_OTC_CODE: {
    query: `ETC_OTC_CODE = ?`,
    values: (etcOtcCode: string) => [etcOtcCode],
  },
  CHART: {
    query: `CHART LIKE ?`,
    values: (chart: string) => [`%${chart}%`],
  },

  MATERIAL_NAME: {
    query: `MATERIAL_NAME LIKE ?`,
    values: (materialName: string) => [`%${materialName}%`],
  },
  VALID_TERM: {
    query: `VALID_TERM LIKE ?`,
    values: (validTerm: string) => [`%${validTerm}%`],
  },
  STORAGE_METHOD: {
    query: `STORAGE_METHOD LIKE ?`,
    values: (storageMethod: string) => [`%${storageMethod}%`],
  },
  PACK_UNIT: {
    query: `PACK_UNIT LIKE ?`,
    values: (packUnit: string) => [`%${packUnit}%`],
  },
  MAIN_ITEM_INGR: {
    query: `MAIN_ITEM_INGR LIKE ?`,
    values: (mainItemIngr: string) => [`%${mainItemIngr}%`],
  },
  INGR_NAME: {
    query: `INGR_NAME LIKE ?`,
    values: (ingrName: string) => [`%${ingrName}%`],
  },
  ITEM_IMAGE: {
    query: `ITEM_IMAGE = ?`,
    values: (itemImage: string) => [itemImage],
  },
  PRINT_FRONT: createPrintFilter('PRINT_FRONT', 'PRINT_BACK'),
  PRINT_BACK: createPrintFilter('PRINT_BACK', 'PRINT_FRONT'),
  PRINT_FRONT_EXACTLY: createExactPrintFilter('PRINT_FRONT', 'PRINT_BACK'),
  PRINT_BACK_EXACTLY: createExactPrintFilter('PRINT_BACK', 'PRINT_FRONT'),

  CLASS_NAME: {
    query: `CLASS_NAME LIKE ?`,
    values: (className: string) => [`%${className}%`],
  },
  MARK_CODE_FRONT: {
    query: `(MARK_CODE_FRONT = ? OR MARK_CODE_BACK = ?)`,
    values: (markCodeFront: string) => [markCodeFront, markCodeFront],
  },
  MARK_CODE_BACK: {
    query: `(MARK_CODE_BACK = ? OR MARK_CODE_FRONT = ?)`,
    values: (markCodeBack: string) => [markCodeBack, markCodeBack],
  },
  LENGTH_LONG: {
    query: `LENGTH_LONG = ?`,
    values: (val: string) => [val],
  },
  LENGTH_SHORT: {
    query: `LENGTH_SHORT = ?`,
    values: (val: string) => [val],
  },
  LENGTH_THICK: {
    query: `LENGTH_THICK = ?`,
    values: (val: string) => [val],
  },
  CLASS_NO: {
    query: `CLASS_NO = ?`,
    values: (val: string) => [val],
  },
  CHANGE_DATE: {
    query: `CHANGE_DATE = ?`,
    values: (val: string) => [val],
  },

  ITEM_ENG_NAME: {
    query: `ITEM_ENG_NAME LIKE ?`,
    values: (val: string) => [`%${val}%`],
  },
  COVERAGE_ENG_NAME: {
    query: `COVERAGE_ENG_NAME = ?`,
    values: (val: string) => [val],
  },

  ENTP_ENG_NAME: {
    query: `ENTP_ENG_NAME LIKE ?`,
    values: (val: string) => [`%${val}%`],
  },

  MATERIAL_ENG_NAME: {
    query: `MATERIAL_ENG_NAME LIKE ?`,
    values: (val: string) => [`%${val}%`],
  },

  INSURANCE_CODE: {
    query: `INSURANCE_CODE = ?`,
    values: (val: string) => [val],
  },
  DRUG_CLASS: {
    query: `DRUG_CLASS = ?`,
    values: (val: string) => [val],
  },
  NEW_DRUG_YN: {
    query: `NEW_DRUG_YN = ?`,
    values: (val: string) => [val],
  },
  CHANGE_CONTENT: {
    query: `CHANGE_CONTENT LIKE ?`,
    values: (val: string) => [`%${val}%`],
  },
  TOTAL_CONTENT: {
    query: `TOTAL_CONTENT LIKE ?`,
    values: (val: string) => [`%${val}%`],
  },

  RARE_DRUG_YN: {
    query: `RARE_DRUG_YN = ?`,
    values: (val: string) => [val],
  },
  OEM_ENTP_NAME: {
    query: `OEM_ENTP_NAME LIKE ?`,
    values: (val: string) => [`%${val}%`],
  },
};

export const getPillDataWhereQuery: TWhereQueryClauseFunc = (
  params: Partial<TPillDataSearchParam>,
): TQuerySearchParamResult<TPillDataSearchParam> => {
  const queryMap = { ...BASE_FILTERS };

  for (const key of Object.keys(
    ARRAY_FILTER_COLUMNS,
  ) as (keyof typeof ARRAY_FILTER_COLUMNS)[]) {
    const selected = params[key];
    if (!selected?.length) continue;
    const columns = ARRAY_FILTER_COLUMNS[key];
    const placeholders = selected.map(() => '?').join(', ');
    queryMap[key] = {
      query:
        '(' +
        columns.map((column) => `${column} IN (${placeholders})`).join(' OR ') +
        ')',
      values: (values: string[]) => columns.flatMap(() => values),
    };
  }

  if (params.FORM_CODE && params.FORM_CODE.length > 0) {
    queryMap.FORM_CODE = {
      query: generateFormCodeQuery(params.FORM_CODE),
      values: (formCode: string[]) => {
        const params: string[] = [];

        if (formCode.some((v) => v === ETC_FORM_CODE)) {
          params.push(
            ...NON_ETC_FORM_CODE.map((v) => generateFormCodeParam(v)),
          );
        }

        const nonETCFormCodeParams = formCode.filter(
          (v) => v !== ETC_FORM_CODE,
        );

        if (nonETCFormCodeParams.length) {
          params.push(
            ...nonETCFormCodeParams.map((v) => generateFormCodeParam(v)),
          );
        }

        return params;
      },
    };
  }

  return queryMap;
};
