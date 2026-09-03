import { PharmacyActionService } from '../../../src/features/nearby_pharmacy/services/pharmacy_action_service';
import { IDeviceRepository } from '../../../src/features/nearby_pharmacy/data/repositories/device_repository';

jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(),
}));

jest.mock('@utils/logger', () => ({
  __esModule: true,
  default: {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe('PharmacyActionService 단위 테스트', () => {
  let service: PharmacyActionService;
  let mockRepository: jest.Mocked<IDeviceRepository>;

  beforeEach(() => {
    mockRepository = {
      openDialer: jest.fn().mockResolvedValue(undefined),
      copyToClipboard: jest.fn().mockResolvedValue(undefined),
    };
    service = new PharmacyActionService(mockRepository);
  });

  describe('formatPhoneNumber', () => {
    it('전화번호에서 하이픈, 공백, 특수문자를 제거하고 숫자와 허용 기호만 남겨야 한다', () => {
      expect(service.formatPhoneNumber('02-1234-5678')).toBe('0212345678');
      expect(service.formatPhoneNumber('+82 10-1234-5678')).toBe(
        '+821012345678',
      );
      expect(service.formatPhoneNumber('02) 123-4567')).toBe('021234567');
      expect(service.formatPhoneNumber('')).toBe('');
    });
  });

  describe('callPharmacy', () => {
    it('유효한 전화번호가 주어지면 다이얼러를 열고 true를 반환해야 한다', async () => {
      const result = await service.callPharmacy('02-1234-5678');

      expect(result).toBe(true);
      expect(mockRepository.openDialer).toHaveBeenCalledWith('0212345678');
    });

    it('전화번호가 비어있으면 다이얼러를 호출하지 않고 false를 반환해야 한다', async () => {
      const result = await service.callPharmacy('');

      expect(result).toBe(false);
      expect(mockRepository.openDialer).not.toHaveBeenCalled();
    });

    it('다이얼러 오픈 실패 시 false를 반환해야 한다', async () => {
      mockRepository.openDialer.mockRejectedValueOnce(
        new Error('Dialer error'),
      );

      const result = await service.callPharmacy('02-1234-5678');
      expect(result).toBe(false);
    });
  });

  describe('copyText', () => {
    it('텍스트가 있으면 클립보드에 복사하고 true를 반환해야 한다', async () => {
      const result = await service.copyText('서울특별시 중구 세종대로 110');

      expect(result).toBe(true);
      expect(mockRepository.copyToClipboard).toHaveBeenCalledWith(
        '서울특별시 중구 세종대로 110',
      );
    });

    it('빈 문자열일 경우 클립보드를 호출하지 않고 false를 반환해야 한다', async () => {
      const result = await service.copyText('   ');

      expect(result).toBe(false);
      expect(mockRepository.copyToClipboard).not.toHaveBeenCalled();
    });
  });
});
