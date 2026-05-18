import { useSearchIdStore } from '../store/search_id_store';
import {
  SECTION_KEY_TO_STORE_KEY,
  SECTION_KEY_TO_TEXT_STORE_KEYS,
} from '../constants/pillIdentificationData';
import { ISearchIdStore } from '../types/search_id_types';

export const useSearchIdForm = () => {
  const storeValues = useSearchIdStore();

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

    // store가 비어있거나 '전체'만 있으면 index 0 반환
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

  const getTextInputValue = (sectionKey: string, dataIndex: number): string => {
    const storeKeys = SECTION_KEY_TO_TEXT_STORE_KEYS[sectionKey];
    if (!storeKeys || !storeKeys[dataIndex]) return '';

    const storeKey = storeKeys[dataIndex] as keyof ISearchIdStore;
    const value = storeValues[storeKey];

    return typeof value === 'string' ? value : '';
  };

  return { getSelectedIndexesFromStore, getTextInputValue };
};
