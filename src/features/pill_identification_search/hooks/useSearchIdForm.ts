import { useSearchIdStore } from '../store/search_id_store';
import {
  SECTION_KEY_TO_STORE_KEY,
  SECTION_KEY_TO_TEXT_STORE_KEYS,
} from '../constants/pillIdentificationData';
import { ISearchIdStore } from '../types';

// 식별 검색 폼의 인덱스 및 입력값 조회를 돕는 헬퍼 커스텀 훅
export const useSearchIdForm = () => {
  const storeValues = useSearchIdStore();

  // 특정 섹션에서 스토어에 저장된 값과 매칭되는 인덱스 목록 계산
  const getSelectedIndexesFromStore = (
    sectionKey: string,
    datas: any[],
  ): number[] => {
    const storeKey = SECTION_KEY_TO_STORE_KEY[
      sectionKey
    ] as keyof ISearchIdStore;

    if (!storeKey) {
      return [0];
    }

    const storeArray = storeValues[storeKey];

    if (!Array.isArray(storeArray)) {
      return [0];
    }

    // store가 비어있거나 기본값만 있으면 기본 인덱스 반환
    const isEmptyStore =
      storeArray.length === 0 ||
      (storeArray.length === 1 && storeArray[0] === '전체');

    if (isEmptyStore) {
      return [0];
    }

    const indexes = datas
      .map((data, index) =>
        storeArray.includes(data.value || data.label) ? index : -1,
      )
      .filter((i) => i !== -1);

    return indexes.length > 0 ? indexes : [0];
  };

  // 텍스트 인풋 값 조회
  const getTextInputValue = (sectionKey: string, dataIndex: number): string => {
    const storeKeys = SECTION_KEY_TO_TEXT_STORE_KEYS[sectionKey];

    if (!storeKeys || !storeKeys[dataIndex]) {
      return '';
    }

    const storeKey = storeKeys[dataIndex] as keyof ISearchIdStore;
    const value = storeValues[storeKey];

    return typeof value === 'string' ? value : '';
  };

  return { getSelectedIndexesFromStore, getTextInputValue };
};
