import { getQueryForSearchId, getQueryForSearchImage } from "@/api/db/query";
import { searchDataState } from "@/atoms/query";
import { selector } from "recoil";

export const searchFilterParams = selector({
  key: 'searchFilterParams',
  get: ({ get }) => {
    const searchData = get(searchDataState);
    if (!searchData.data) return { filter: undefined, params: undefined, initData: null };
    const { filter, params } = searchData.mode == 1
      ? getQueryForSearchImage(searchData.data)
      : getQueryForSearchId(searchData.data)
    return { filter, params, initData: searchData.data };
  },
})