import { useSearchIdStore } from '../store/search_id_store';
import { getPillDatas } from '@services/database/queries/pill_data';
import { getDatabase } from '@services/database/sqlite';
import { TPillDataSearchParam } from '@services/database/types';
import { router } from 'expo-router';
import { useSearchResultListStore } from '../../pill_search_result_list/store/search_result_list_store';

export const useSelecteSearchId = () => {
  const {
    setSideLabelFrontText,
    setSideLabelBackText,
    setProductNameText,
    setCompanyName,
    setManufacturerName,
    setDividerLineData,
    setShape,
    setFrontColor,
    setBackColor,
    manufacturerName,
    dividerLineData,
    shape,
    frontColor,
    backColor,
    resetSelectedSearchId,
    getSelectedSearchId,
  } = useSearchIdStore();

  const { setSearchResultData, setIsLoading, setSearchParam } =
    useSearchResultListStore();

  const searchIdInputChangeHandler = (text: string, key: string) => {
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
    }
  };

  const radioButtonPressHandler = (value: string, key: string) => {
    const toggleArrayValue = (currentArray: string[] | null, value: string) => {
      // "전체" 선택 시 배열을 비우고 "전체"만 넣기
      if (value === '전체') {
        return null;
      }

      // 다른 버튼 선택 시
      let newArray = currentArray ? [...currentArray] : [];

      // "전체"가 있으면 제거
      if (newArray.includes('전체')) {
        newArray = newArray.filter((item) => item !== '전체');
      }

      // value가 이미 있으면 제거 (toggle off), 없으면 추가 (toggle on)
      if (newArray.includes(value)) {
        newArray = newArray.filter((item) => item !== value);
      } else {
        newArray.push(value);
      }

      // 배열이 비어있으면 "전체" 넣기
      if (newArray.length === 0) {
        newArray = null;
      }

      return newArray;
    };

    switch (key) {
      case 'manufacturerName':
        const newManufacturerName = toggleArrayValue(manufacturerName, value);
        setManufacturerName(newManufacturerName);
        break;
      case 'dividerLineData':
        setDividerLineData(toggleArrayValue(dividerLineData, value));
        break;
      case 'shape':
        setShape(toggleArrayValue(shape, value));
        break;
      case 'frontColor':
        setFrontColor(toggleArrayValue(frontColor, value));
        break;
      case 'backColor':
        setBackColor(toggleArrayValue(backColor, value));
        break;
    }
  };

  const resetButtonClickHandler = () => {
    resetSelectedSearchId(); // 식별 검색 초기화
    resetSelectedMark(); // 마크 데이터 초기화
  };

  /**
   * 검색 조건에서 "전체" 제거 및 빈 값 필터링
   */
  const filterSearchParam = (rawParam: any): Partial<TPillDataSearchParam> => {
    const filtered: any = {};

    // 문자열 필드들 - 빈 문자열이 아닌 경우만 추가
    if (rawParam.PRINT_FRONT && rawParam.PRINT_FRONT.trim()) {
      filtered.PRINT_FRONT = rawParam.PRINT_FRONT.trim();
    }
    if (rawParam.PRINT_BACK && rawParam.PRINT_BACK.trim()) {
      filtered.PRINT_BACK = rawParam.PRINT_BACK.trim();
    }
    if (rawParam.ITEM_NAME && rawParam.ITEM_NAME.trim()) {
      filtered.ITEM_NAME = rawParam.ITEM_NAME.trim();
    }
    if (rawParam.ENTP_NAME && rawParam.ENTP_NAME.trim()) {
      filtered.ENTP_NAME = rawParam.ENTP_NAME.trim();
    }

    // 배열 필드들 - "전체" 제거 및 빈 배열이 아닌 경우만 추가
    const filterArray = (arr: string[]) => {
      const filtered = arr.filter((item) => item !== '전체' && item.trim());
      return filtered.length > 0 ? filtered : undefined;
    };

    const drugShapeFiltered = filterArray(rawParam.DRUG_SHAPE || []);
    if (drugShapeFiltered) {
      filtered.DRUG_SHAPE = drugShapeFiltered;
    }

    const colorClass1Filtered = filterArray(rawParam.COLOR_CLASS1 || []);
    if (colorClass1Filtered) {
      filtered.COLOR_CLASS1 = colorClass1Filtered;
    }

    const colorClass2Filtered = filterArray(rawParam.COLOR_CLASS2 || []);
    if (colorClass2Filtered) {
      filtered.COLOR_CLASS2 = colorClass2Filtered;
    }

    const lineFrontFiltered = filterArray(rawParam.LINE_FRONT || []);
    if (lineFrontFiltered) {
      filtered.LINE_FRONT = lineFrontFiltered;
    }

    const lineBackFiltered = filterArray(rawParam.LINE_BACK || []);
    if (lineBackFiltered) {
      filtered.LINE_BACK = lineBackFiltered;
    }

    const formCodeFiltered = filterArray(rawParam.FORM_CODE || []);
    if (formCodeFiltered) {
      filtered.FORM_CODE = formCodeFiltered;
    }

    // 마크 코드 필드들 - 빈 문자열이 아닌 경우만 추가
    if (rawParam.MARK_CODE_FRONT && rawParam.MARK_CODE_FRONT.trim()) {
      filtered.MARK_CODE_FRONT = rawParam.MARK_CODE_FRONT.trim();
    }
    if (rawParam.MARK_CODE_BACK && rawParam.MARK_CODE_BACK.trim()) {
      filtered.MARK_CODE_BACK = rawParam.MARK_CODE_BACK.trim();
    }

    return filtered;
  };

  /**
   * 검색 버튼 클릭 핸들러
   */
  const searchButtonClickHandler = async () => {
    try {
      console.log('=== 알약 검색 시작 ===');

      // 1. store에서 검색 조건 가져오기
      const rawSearchParam = getSelectedSearchId();
      console.log('원본 검색 조건:', rawSearchParam);

      // 2. "전체" 제거 및 빈 값 필터링
      const searchParam = filterSearchParam(rawSearchParam);
      console.log('필터링된 검색 조건:', searchParam);

      // 3. 검색 조건이 하나도 없으면 경고
      if (Object.keys(searchParam).length === 0) {
        console.warn(
          '검색 조건이 없습니다. 최소 하나 이상의 조건을 입력해주세요.',
        );
        return [];
      }

      // 4. 데이터베이스 검색
      const results = await getPillDatas(searchParam, { page: 1, limit: 30 });

      console.log(`\n검색 결과: ${results.length}개`);

      // 5. 결과 출력 (처음 3개만)
      // results.slice(0, 3).forEach((pill, index) => {
      //   console.log(`\n[${index + 1}] ${pill.ITEM_NAME}`);
      //   console.log(`  - ITEM_SEQ: ${pill.ITEM_SEQ}`);
      //   console.log(`  - 업체명: ${pill.ENTP_NAME}`);
      //   console.log(`  - 모양: ${pill.DRUG_SHAPE}`);
      //   console.log(`  - 색상: ${pill.COLOR_CLASS1} / ${pill.COLOR_CLASS2}`);
      //   console.log(
      //     `  - 식별표기: ${pill.PRINT_FRONT || '없음'} / ${pill.PRINT_BACK || '없음'}`,
      //   );
      // });

      if (results.length > 3) {
        console.log(`\n... 외 ${results.length - 3}개`);
      }

      console.log('\n=== 검색 완료 ===');

      return results;
    } catch (error) {
      console.error('검색 실패:', error);
      return [];
    }
  };

  /**
   * 테스트용: 데이터베이스에서 예시 ITEM_SEQ 값들을 조회
   */
  const getSampleItemSeqs = async () => {
    try {
      const db = await getDatabase();

      // 데이터베이스에서 처음 5개의 ITEM_SEQ 조회
      const results = await db.getAllAsync<{
        ITEM_SEQ: string;
        ITEM_NAME: string;
      }>('SELECT ITEM_SEQ, ITEM_NAME FROM pill_data LIMIT 5');

      console.log('=== 예시 ITEM_SEQ 값들 ===');
      results.forEach((item, index) => {
        console.log(
          `${index + 1}. ITEM_SEQ: "${item.ITEM_SEQ}" - ${item.ITEM_NAME}`,
        );
      });

      return results.map((item) => item.ITEM_SEQ);
    } catch (error) {
      console.error('ITEM_SEQ 조회 실패:', error);
      return [];
    }
  };

  /**
   * 테스트용: getPillDatas 함수 테스트 (조건 검색)
   * 순서 : 로딩 시작 -> 페이지 이동하는 작업
   */
  const searchPillDatas = async () => {
    try {
      const selectedResult = getSelectedSearchId();

      console.log('🔍 선택된 검색 조건:', selectedResult);

      // 1. 로딩 상태 활성화
      setIsLoading(true);

      // 2. 즉시 페이지 이동 (로딩 화면 표시)
      router.push('/pill-search-result-list');

      // 3. 검색 실행
      const searchParam: Partial<TPillDataSearchParam> = {
        DRUG_SHAPE: selectedResult.DRUG_SHAPE,
        COLOR_CLASS1: selectedResult.COLOR_CLASS1,
        FORM_CODE: selectedResult.FORM_CODE,
        COLOR_CLASS2: selectedResult.COLOR_CLASS2,
        ITEM_NAME: selectedResult.ITEM_NAME,
        PRINT_FRONT: selectedResult.PRINT_FRONT,
        PRINT_BACK: selectedResult.PRINT_BACK,
        LINE_FRONT: selectedResult.LINE_FRONT,
        LINE_BACK: selectedResult.LINE_BACK,
        MARK_CODE_FRONT: selectedResult.MARK_CODE_FRONT,
        MARK_CODE_BACK: selectedResult.MARK_CODE_BACK,
      };

      console.log('📝 실제 검색 파라미터:', searchParam);

      const results = await getPillDatas(searchParam, {
        page: 1,
        limit: 30,
      });

      console.log(`✅ 검색 결과: ${results.length}개`);

      // 4. 결과 미리보기
      // if (results.length > 0) {
      //   results.slice(0, 3).forEach((pill, index) => {
      //     console.log(`\n[${index + 1}] ${pill.ITEM_NAME}`);
      //     console.log(`  - 제형: ${pill.FORM_CODE}`);
      //     console.log(`  - 분할선(앞/뒤): ${pill.LINE_FRONT} / ${pill.LINE_BACK}`);
      //     console.log(`  - 모양: ${pill.DRUG_SHAPE}`);
      //     console.log(`  - 색상: ${pill.COLOR_CLASS1} / ${pill.COLOR_CLASS2}`);
      //   });
      // } else {
      //   console.log('⚠️ 검색 결과가 없습니다.');
      // }

      // 5. 데이터 저장 (자동으로 로딩 종료됨)

      // 검색한 파라미터 저장 (currentPage: 1로 초기화됨 → loadMorePills는 page: 2부터 시작)
      setSearchParam(searchParam);
      // 검색 결과 저장
      setSearchResultData(results);
      // console.log('✅ 완료!');

      return results;
    } catch (error) {
      console.error('❌ 검색 실패:', error);
      console.error('❌ 에러 상세:', error);

      // 에러 발생 시 로딩 종료
      setIsLoading(false);
    }
  };

  return {
    searchIdInputChangeHandler,
    radioButtonPressHandler,
    resetButtonClickHandler,
    searchButtonClickHandler,
    // 테스트용 함수들
    getSampleItemSeqs,
    searchPillDatas,
  };
};
