import { getPillDatasByItemSeq } from '@services/database/queries/pill_data';
import { getNarcotics } from '@services/database/queries/narcotics';
import { getCannabis } from '@services/database/queries/cannabis';
import { getPsychotropics } from '@services/database/queries/psychotropics';
import { getProhibitedList } from '@services/database/queries/prohibited_list';
import {
  IPillData,
  TNarcoticsSearchParam,
  TCannabisSearchParam,
  TPsychotropicsSearchParam,
  TProhibitedListSearchParam,
} from '@services/database/types';

export const pillDetailSqliteDataSource = {
  // 로컬 데이터베이스에서 알약 기본 정보를 조회한다.
  async getPillData(itemSeq: string): Promise<IPillData | null> {
    const results = await getPillDatasByItemSeq([itemSeq]);

    return results[0] ?? null;
  },

  // 마약류 성분을 조회한다.
  searchNarcotics(params: Partial<TNarcoticsSearchParam>) {
    return getNarcotics(params, { page: 1, limit: 100 });
  },

  // 대마 성분을 조회한다.
  searchCannabis(params: Partial<TCannabisSearchParam>) {
    return getCannabis(params, { page: 1, limit: 100 });
  },

  // 향정신성 성분을 조회한다.
  searchPsychotropics(params: Partial<TPsychotropicsSearchParam>) {
    return getPsychotropics(params, { page: 1, limit: 100 });
  },

  // 금지 성분을 조회한다.
  searchProhibitedList(params: Partial<TProhibitedListSearchParam>) {
    return getProhibitedList(params, { page: 1, limit: 100 });
  },
};
