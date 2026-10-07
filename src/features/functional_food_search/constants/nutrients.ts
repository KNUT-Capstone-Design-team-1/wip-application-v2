import { INutrientField } from '../types';

/**
 * 상세 화면 영양성분 표에 표시할 필드 정의 (순서 = 표시 순서)
 * 값이 비어있는 성분은 화면에서 자동으로 숨긴다
 */
export const NUTRIENT_FIELDS: INutrientField[] = [
  { key: 'energy', label: '에너지', unit: 'kcal' },
  { key: 'carbohydrate', label: '탄수화물', unit: 'g' },
  { key: 'sugars', label: '당류', unit: 'g' },
  { key: 'dietaryFiber', label: '식이섬유', unit: 'g' },
  { key: 'protein', label: '단백질', unit: 'g' },
  { key: 'fat', label: '지방', unit: 'g' },
  { key: 'saturatedFattyAcids', label: '포화지방산', unit: 'g' },
  { key: 'transFattyAcids', label: '트랜스지방산', unit: 'g' },
  { key: 'cholesterol', label: '콜레스테롤', unit: 'mg' },
  { key: 'sodium', label: '나트륨', unit: 'mg' },
  { key: 'moisture', label: '수분', unit: 'g' },
  { key: 'ash', label: '회분', unit: 'g' },
  { key: 'calcium', label: '칼슘', unit: 'mg' },
  { key: 'iron', label: '철', unit: 'mg' },
  { key: 'phosphorus', label: '인', unit: 'mg' },
  { key: 'potassium', label: '칼륨', unit: 'mg' },
  { key: 'vitaminA', label: '비타민 A', unit: 'µg RAE' },
  { key: 'retinol', label: '레티놀', unit: 'µg' },
  { key: 'betaCarotene', label: '베타카로틴', unit: 'µg' },
  { key: 'thiamine', label: '티아민', unit: 'mg' },
  { key: 'riboflavin', label: '리보플라빈', unit: 'mg' },
  { key: 'niacin', label: '니아신', unit: 'mg' },
  { key: 'vitaminC', label: '비타민 C', unit: 'mg' },
  { key: 'vitaminD', label: '비타민 D', unit: 'µg' },
];

/**
 * 상세 화면 상단 제품 정보 표에 표시할 필드 정의
 */
export const PRODUCT_INFO_FIELDS: {
  key:
    | 'manufacturerName'
    | 'importerName'
    | 'distributorName'
    | 'representativeFoodName'
    | 'foodMajorCategoryName'
    | 'servingSize'
    | 'servingWeightVolume'
    | 'dailyIntakeFrequency'
    | 'intakeTarget'
    | 'itemReportNumber'
    | 'originCountryName';
  label: string;
}[] = [
  { key: 'representativeFoodName', label: '대표식품' },
  { key: 'foodMajorCategoryName', label: '분류' },
  { key: 'manufacturerName', label: '제조사' },
  { key: 'importerName', label: '수입업체' },
  { key: 'distributorName', label: '유통업체' },
  { key: 'originCountryName', label: '원산지' },
  { key: 'servingSize', label: '1회 분량' },
  { key: 'servingWeightVolume', label: '1회 중량/부피' },
  { key: 'dailyIntakeFrequency', label: '1일 섭취횟수' },
  { key: 'intakeTarget', label: '섭취대상' },
  { key: 'itemReportNumber', label: '품목제조신고번호' },
];
