import { useSearchIdStore } from '../store/search_id_store';
import { getPillDatas, getPillDatasByItemSeq } from "@/src/services/database/queries/pill_data";
import { getDatabase } from '@/src/services/database/sqlite';
import { IPillDataSearchParam } from '@/src/services/database/types';
import { router } from 'expo-router';
import { useSearchResultListStore } from '../../pill_search_result_list/store/search_result_list_store';

export const useSelecteSearchId = () => {
  const {
    setSideLabelFrontText,
    setSideLabelBackText,
    setProductNameText,
    setCompanyName,
    setManufactureName,
    setDividerLineData,
    setShape,
    setFrontColor,
    setBackColor,

    sideLabelFrontText,
    sideLabelBackText,
    productNameText,
    companyName,
    manufactureName,
    dividerLineData,
    shape,
    frontColor,
    backColor,
    resetSelectedSearchId,
    getSelectedSearchId,
  } = useSearchIdStore();

  const { setSearchResultData, setIsLoading } = useSearchResultListStore();

  const settingDataLog = () => {
    console.log("=== Store 값 확인 ===");
    console.log("앞면 식별표기:", sideLabelFrontText);
    console.log("뒷면 식별표기:", sideLabelBackText);
    console.log("제품명:", productNameText);
    console.log("업체명:", companyName);
    console.log("제조/수입사:", manufactureName);
    console.log("분할선:", dividerLineData);
    console.log("모양:", shape);
    console.log("앞면 색상:", frontColor);
    console.log("뒷면 색상:", backColor);
    console.log("==================");
  };

  const searchIdInputChangeHandler = (text: string, key: string) => {
    switch(key) {
      case "front":
        setSideLabelFrontText(text);
        break;
      case "back":
        setSideLabelBackText(text);
        break;
      case "product":
        setProductNameText(text);
        break;
      case "company":
        setCompanyName(text);
        break;
    }
  };

  const radioButtonPressHandler = (label: string, key: string) => {
    const toggleArrayValue = (currentArray: string[], label: string) => {
      // "전체" 선택 시 배열을 비우고 "전체"만 넣기
      if (label === "전체") {
        return ["전체"];
      }

      // 다른 버튼 선택 시
      let newArray = [...currentArray];

      // "전체"가 있으면 제거
      if (newArray.includes("전체")) {
        newArray = newArray.filter(item => item !== "전체");
      }

      // label이 이미 있으면 제거 (toggle off), 없으면 추가 (toggle on)
      if (newArray.includes(label)) {
        newArray = newArray.filter(item => item !== label);
      } else {
        newArray.push(label);
      }

      // 배열이 비어있으면 "전체" 넣기
      if (newArray.length === 0) {
        newArray = ["전체"];
      }

      return newArray;
    };

    switch(key) {
      case "manufactureName":
        setManufactureName(toggleArrayValue(manufactureName, label));
        break;
      case "dividerLineData":
        setDividerLineData(toggleArrayValue(dividerLineData, label));
        break;
      case "shape":
        setShape(toggleArrayValue(shape, label));
        break;
      case "frontColor":
        setFrontColor(toggleArrayValue(frontColor, label));
        break;
      case "backColor":
        setBackColor(toggleArrayValue(backColor, label));
        break;
    }
  };

  const resetButtonClickHandler = () => {
    resetSelectedSearchId();
  };

  /**
   * 검색 조건에서 "전체" 제거 및 빈 값 필터링
   */
  const filterSearchParam = (rawParam: any): Partial<IPillDataSearchParam> => {
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
      const filtered = arr.filter(item => item !== "전체" && item.trim());
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
        console.warn('검색 조건이 없습니다. 최소 하나 이상의 조건을 입력해주세요.');
        return [];
      }

      // 4. 데이터베이스 검색
      const results = await getPillDatas(searchParam, { page: 1, limit: 30 });

      console.log(`\n검색 결과: ${results.length}개`);

      // 5. 결과 출력 (처음 3개만)
      results.slice(0, 3).forEach((pill, index) => {
        console.log(`\n[${index + 1}] ${pill.ITEM_NAME}`);
        console.log(`  - ITEM_SEQ: ${pill.ITEM_SEQ}`);
        console.log(`  - 업체명: ${pill.ENTP_NAME}`);
        console.log(`  - 모양: ${pill.DRUG_SHAPE}`);
        console.log(`  - 색상: ${pill.COLOR_CLASS1} / ${pill.COLOR_CLASS2}`);
        console.log(`  - 식별표기: ${pill.PRINT_FRONT || '없음'} / ${pill.PRINT_BACK || '없음'}`);
      });

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
      const results = await db.getAllAsync<{ ITEM_SEQ: string; ITEM_NAME: string }>(
        'SELECT ITEM_SEQ, ITEM_NAME FROM pill_data LIMIT 5'
      );

      console.log('=== 예시 ITEM_SEQ 값들 ===');
      results.forEach((item, index) => {
        console.log(`${index + 1}. ITEM_SEQ: "${item.ITEM_SEQ}" - ${item.ITEM_NAME}`);
      });

      return results.map(item => item.ITEM_SEQ);
    } catch (error) {
      console.error('ITEM_SEQ 조회 실패:', error);
      return [];
    }
  };

  /**
   * 테스트용: getPillDatasByItemSeq 함수 테스트
   */
  const testGetPillDatasByItemSeq = async () => {
    try {
      console.log('=== getPillDatasByItemSeq 테스트 시작 ===');

      // 1. 예시 ITEM_SEQ 값들 가져오기
      const itemSeqs = await getSampleItemSeqs();

      if (itemSeqs.length === 0) {
        console.log('조회할 데이터가 없습니다.');
        return;
      }

      console.log('\n검색할 ITEM_SEQ 배열:', itemSeqs);

      // 2. getPillDatasByItemSeq 실행
      const results = await getPillDatasByItemSeq(itemSeqs);

      console.log(`\n검색 결과 개수: ${results.length}개`);

      // 3. 결과 출력
      results.forEach((pill, index) => {
        console.log('pill 값', pill);
        console.log(`\n[${index + 1}] ${pill.ITEM_NAME}`);
        console.log(`  - ITEM_SEQ: ${pill.ITEM_SEQ}`);
        console.log(`  - 업체명: ${pill.ENTP_NAME}`);
        console.log(`  - 모양: ${pill.DRUG_SHAPE}`);
        console.log(`  - 색상(앞/뒤): ${pill.COLOR_CLASS1} / ${pill.COLOR_CLASS2}`);
        console.log(`  - 식별표기(앞/뒤): ${pill.PRINT_FRONT || '없음'} / ${pill.PRINT_BACK || '없음'}`);
        console.log(`  - 분할선(앞/뒤): ${pill.LINE_FRONT || '없음'} / ${pill.LINE_BACK || '없음'}`);
      });

      console.log('\n=== 테스트 완료 ===');
      return results;
    } catch (error) {
      console.error('테스트 실패:', error);
    }
  };

  /**
   * 테스트용: getPillDatas 함수 테스트 (조건 검색)
   * 순서: 로딩 시작 → 페이지 이동 → 검색 → 데이터 설정 (로딩 종료)
   */
  const searchPillDatas = async () => {
    try {
      console.log('🔍 검색 시작');

      // 1. 로딩 상태 활성화
      setIsLoading(true);
      console.log('⏳ 로딩 시작');

      // 2. 즉시 페이지 이동 (로딩 화면 표시)
      router.push('/pill-search-result-list');
      console.log('🚀 페이지 이동 완료');

      // 3. 검색 실행
      const testShape = ["타원형"];
      const testColor = ["분홍"];

      console.log('검색 조건:', { shape: testShape, color: testColor });

      const testSearchParam: Partial<IPillDataSearchParam> = {
        DRUG_SHAPE: testShape,
        COLOR_CLASS1: testColor,
      };

      const results = await getPillDatas(testSearchParam, { page: 1, limit: 30 });

      console.log(`✅ 검색 결과: ${results.length}개`);

      // 4. 결과 미리보기
      results.slice(0, 3).forEach((pill, index) => {
        console.log(`\n[${index + 1}] ${pill.ITEM_NAME}`);
        console.log(`  - ITEM_SEQ: ${pill.ITEM_SEQ}`);
        console.log(`  - 업체명: ${pill.ENTP_NAME}`);
        console.log(`  - 모양: ${pill.DRUG_SHAPE}`);
        console.log(`  - 색상: ${pill.COLOR_CLASS1} / ${pill.COLOR_CLASS2}`);
      });

      // 5. 데이터 저장 (자동으로 로딩 종료됨)
      console.log('📦 Store에 데이터 저장 중...');
      setSearchResultData(results);
      console.log('✅ 완료!');

      return results;
    } catch (error) {
      console.error('❌ 검색 실패:', error);
      console.error('❌ 에러 상세:', error);

      // 에러 발생 시 로딩 종료
      setIsLoading(false);
    }
  };

  return {
    settingDataLog,
    searchIdInputChangeHandler,
    radioButtonPressHandler,
    resetButtonClickHandler,
    searchButtonClickHandler,
    // 테스트용 함수들
    getSampleItemSeqs,
    testGetPillDatasByItemSeq,
    searchPillDatas,
  };
};
