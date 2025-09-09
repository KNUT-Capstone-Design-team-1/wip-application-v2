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

  /* 
  params 배열 👉 실제 바인딩할 값들을 담는 배열.

$0, $1, $2 … 👉 Realm 쿼리에서 파라미터를 치환하기 위해 쓰는 플레이스홀더.

index 변수 👉 $ 뒤에 붙는 숫자를 자동 증가시켜서 고유한 자리 번호를 만들어 주는 카운터.

즉 index는 쿼리 파라미터 번호를 관리하는 변수야.

만약 param.FORM_CODE = ['정제', '연질'] 이라면:

params.push('정제'), params.push('연질')
👉 params = ['정제', '연질']

index가 0부터 시작한다고 치면

첫 번째 루프에서 "$0"

두 번째 루프에서 "$1"
  
  */
  if (param.FORM_CODE.length > 0) {
    if (param.FORM_CODE.includes('기타')) {
      // "정제", "연질", "경질" 이 아닌 경우만
      filters.push(
        `NOT (FORM_CODE CONTAINS[c] $${index} OR FORM_CODE CONTAINS[c] $${index + 1} OR FORM_CODE CONTAINS[c] $${index + 2})`,
      );
      params.push('정제', '연질', '경질');
      index += 3;
    } else {
      filters.push(
        `FORM_CODE LIKE[c] {${param.FORM_CODE.map((v) => {
          params.push(v);
          return `$${index++}`;
        }).join(', ')}}`,
      );
    }
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

  if (param.MARK_CODE_FRONT !== '' || param.MARK_CODE_BACK !== '') {
    const markFilters: string[] = [];

    if (param.MARK_CODE_FRONT !== '' && param.MARK_CODE_BACK !== '') {
      // MARK_CODE_FRONT = 'A' AND MARK_CODE_BACK = 'B') OR (MARK_CODE_FRONT = 'B' AND MARK_CODE_BACK = 'A'
      const frontParam = `$${index++}`;
      const backParam = `$${index++}`;
      params.push(param.MARK_CODE_FRONT);
      params.push(param.MARK_CODE_BACK);
      markFilters.push(
        `(MARK_CODE_FRONT LIKE[c] ${frontParam} AND MARK_CODE_BACK LIKE[c] ${backParam})`,
      );

      // 역순도 추가
      const backParam2 = `$${index++}`;
      const frontParam2 = `$${index++}`;

      params.push(param.MARK_CODE_BACK);
      params.push(param.MARK_CODE_FRONT);
      markFilters.push(
        `(MARK_CODE_FRONT LIKE[c] ${frontParam2} AND MARK_CODE_BACK LIKE[c] ${backParam2})`,
      );
    } else if (param.MARK_CODE_FRONT !== '') {
      markFilters.push(`MARK_CODE_FRONT LIKE[c] $${index++}`);
      params.push(param.MARK_CODE_FRONT);
    } else if (param.MARK_CODE_BACK !== '') {
      markFilters.push(`MARK_CODE_BACK LIKE[c] $${index++}`);
      params.push(param.MARK_CODE_BACK);
    }

    if (markFilters.length > 0) {
      filters.push('(' + markFilters.join(' OR ') + ')');
    }
  }

  filter = filters.join(' AND ');

  return { filter, params };
}

export type { TPillSearchParam };

export { getQueryForSearch };
