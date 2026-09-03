import { getToggledArrayValue } from '../../../src/features/pill_identification_search/services/identification_filter_toggle_service';

describe('IdentificationFilterToggleService 단위 테스트', () => {
  test('"전체"를 선택하면 null을 반환한다', () => {
    const result = getToggledArrayValue(['원형', '장방형'], '전체');
    expect(result).toBeNull();
  });

  test('비어있는 상태(null)에서 항목을 선택하면 해당 항목만 포함된 배열을 반환한다', () => {
    const result = getToggledArrayValue(null, '원형');
    expect(result).toEqual(['원형']);
  });

  test('이미 선택된 항목을 다시 선택하면 해당 항목이 제거된다', () => {
    const result = getToggledArrayValue(['원형', '장방형'], '원형');
    expect(result).toEqual(['장방형']);
  });

  test('새로운 항목을 선택하면 기존 배열에 추가된다', () => {
    const result = getToggledArrayValue(['원형'], '타원형');
    expect(result).toEqual(['원형', '타원형']);
  });

  test('마지막 남은 항목이 제거되어 빈 배열이 되면 null을 반환한다', () => {
    const result = getToggledArrayValue(['원형'], '원형');
    expect(result).toBeNull();
  });
});
