import { TPillDataSearchParam } from '@services/database/types';
import { ISearchPillData } from '@features/pill_identification_search/types/identification_domain_type';
import { SEARCH_ALL_LABEL } from '@features/pill_identification_search/constants/identification_pagination_constant';

export { getToggledArrayValue } from './identification_filter_toggle_service';

// 식별 검색 폼 입력을 SQLite 조회용 SearchParam 객체로 변환하는 빌더 함수
export const buildSearchParam = (
  raw: ISearchPillData,
): Partial<TPillDataSearchParam> => {
  const filtered: Partial<TPillDataSearchParam> = {};

  // 식별 문자 처리 (앞면)
  const frontTrimmed = raw.PRINT_FRONT?.trim();

  if (frontTrimmed && raw.isExactMatch) {
    filtered.PRINT_FRONT_EXACTLY = frontTrimmed;
  }

  if (frontTrimmed && !raw.isExactMatch) {
    filtered.PRINT_FRONT = frontTrimmed;
  }

  // 식별 문자 처리 (뒷면)
  const backTrimmed = raw.PRINT_BACK?.trim();

  if (backTrimmed && raw.isExactMatch) {
    filtered.PRINT_BACK_EXACTLY = backTrimmed;
  }

  if (backTrimmed && !raw.isExactMatch) {
    filtered.PRINT_BACK = backTrimmed;
  }

  // 문자열 필드 처리
  if (raw.ITEM_NAME?.trim()) {
    filtered.ITEM_NAME = raw.ITEM_NAME.trim();
  }

  if (raw.ENTP_NAME?.trim()) {
    filtered.ENTP_NAME = raw.ENTP_NAME.trim();
  }

  if (raw.MARK_CODE_FRONT?.trim()) {
    filtered.MARK_CODE_FRONT = raw.MARK_CODE_FRONT.trim();
  }

  if (raw.MARK_CODE_BACK?.trim()) {
    filtered.MARK_CODE_BACK = raw.MARK_CODE_BACK.trim();
  }

  // 배열 필드 처리 헬퍼 함수
  const processArray = (arr: string[] | null): string[] | undefined => {
    if (!arr) {
      return undefined;
    }

    const valid = arr.filter(
      (item) => item !== SEARCH_ALL_LABEL && item.trim(),
    );

    return valid.length > 0 ? valid : undefined;
  };

  const drugShape = processArray(raw.DRUG_SHAPE);
  if (drugShape) {
    filtered.DRUG_SHAPE = drugShape;
  }

  const colorClass1 = processArray(raw.COLOR_CLASS1);
  if (colorClass1) {
    filtered.COLOR_CLASS1 = colorClass1;
  }

  const colorClass2 = processArray(raw.COLOR_CLASS2);
  if (colorClass2) {
    filtered.COLOR_CLASS2 = colorClass2;
  }

  const lineFront = processArray(raw.LINE_FRONT);
  if (lineFront) {
    filtered.LINE_FRONT = lineFront;
  }

  const lineBack = processArray(raw.LINE_BACK);
  if (lineBack) {
    filtered.LINE_BACK = lineBack;
  }

  const formCode = processArray(raw.FORM_CODE);
  if (formCode) {
    filtered.FORM_CODE = formCode;
  }

  return filtered;
};
