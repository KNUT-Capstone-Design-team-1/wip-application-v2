import {
  buildSearchParam,
  getToggledArrayValue,
} from '../../../src/features/pill_identification_search/services/identification_search_param_builder';
import { ISearchPillData } from '../../../src/features/pill_identification_search/types';

describe('IdentificationSearchParamBuilder 단위 테스트', () => {
  describe('getToggledArrayValue', () => {
    test('"전체"를 누르면 null을 반환해야 한다', () => {
      const result = getToggledArrayValue(['원형', '장방형'], '전체');
      expect(result).toBeNull();
    });

    test('비어있는 상태에서 항목을 선택하면 해당 항목만 포함된 배열을 반환해야 한다', () => {
      const result = getToggledArrayValue(null, '원형');
      expect(result).toEqual(['원형']);
    });

    test('이미 존재하는 항목을 선택하면 해당 항목이 제거되어야 한다', () => {
      const result = getToggledArrayValue(['원형', '장방형'], '원형');
      expect(result).toEqual(['장방형']);
    });

    test('새로운 항목을 선택하면 기존 배열에 추가되어야 한다', () => {
      const result = getToggledArrayValue(['원형'], '장방형');
      expect(result).toEqual(['원형', '장방형']);
    });

    test('모든 항목이 제거되어 빈 배열이 되면 null을 반환해야 한다', () => {
      const result = getToggledArrayValue(['원형'], '원형');
      expect(result).toBeNull();
    });
  });

  describe('buildSearchParam', () => {
    test('완전 일치(isExactMatch=true)일 때 PRINT_FRONT_EXACTLY로 변환되어야 한다', () => {
      const raw: ISearchPillData = {
        PRINT_FRONT: ' TY ',
        PRINT_BACK: ' 500 ',
        ITEM_NAME: '타이레놀',
        ENTP_NAME: '한국얀센',
        DRUG_SHAPE: ['원형'],
        FORM_CODE: ['정제'],
        COLOR_CLASS1: ['하양'],
        COLOR_CLASS2: null,
        LINE_FRONT: ['-'],
        LINE_BACK: null,
        MARK_CODE_FRONT: '1234',
        MARK_CODE_BACK: '',
        isExactMatch: true,
      };

      const searchParam = buildSearchParam(raw);

      expect(searchParam.PRINT_FRONT_EXACTLY).toBe('TY');
      expect(searchParam.PRINT_BACK_EXACTLY).toBe('500');
      expect(searchParam.PRINT_FRONT).toBeUndefined();
      expect(searchParam.PRINT_BACK).toBeUndefined();
      expect(searchParam.ITEM_NAME).toBe('타이레놀');
      expect(searchParam.ENTP_NAME).toBe('한국얀센');
      expect(searchParam.DRUG_SHAPE).toEqual(['원형']);
      expect(searchParam.FORM_CODE).toEqual(['정제']);
      expect(searchParam.COLOR_CLASS1).toEqual(['하양']);
      expect(searchParam.LINE_FRONT).toEqual(['-']);
      expect(searchParam.MARK_CODE_FRONT).toBe('1234');
      expect(searchParam.MARK_CODE_BACK).toBeUndefined();
    });

    test('부분 일치(isExactMatch=false)일 때 PRINT_FRONT로 변환되어야 한다', () => {
      const raw: ISearchPillData = {
        PRINT_FRONT: 'TY',
        PRINT_BACK: '',
        ITEM_NAME: '',
        ENTP_NAME: '',
        DRUG_SHAPE: null,
        FORM_CODE: null,
        COLOR_CLASS1: null,
        COLOR_CLASS2: null,
        LINE_FRONT: null,
        LINE_BACK: null,
        MARK_CODE_FRONT: '',
        MARK_CODE_BACK: '',
        isExactMatch: false,
      };

      const searchParam = buildSearchParam(raw);

      expect(searchParam.PRINT_FRONT).toBe('TY');
      expect(searchParam.PRINT_FRONT_EXACTLY).toBeUndefined();
      expect(searchParam.PRINT_BACK).toBeUndefined();
    });

    test('"전체" 라벨이 포함된 배열은 필터링되어야 한다', () => {
      const raw: ISearchPillData = {
        PRINT_FRONT: '',
        PRINT_BACK: '',
        ITEM_NAME: '',
        ENTP_NAME: '',
        DRUG_SHAPE: ['전체', '원형'],
        FORM_CODE: ['전체'],
        COLOR_CLASS1: null,
        COLOR_CLASS2: null,
        LINE_FRONT: null,
        LINE_BACK: null,
        MARK_CODE_FRONT: '',
        MARK_CODE_BACK: '',
        isExactMatch: false,
      };

      const searchParam = buildSearchParam(raw);

      expect(searchParam.DRUG_SHAPE).toEqual(['원형']);
      expect(searchParam.FORM_CODE).toBeUndefined();
    });
  });
});
