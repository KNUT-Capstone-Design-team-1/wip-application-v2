import { requestPillImageFeatureExtraction } from '@services/apis/google_cloud/wip_pill_image_feature_extraction';
import {
  getPillDataCount,
  getPillDatas,
} from '@services/database/queries/pill_data';
import { File } from 'expo-file-system';

/**
 * 이미지에서 알약 특징(모양, 색상, 식별문자 등) 추출
 * @param frontUri 앞면 이미지 URI
 * @param backUri 뒷면 이미지 URI
 * @returns 추출된 특징 파라미터 객체
 */
const extractPillFeatures = async (frontUri: string, backUri: string) => {
  const [frontBase64, backBase64] = await Promise.all([
    new File(frontUri).base64(),
    new File(backUri).base64(),
  ]);

  const extractionResult = await requestPillImageFeatureExtraction({
    front: frontBase64,
    back: backBase64,
  });

  if (!extractionResult) {
    throw new Error(`No extractionResult`);
  }

  return {
    PRINT_FRONT: extractionResult.PRINT_FRONT,
    PRINT_BACK: extractionResult.PRINT_BACK,
    DRUG_SHAPE: extractionResult.SHAPE,
    COLOR_CLASS1: extractionResult.COLOR,
  };
};

/**
 * 추출된 특징 중 하나라도 유효한 값이 존재하는지 검증
 */
const hasExtractedFeatures = (param: any): boolean => {
  if (!param) return false;

  const isNotEmpty = (val: unknown) => {
    if (!val) return false;
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === 'string') return val.trim().length > 0;
    return false;
  };

  return (
    isNotEmpty(param.PRINT_FRONT) ||
    isNotEmpty(param.PRINT_BACK) ||
    isNotEmpty(param.DRUG_SHAPE) ||
    isNotEmpty(param.COLOR_CLASS1)
  );
};

/**
 * 추출된 특징 파라미터 기반으로 로컬 DB에서 알약 데이터 검색
 * @param searchParam 추출된 검색용 파라미터 객체
 * @returns 전체 검색 데이터 개수 및 결과 목록
 */
const searchPillData = async (searchParam: any) => {
  const totalDataCount = await getPillDataCount(searchParam);
  const results = await getPillDatas(searchParam, { page: 1, limit: 30 });
  return { totalDataCount, results };
};

export { extractPillFeatures, hasExtractedFeatures, searchPillData };
