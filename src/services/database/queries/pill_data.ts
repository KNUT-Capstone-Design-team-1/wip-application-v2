import { getDatabase } from '../sqlite';
import {
  IPillData,
  TPillDataSearchParam,
  TQuerySearchParamResult,
  TWhereQueryClauseFunc,
} from '../types';
import { buildWhereClause } from '../util';

const ALL_PILL_DATA_COLUMNS: (keyof IPillData)[] = [
  'ITEM_SEQ',
  'ITEM_NAME',
  'ENTP_SEQ',
  'ENTP_NAME',
  'CHART',
  'ITEM_IMAGE',
  'PRINT_FRONT',
  'PRINT_BACK',
  'DRUG_SHAPE',
  'COLOR_CLASS1',
  'COLOR_CLASS2',
  'LINE_FRONT',
  'LINE_BACK',
  'LENGTH_LONG',
  'LENGTH_SHORT',
  'LENGTH_THICK',
  'IMG_REGIST_TS',
  'CLASS_NO',
  'CLASS_NAME',
  'ETC_OTC_CODE',
  'ITEM_PERMIT_DATE',
  'FORM_CODE',
  'DRUG_SHAPE_FRONT',
  'DRUG_SHAPE_BACK',
  'MARK_IMAGE_FRONT',
  'MARK_IMAGE_BACK',
  'MARK_CODE_FRONT',
  'MARK_CODE_BACK',
  'CHANGE_DATE',
  'BUSINESS_LICENCE_NUMBER',
  'ITEM_ENG_NAME',
  'COVERAGE_ENG_NAME',
  'BAR_CODE',
  'APPROVAL_TYPE',
  'CANCEL_STATUS',
  'CANCEL_DATE',
  'ENTP_ENG_NAME',
  'ENTP_PERMIT_NO',
  'MATERIAL_NAME',
  'MATERIAL_ENG_NAME',
  'EE_DOC_DATA',
  'UD_DOC_DATA',
  'NB_DOC_DATA',
  'ATT_DOC_DATA',
  'STORAGE_METHOD',
  'REEXAM_TARGET_YN',
  'REEXAM_CONT',
  'VALID_TERM',
  'PACK_UNIT',
  'INSURANCE_CODE',
  'DRUG_CLASS',
  'FINISH_MATERIAL_YN',
  'NEW_DRUG_YN',
  'INDUTY_CODE',
  'CHANGE_CONTENT',
  'TOTAL_CONTENT',
  'MAIN_ITEM_INGR',
  'INGR_NAME',
  'ATC_CODE',
  'ENTP_BIZ_NO',
  'RARE_DRUG_YN',
  'OEM_ENTP_NAME',
] as const;

/**
 * pill_data 테이블 조회를 위한 WHERE param 생성
 * @param params 조회할 데이터
 * @returns
 */
