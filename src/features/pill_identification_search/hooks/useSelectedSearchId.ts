import { useCallback } from 'react';
import { useSearchIdStore } from '../store/search_id_store';
import { useMarkStore } from '../store/mark_store';
import {
  getPillDataCount,
  getPillDatas,
} from '@services/database/queries/pill_data';
import { TPillDataSearchParam } from '@services/database/types';
import { router } from 'expo-router';
import { useSearchResultListStore } from '../../pill_search_result_list/store/search_result_list_store';
import { SEARCH_ALL_LABEL } from '../constants/identificationSearch';
import logger from '@utils/logger';
import { ISearchPillData } from '../types/search_id_types';

/**
 * 식별 검색 Hook
 * - 초기 검색 (식별 검색)
 * - 식별 검색 상태 관리
 */

export const useSelectedSearchId = () => {
  const { resetSelectedMark } = useMarkStore();
  const {
    setSearchResultData,
    setIsLoading,
    setSearchParam,
    setTotalDataCount,
  } = useSearchResultListStore();

  // 개별 액션들만 가져와서 핸들러들이 스토어 전체 변경에 반응하지 않도록 함
  const setSideLabelFrontText = useSearchIdStore(
    (state) => state.setSideLabelFrontText,
  );

  const setSideLabelBackText = useSearchIdStore(
    (state) => state.setSideLabelBackText,
  );

  const setProductNameText = useSearchIdStore(
    (state) => state.setProductNameText,
  );

  const setCompanyName = useSearchIdStore((state) => state.setCompanyName);

  const setManufacturerName = useSearchIdStore(
    (state) => state.setManufacturerName,
  );

  const setDividerLineData = useSearchIdStore(
    (state) => state.setDividerLineData,
  );

  const setShape = useSearchIdStore((state) => state.setShape);

  const setColors = useSearchIdStore((state) => state.setColors);

  const resetSelectedSearchId = useSearchIdStore(
    (state) => state.resetSelectedSearchId,
  );

  const getSelectedSearchId = useSearchIdStore(
    (state) => state.getSelectedSearchId,
  );

  const setIsExactMatch = useSearchIdStore((state) => state.setIsExactMatch);

  const isExactMatch = useSearchIdStore((state) => state.isExactMatch);

  // 현재 값들을 가져오기 위한 셀렉터들 (핸들러 내부에서 최신 값을 참조하기 위함)
  const manufacturerName = useSearchIdStore((state) => state.manufacturerName);

  const dividerLineData = useSearchIdStore((state) => state.dividerLineData);

  const shape = useSearchIdStore((state) => state.shape);

  const colors = useSearchIdStore((state) => state.colors);

  /**
   * 텍스트 입력 핸들러
   */
  const searchIdInputChangeHandler = useCallback(
    (text: string, key: string) => {
      switch (key) {
        case 'front':
          setSideLabelFrontText(text);
          break;

        case 'back':
          setSideLabelBackText(text);
          break;

        case 'product':
          setProductNameText(text);
          break;

        case 'company':
          setCompanyName(text);
          break;

        default:
          logger.warn(
            `[SEARCH-ID-INPUT-CHANGE-HANDLER] Unknown input key: ${key}`,
          );
      }
    },
    [
      setSideLabelFrontText,
      setSideLabelBackText,
      setProductNameText,
      setCompanyName,
    ],
  );

  /**
   * 라디오/체크박스 버튼 핸들러
   */
  const radioButtonPressHandler = useCallback(
    (value: string, key: string) => {
      let currentValue: string[] | null = null;
      let setter: (arr: string[] | null) => void = () => {};

      switch (key) {
        case 'manufacturerName':
          currentValue = manufacturerName;
          setter = setManufacturerName;
          break;

        case 'dividerLineData':
          currentValue = dividerLineData;
          setter = setDividerLineData;
          break;

        case 'shape':
          currentValue = shape;
          setter = setShape;
          break;

        case 'colors':
          currentValue = colors;
          setter = setColors;
          break;

        default:
          logger.warn(`[RADIO-BUTTON-PRESS-HANDLER] Unknown input key: ${key}`);
          return;
      }

      const nextValue = getToggledArrayValue(currentValue, value);
      setter(nextValue);
    },
    [
      manufacturerName,
      setManufacturerName,
      dividerLineData,
      setDividerLineData,
      shape,
      setShape,
      colors,
      setColors,
    ],
  );

  /**
   * 검색 실행 로직
   */
  const searchPillDatas = useCallback(async () => {
    try {
      const rawParam = getSelectedSearchId();
      const searchParam = buildSearchParam(rawParam);

      setIsLoading(true);
      router.push('/pill-search-result-list');

      const results = await getPillDatas(searchParam, { page: 1, limit: 30 });
      const totalDataCount = await getPillDataCount(searchParam);

      setSearchParam(searchParam);
      setTotalDataCount(totalDataCount);
      setSearchResultData(results);

      return results;
    } catch (e) {
      logger.error(
        `[PILL-IDENTIFICATION-SEARCH-HOOK] Failed to search pill datas: ${e.stack || e}`,
      );

      setIsLoading(false);

      return [];
    }
  }, [getSelectedSearchId, setIsLoading, setSearchParam, setSearchResultData]);

  /**
   * 초기화 버튼 핸들러
   */
  const resetButtonClickHandler = useCallback(() => {
    resetSelectedSearchId();
    resetSelectedMark();
  }, [resetSelectedSearchId, resetSelectedMark]);

  return {
    searchIdInputChangeHandler,
    radioButtonPressHandler,
    resetButtonClickHandler,
    searchPillDatas,
    setIsExactMatch,
    isExactMatch,
  };
};

// 배열 토글 로직
const getToggledArrayValue = (
  currentArray: string[] | null,
  value: string,
): string[] | null => {
  if (value === SEARCH_ALL_LABEL) {
    return null;
  }

  const list = currentArray ?? [];
  const filtered = list.filter((item) => item !== SEARCH_ALL_LABEL);

  const nextList = filtered.includes(value)
    ? filtered.filter((item) => item !== value)
    : [...filtered, value];

  if (nextList.length === 0) {
    return null;
  }

  return nextList;
};

// 검색 파라미터 빌드 로직
const buildSearchParam = (
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

  // 배열 필드 처리
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
