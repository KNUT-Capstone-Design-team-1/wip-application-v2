type TPillSearchParam = {
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

  if (param.ITEM_NAME !== '') {
    filters.push(`ITEM_NAME LIKE[c] $${index++}`);
    params.push(param.ITEM_NAME);
  }

  if (param.ENTP_NAME !== '') {
    filters.push(`ENTP_NAME LIKE[c] $${index++}`);
    params.push(param.ENTP_NAME);
  }

  if (param.FORM_CODE.length > 0) {
    const codes = param.FORM_CODE;
    const codeFilters: string[] = [];

    codes.forEach((code) => {
      if (code === '기타') {
        // "정제", "연질", "경질" 이 아닌 경우
        codeFilters.push(
          `NOT (ITEM_NAME CONTAINS[c] $${index} OR CHART CONTAINS[c] $${index} OR ITEM_NAME CONTAINS[c] $${index + 1} OR CHART CONTAINS[c] $${index + 1} OR ITEM_NAME CONTAINS[c] $${index + 2} OR CHART CONTAINS[c] $${index + 2})`
        );
        params.push('정제', '연질', '경질');
        index += 3;
      } else {
        // 예: "연질" 포함된 데이터
        codeFilters.push(
          `(ITEM_NAME CONTAINS[c] $${index} OR CHART CONTAINS[c] $${index})`
        );
        params.push(code);
        index += 1;
      }
    });

    filters.push(codeFilters.join(' OR ')); // 여러 코드일 경우 OR 연결
  }


  if (param.LINE_FRONT.length > 0 || param.LINE_BACK.length > 0) {
    const lineFilters: string[] = [];

    if (param.LINE_FRONT.length > 0 && param.LINE_BACK.length > 0) {
      // LINE_FRONT = 'A' AND LINE_BACK = 'B') OR (LINE_FRONT = 'B' AND LINE_BACK = 'A')
      for (const front of param.LINE_FRONT) {
        for (const back of param.LINE_BACK) {
          const frontParam = `$${index++}`;
          const backParam = `$${index++}`;
          params.push(front);
          params.push(back);
          lineFilters.push(
            `(LINE_FRONT LIKE[c] ${frontParam} AND LINE_BACK LIKE[c] ${backParam})`,
          );

          // 역순도 추가
          const backParam2 = `$${index++}`;
          const frontParam2 = `$${index++}`;
          params.push(back);
          params.push(front);
          lineFilters.push(
            `(LINE_FRONT LIKE[c] ${frontParam2} AND LINE_BACK LIKE[c] ${backParam2})`,
          );
        }
      }
    } else if (param.LINE_FRONT.length > 0) {
      lineFilters.push(
        `LINE_FRONT LIKE[c] {${param.LINE_FRONT.map((v) => {
          params.push(v);
          return `$${index++}`;
        }).join(', ')}}`,
      );
    } else if (param.LINE_BACK.length > 0) {
      lineFilters.push(
        `LINE_BACK LIKE[c] {${param.LINE_BACK.map((v) => {
          params.push(v);
          return `$${index++}`;
        }).join(', ')}}`,
      );
    }

    if (lineFilters.length > 0) {
      filters.push('(' + lineFilters.join(' OR ') + ')');
    }
  }

  // 마크 데이터 기준 쿼리 작성
  if (param.MARK_CODE_FRONT !== '' || param.MARK_CODE_BACK !== '') {
    const markFilters: string[] = [];

    // FRONT 값이 있으면 조건 추가
    if (param.MARK_CODE_FRONT !== '') {
      markFilters.push(`MARK_CODE_FRONT LIKE[c] $${index++}`);
      params.push(param.MARK_CODE_FRONT);
    }

    // BACK 값이 있으면 조건 추가
    if (param.MARK_CODE_BACK !== '') {
      markFilters.push(`MARK_CODE_BACK LIKE[c] $${index++}`);
      params.push(param.MARK_CODE_BACK);
    }

    // OR 조건으로 묶기
    if (markFilters.length > 0) {
      filters.push('(' + markFilters.join(' OR ') + ')');
    }
  }


  filter = filters.join(' AND ');

  return { filter, params };
}

export type { TPillSearchParam };

export { getQueryForSearch };
