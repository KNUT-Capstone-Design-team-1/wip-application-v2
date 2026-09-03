import { useCallback } from 'react';
import { useSearchIdStore } from '../store/search_id_store';
import { useMarkStore } from '../store/mark_store';
import { identificationSearchService } from '../services/identification_search_service';
import { getToggledArrayValue } from '../services/identification_filter_toggle_service';
import { router, usePathname } from 'expo-router';
import { useSearchResultListStore } from '../../pill_search_result_list/store/search_result_list_store';
import logger from '@utils/logger';

// 식별 검색 상태 및 검색 실행 로직을 관리하는 커스텀 훅 (Presentation Layer)
export const useSelectedSearchId = () => {
  const pathname = usePathname();

  const { resetSelectedMark } = useMarkStore();

  const {
    setSearchResultData,
    setIsLoading,
    setSearchParam,
    setTotalDataCount,
  } = useSearchResultListStore();

  // 개별 액션들만 가져와서 불필요한 리렌더링 방지
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

  // 현재 값들을 가져오기 위한 셀렉터들
  const manufacturerName = useSearchIdStore((state) => state.manufacturerName);

  const dividerLineData = useSearchIdStore((state) => state.dividerLineData);

  const shape = useSearchIdStore((state) => state.shape);

  const colors = useSearchIdStore((state) => state.colors);

  // 텍스트 입력 변경 핸들러
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

  // 라디오/체크박스 토글 선택 핸들러
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

  // 식별 검색 실행 핸들러
  const searchPillDatas = useCallback(async () => {
    try {
      const rawParam = getSelectedSearchId();

      setIsLoading(true);

      const isNotInResultScreen = pathname !== '/pill-search-result-list';

      if (isNotInResultScreen) {
        router.push('/pill-search-result-list');
      }

      const { results, totalCount, searchParam } =
        await identificationSearchService.searchPills(rawParam, {
          page: 1,
          limit: 30,
        });

      setSearchParam(searchParam);
      setTotalDataCount(totalCount);
      setSearchResultData(results);

      identificationSearchService.recordSearchAction();

      return results;
    } catch (e) {
      logger.error(
        `[PILL-IDENTIFICATION-SEARCH-HOOK] Failed to search pill datas: ${e}`,
      );

      setIsLoading(false);

      return [];
    }
  }, [
    getSelectedSearchId,
    pathname,
    setIsLoading,
    setSearchParam,
    setSearchResultData,
    setTotalDataCount,
  ]);

  // 검색 조건 전체 초기화 핸들러
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
