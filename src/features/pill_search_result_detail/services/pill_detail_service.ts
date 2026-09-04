import { IPillDetail } from '../types/pill_detail_type';
import {
  IPillDetailRepository,
  pillDetailRepository,
} from '../data/repositories/pill_detail_repository';
import {
  getDrivingWarningKeywords,
  checkSpecialClassifications,
} from './special_classification_service';

export class PillDetailService {
  constructor(
    private readonly repository: IPillDetailRepository = pillDetailRepository,
  ) {}

  // 로컬 기본 정보와 특수 분류 정보를 조합한다.
  async getBasicDetail(itemSeq: string): Promise<IPillDetail | null> {
    const basicData = await this.repository.getPillData(itemSeq);
    if (!basicData) {
      return null;
    }

    const classifications = await checkSpecialClassifications(
      basicData.MAIN_ITEM_INGR?.replace(/[^가-힣]/g, '') || '',
      basicData.MATERIAL_ENG_NAME || '',
      this.repository,
    );

    return { ...basicData, ...classifications } as IPillDetail;
  }

  // 서버 상세 문서와 운전 주의 정보를 조합한다.
  async getRemoteDetail(itemSeq: string): Promise<Partial<IPillDetail> | null> {
    try {
      const detail = await this.repository.getPillDetail(itemSeq);
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
  }
}

export const pillDetailService = new PillDetailService();
