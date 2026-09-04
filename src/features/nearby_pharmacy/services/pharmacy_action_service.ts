import {
  IDeviceRepository,
  deviceRepository,
} from '@features/nearby_pharmacy/data/repositories/device_repository';
import logger from '@utils/logger';

// 약국 관련 기기 액션(전화 걸기, 복사 등) 비즈니스 로직 서비스
export class PharmacyActionService {
  constructor(
    private readonly repository: IDeviceRepository = deviceRepository,
  ) {}

  // 전화번호 문자열 정제 (숫자 및 다이얼 기호만 추출)
  formatPhoneNumber(telephone: string): string {
    const hasNoTelephone = !telephone;

    if (hasNoTelephone) {
      return '';
    }
    return telephone.replace(/[^0-9+*#]/g, '');
  }

  // 약국 전화 걸기 실행
  async callPharmacy(telephone: string): Promise<boolean> {
    const digits = this.formatPhoneNumber(telephone);
    const hasNoDigits = !digits;

    if (hasNoDigits) {
      return false;
    }

    try {
      await this.repository.openDialer(digits);
      return true;
    } catch (e) {
      logger.error(`Failed to open dialer: ${e}`);
      return false;
    }
  }

  // 약국 정보/주소 클립보드 복사 실행
  async copyText(text: string): Promise<boolean> {
    const hasNoText = !text || !text.trim();

    if (hasNoText) {
      return false;
    }

    try {
      await this.repository.copyToClipboard(text);
      return true;
    } catch (e) {
      logger.error(`Failed to copy to clipboard: ${e}`);
      return false;
    }
  }
}

// 약국 기기 액션 서비스 싱글톤 인스턴스
export const pharmacyActionService = new PharmacyActionService();