const getPillDataWhereQuery: TWhereQueryClauseFunc = (
  params: Partial<TPillDataSearchParam>,
): TQuerySearchParamResult<TPillDataSearchParam> => {
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

  const queryMap: TQuerySearchParamResult<TPillDataSearchParam> = {
    ITEM_SEQ: {
      query: `ITEM_SEQ = ?`,
      values: (itemSeq: string) => [itemSeq],
    },
    ENTP_SEQ: {
      query: `ENTP_SEQ = ?`,
      values: (entpSeq: string) => [entpSeq],
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
    BAR_CODE: {
      query: `BAR_CODE = ?`,
      values: (barCode: string) => [barCode],
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
    // 식별문자의 경우 중간에 공백이나 특수문자가 들어갈 수 있어 %L%I%K%E% 형식으로 조회한다
    PRINT_FRONT: {
      query: `(PRINT_FRONT LIKE ? OR PRINT_BACK LIKE ?)`,
      values: (printFront: string) => [
        `%${printFront.split('').join('%')}%`,
        `%${printFront.split('').join('%')}%`,
      ],
    },
    PRINT_FRONT_EXACTLY: {
      query: `PRINT_FRONT = ?`,
      values: (printFront: string) => [printFront],
    },
    // 식별문자의 경우 중간에 공백이나 특수문자가 들어갈 수 있어 %L%I%K%E% 형식으로 조회한다
    PRINT_BACK: {
      query: `(PRINT_BACK LIKE ? OR PRINT_FRONT LIKE ?)`,
      values: (printBack: string) => [
        `%${printBack.split('').join('%')}%`,
        `%${printBack.split('').join('%')}%`,
      ],
    },
    PRINT_BACK_EXACTLY: {
      query: `PRINT_BACK = ?`,
      values: (printBack: string) => [printBack],
    },
    IMG_REGIST_TS: {
      query: `IMG_REGIST_TS = ?`,
      values: (imgRegistTs: string) => [imgRegistTs],
    },
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
    DRUG_SHAPE_FRONT: {
      query: `DRUG_SHAPE_FRONT LIKE ?`,
      values: (val: string) => [`%${val}%`],
    },
    DRUG_SHAPE_BACK: {
      query: `DRUG_SHAPE_BACK LIKE ?`,
      values: (val: string) => [`%${val}%`],
    },
    MARK_IMAGE_FRONT: {
      query: `MARK_IMAGE_FRONT LIKE ?`,
      values: (val: string) => [`%${val}%`],
    },
    MARK_IMAGE_BACK: {
      query: `MARK_IMAGE_BACK LIKE ?`,
      values: (val: string) => [`%${val}%`],
    },
    CHANGE_DATE: {
      query: `CHANGE_DATE = ?`,
      values: (val: string) => [val],
    },
    BUSINESS_LICENCE_NUMBER: {
      query: `BUSINESS_LICENCE_NUMBER = ?`,
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
    APPROVAL_TYPE: {
      query: `APPROVAL_TYPE = ?`,
      values: (val: string) => [val],
    },
    CANCEL_STATUS: {
      query: `CANCEL_STATUS = ?`,
      values: (val: string) => [val],
    },
    CANCEL_DATE: {
      query: `CANCEL_DATE = ?`,
      values: (val: string) => [val],
    },
    ENTP_ENG_NAME: {
      query: `ENTP_ENG_NAME LIKE ?`,
      values: (val: string) => [`%${val}%`],
    },
    ENTP_PERMIT_NO: {
      query: `ENTP_PERMIT_NO = ?`,
      values: (val: string) => [val],
    },
    MATERIAL_ENG_NAME: {
      query: `MATERIAL_ENG_NAME LIKE ?`,
      values: (val: string) => [`%${val}%`],
    },
    EE_DOC_DATA: {
      query: `EE_DOC_DATA LIKE ?`,
      values: (val: string) => [`%${val}%`],
    },
    UD_DOC_DATA: {
      query: `UD_DOC_DATA LIKE ?`,
      values: (val: string) => [`%${val}%`],
    },
    NB_DOC_DATA: {
      query: `NB_DOC_DATA LIKE ?`,
      values: (val: string) => [`%${val}%`],
    },
    ATT_DOC_DATA: {
      query: `ATT_DOC_DATA LIKE ?`,
      values: (val: string) => [`%${val}%`],
    },
    REEXAM_TARGET_YN: {
      query: `REEXAM_TARGET_YN = ?`,
      values: (val: string) => [val],
    },
    REEXAM_CONT: {
      query: `REEXAM_CONT LIKE ?`,
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
    FINISH_MATERIAL_YN: {
      query: `FINISH_MATERIAL_YN = ?`,
      values: (val: string) => [val],
    },
    NEW_DRUG_YN: {
      query: `NEW_DRUG_YN = ?`,
      values: (val: string) => [val],
    },
    INDUTY_CODE: {
      query: `INDUTY_CODE = ?`,
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
    ATC_CODE: {
      query: `ATC_CODE = ?`,
      values: (val: string) => [val],
    },
    ENTP_BIZ_NO: {
      query: `ENTP_BIZ_NO = ?`,
      values: (val: string) => [val],
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

  if (params.DRUG_SHAPE && params.DRUG_SHAPE.length > 0) {
    queryMap.DRUG_SHAPE = {
      query: `DRUG_SHAPE IN (${params.DRUG_SHAPE.map(() => '?').join(', ')})`,
      values: (drugShape: string[]) => [...drugShape],
    };
  }

  if (params.COLOR_CLASS1 && params.COLOR_CLASS1.length > 0) {
    queryMap.COLOR_CLASS1 = {
      query: `(COLOR_CLASS1 IN (${params.COLOR_CLASS1.map(() => '?').join(', ')}) 
               OR COLOR_CLASS2 IN (${params.COLOR_CLASS1.map(() => '?').join(', ')}))`,
      values: (colorClass1: string[]) => [...colorClass1, ...colorClass1],
    };
  }

  if (params.COLOR_CLASS2 && params.COLOR_CLASS2.length > 0) {
    queryMap.COLOR_CLASS2 = {
      query: `(COLOR_CLASS2 IN (${params.COLOR_CLASS2.map(() => '?').join(', ')}) 
               OR COLOR_CLASS1 IN (${params.COLOR_CLASS2.map(() => '?').join(', ')}))`,
      values: (colorClass2: string[]) => [...colorClass2, ...colorClass2],
    };
  }

  if (params.LINE_FRONT && params.LINE_FRONT.length > 0) {
    queryMap.LINE_FRONT = {
      query: `(LINE_FRONT IN (${params.LINE_FRONT.map(() => '?').join(', ')}) 
               OR LINE_BACK IN (${params.LINE_FRONT.map(() => '?').join(', ')}))`,
      values: (lineFront: string[]) => [...lineFront, ...lineFront],
    };
  }

  if (params.LINE_BACK && params.LINE_BACK.length > 0) {
    queryMap.LINE_BACK = {
      query: `(LINE_BACK IN (${params.LINE_BACK.map(() => '?').join(', ')})
               OR LINE_FRONT IN (${params.LINE_BACK.map(() => '?').join(', ')}))`,
      values: (lineBack: string[]) => [...lineBack, ...lineBack],
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

/**
 * 알약 데이터 목록 조회
 * @param params 검색 조건
 * @param queryOption 쿼리 옵션
 * @returns
 */
export const getPillDatas = async (
  params: Partial<TPillDataSearchParam>,
  queryOption: { page: number; limit: number },
) => {
  const db = await getDatabase();

  const { whereClause, whereValues } = buildWhereClause(
    getPillDataWhereQuery,
    params,
  );

  const sql = `SELECT ${ALL_PILL_DATA_COLUMNS} FROM pill_data ${whereClause}
               LIMIT ?, ?`;

  const { page = 1, limit = 30 } = queryOption;
  const offset = (page - 1) * limit;

  const result = await db.getAllAsync<IPillData>(sql, [
    ...whereValues,
    offset,
    limit,
  ]);

  return result;
};

/**
 * ID 값인 ITEM_SEQ를 기준으로 알약 데이터 목록 조회
 * @param itemSeqs ITEM_SEQ 배열
 * @returns
 */
export const getPillDatasByItemSeq = async (itemSeqs: string[]) => {
  if (itemSeqs.length === 0) {
    return [];
  }

  const db = await getDatabase();

  const sql = `SELECT ${ALL_PILL_DATA_COLUMNS} FROM pill_data 
               WHERE ITEM_SEQ IN (${itemSeqs.map(() => '?').join(', ')})`;

  const result = await db.getAllAsync<IPillData>(sql, itemSeqs);

  return result;
};
