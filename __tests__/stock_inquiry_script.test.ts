import { pharmacyActionService } from '../src/features/nearby_pharmacy/services/pharmacy_action_service';

jest.mock(
  '../src/features/nearby_pharmacy/data/repositories/device_repository',
  () => ({
    deviceRepository: {},
  }),
);

it('uses the supplement name without suggesting substitute dispensing', () => {
  const script = pharmacyActionService.generateInquiryScript(
    '  비타민 C  ',
    undefined,
    'functional_food',
  );
  expect(script).toContain("'비타민 C' 제품 재고");
  expect(script).not.toMatch(/대체조제|동일 성분|대체 가능한 약/);
});

it('uses a supplement fallback when the product name is empty', () => {
  expect(
    pharmacyActionService.generateInquiryScript(
      ' ',
      undefined,
      'functional_food',
    ),
  ).toContain('이 영양제');
});

it('preserves the medicine inquiry script for existing callers', () => {
  const script = pharmacyActionService.generateInquiryScript('의약품', '분류');
  expect(script).toContain("'의약품'(분류)");
  expect(script).toContain('대체조제');
});
