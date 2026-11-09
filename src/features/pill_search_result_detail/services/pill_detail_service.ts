import { pillDetailRepository } from '../data/repositories/pill_detail_repository';
import type { IPillDetail } from '../types/pill_detail_type';
import { getDrivingWarningKeywords } from './driving_warning_service';
import { checkSteroidIngredients } from './steroid_ingredient_service';
import { checkSpecialClassifications } from './special_classification_service';

export const pillDetailService = {
  // 기본 정보는 성분 분류 준비를 기다리지 않고 먼저 반환한다.
  async getBasicDetail(itemSeq: string): Promise<IPillDetail | null> {
    const basicData = await pillDetailRepository.getPillData(itemSeq);

    const hasNoBasicData = !basicData;

    if (hasNoBasicData) {
      return null;
    }

    return {
      ...basicData,
      ...checkSteroidIngredients(basicData),
    };
  },

  getClassificationDetail(basic: IPillDetail) {
    return checkSpecialClassifications(
      basic.MAIN_ITEM_INGR || '',
      basic.MATERIAL_ENG_NAME || '',
      pillDetailRepository,
    );
  },

  // 서버 상세 문서와 운전 주의 정보를 조합한다.
  async getRemoteDetail(itemSeq: string): Promise<Partial<IPillDetail> | null> {
    try {
      const detail = await pillDetailRepository.getPillDetail(itemSeq);
      const drivingWarningKeywords = getDrivingWarningKeywords(
        detail.EE_DOC_DATA,
        detail.UD_DOC_DATA,
        detail.NB_DOC_DATA,
      );

      return {
        ...detail,
        isDrivingWarning: drivingWarningKeywords.length > 0,
        drivingWarningKeywords,
      };
    } catch {
      return null;
    }
  },
};
