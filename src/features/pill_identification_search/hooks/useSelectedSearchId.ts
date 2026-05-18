import { useSearchIdStore } from '../store/search_id_store';
import { useMarkStore } from '../store/mark_store';
import { getPillDatas } from '@services/database/queries/pill_data';
import { TPillDataSearchParam } from '@services/database/types';
import { router } from 'expo-router';
import { useSearchResultListStore } from '../../pill_search_result_list/store/search_result_list_store';
import { SEARCH_ALL_LABEL } from '../constants/identificationSearch';
import logger from '@utils/logger';
import { ISearchIdState, ISearchPillData } from '../types/search_id_types';

export const useSelectedSearchId = () => {
  const store = useSearchIdStore();
  const { resetSelectedMark } = useMarkStore();
  const { setSearchResultData, setIsLoading, setSearchParam } =
    useSearchResultListStore();

  /**
   * 텍스트 입력 핸들러
   */
  const searchIdInputChangeHandler = (text: string, key: string) => {
    switch (key) {
      case 'front':
        store.setSideLabelFrontText(text);
        break;

      case 'back':
        store.setSideLabelBackText(text);
        break;

      case 'product':
        store.setProductNameText(text);
        break;

      case 'company':
        store.setCompanyName(text);
        break;

      default:
        logger.warn(
          `[SEARCH-ID-INPUT-CHANGE-HANDLER] Unknown input key: ${key}`,
        );
    }
  };

  /**
   * 라디오/체크박스 버튼 핸들러
   */
  const radioButtonPressHandler = (value: string, key: string) => {
    const updateStore = (nextValue: string[] | null) => {
      switch (key) {
        case 'manufacturerName':
          store.setManufacturerName(nextValue);
          break;

        case 'dividerLineData':
          store.setDividerLineData(nextValue);
          break;

        case 'shape':
          store.setShape(nextValue);
          break;

        case 'colors':
          store.setColors(nextValue);
          break;

        default:
          logger.warn(`[RADIO-BUTTON-PRESS-HANDLER] Unknown input key: ${key}`);
          break;
      }
    };

    const currentValue = getCurrentValueByKey(store, key);
    const nextValue = getToggledArrayValue(currentValue, value);

    updateStore(nextValue);
  };

  /**
   * 검색 실행 로직
   */
  const searchPillDatas = async () => {
    try {
      const rawParam = store.getSelectedSearchId();
      const searchParam = buildSearchParam(rawParam);

      setIsLoading(true);
      router.push('/pill-search-result-list');

      const results = await getPillDatas(searchParam, { page: 1, limit: 30 });

      setSearchParam(searchParam);
      setSearchResultData(results);

      return results;
    } catch (e) {
      logger.error(
        `[PILL-IDENTIFICATION-SEARCH-HOOK] Failed to search pill datas: ${e.stack || e}`,
      );

      setIsLoading(false);

      return [];
    }
  };

  /**
   * 초기화 버튼 핸들러
   */
  const resetButtonClickHandler = () => {
    store.resetSelectedSearchId();
    resetSelectedMark();
  };

  return {
    searchIdInputChangeHandler,
    radioButtonPressHandler,
    resetButtonClickHandler,
    searchPillDatas,
    setIsExactMatch: store.setIsExactMatch,
    isExactMatch: store.isExactMatch,
  };
};

/**
 *  현재 스토어에서 키에 해당하는 값을 안전하게 가져옴
 */
const getCurrentValueByKey = (
  store: ISearchIdState,
  key: string,
): string[] | null => {
  switch (key) {
    case 'manufacturerName':
      return store.manufacturerName;

    case 'dividerLineData':
      return store.dividerLineData;

    case 'shape':
      return store.shape;

    case 'colors':
      return store.colors;

    default:
      logger.warn(`[GET-CURRENT-VALUE-BY-KEY] Unknown input key: ${key}`);
      return null;
  }
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
