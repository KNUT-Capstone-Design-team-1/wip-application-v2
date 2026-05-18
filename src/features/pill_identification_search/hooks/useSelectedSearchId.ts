import { useSearchIdStore } from '../store/search_id_store';
import { useMarkStore } from '../store/mark_store';
import { getPillDatas } from '@services/database/queries/pill_data';
import { TPillDataSearchParam } from '@services/database/types';
import { router } from 'expo-router';
import { useSearchResultListStore } from '../../pill_search_result_list/store/search_result_list_store';
import { SEARCH_ALL_LABEL } from '../constants/identificationSearch';
import logger from '@utils/logger';

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
        `[PILL-IDENTIFICATION-SEARCH-HOOK] Failed to search pill datas: ${e.estack || e}`,
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
const getCurrentValueByKey = (store: any, key: string): string[] | null => {
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

// 배열 토글 로직 (순수 함수)
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
const buildSearchParam = (raw: any): Partial<TPillDataSearchParam> => {
  const filtered: any = {};

  // 식별 문자 처리
  const processPrint = (
    text: string,
    isExact: boolean,
    normalKey: string,
    exactKey: string,
  ) => {
    const trimmed = text?.trim();
    if (!trimmed) {
      return;
    }

    if (isExact) {
      filtered[exactKey] = trimmed;
    } else {
      filtered[normalKey] = trimmed;
    }
  };

  processPrint(
    raw.PRINT_FRONT,
    raw.isExactMatch,
    'PRINT_FRONT',
    'PRINT_FRONT_EXACTLY',
  );

  processPrint(
    raw.PRINT_BACK,
    raw.isExactMatch,
    'PRINT_BACK',
    'PRINT_BACK_EXACTLY',
  );

  // 문자열 필드 처리
  const textFields = [
    'ITEM_NAME',
    'ENTP_NAME',
    'MARK_CODE_FRONT',
    'MARK_CODE_BACK',
  ];

  textFields.forEach((key) => {
    const val = raw[key]?.trim();

    if (val) {
      filtered[key] = val;
    }
  });

  // 배열 필드 처리
  const arrayFields = [
    'DRUG_SHAPE',
    'COLOR_CLASS1',
    'COLOR_CLASS2',
    'LINE_FRONT',
    'LINE_BACK',
    'FORM_CODE',
  ];

  arrayFields.forEach((key) => {
    const arr = raw[key] || [];

    const valid = arr.filter(
      (item: string) => item !== SEARCH_ALL_LABEL && item.trim(),
    );

    if (valid.length > 0) {
      filtered[key] = valid;
    }
  });

  return filtered;
};
