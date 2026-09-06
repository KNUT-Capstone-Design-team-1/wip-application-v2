import { deviceRepository } from '@features/nearby_pharmacy/data/repositories/device_repository';
import logger from '@utils/logger';

// 약국 관련 기기 액션(전화 걸기, 복사 등) 비즈니스 로직 서비스
export const pharmacyActionService = {
  // 전화번호 문자열 정제 (숫자 및 다이얼 기호만 추출)
  formatPhoneNumber(telephone: string): string {
    const hasNoTelephone = !telephone;

    if (hasNoTelephone) {
      return '';
    }
    return telephone.replace(/[^0-9+*#]/g, '');
  },

  // 약국 전화 걸기 실행
  async callPharmacy(telephone: string): Promise<boolean> {
    const digits = this.formatPhoneNumber(telephone);
    const hasNoDigits = !digits;

    if (hasNoDigits) {
      return false;
    }

    try {
      await deviceRepository.openDialer(digits);
      return true;
    } catch (e) {
      logger.error(`Failed to open dialer: ${e}`);
      return false;
    }
  },

  // 약국 정보/주소 클립보드 복사 실행
  async copyText(text: string): Promise<boolean> {
    const hasNoText = !text || !text.trim();

    if (hasNoText) {
      return false;
    }

    try {
      await deviceRepository.copyToClipboard(text);
      return true;
    } catch (e) {
      logger.error(`Failed to copy to clipboard: ${e}`);
      return false;
    }
  },

  // 약국 재고 문의용 추천 멘트 생성
  generateInquiryScript(pillName: string, className?: string): string {
    const cleanName = pillName ? pillName.trim() : '알약';
    if (className && className.trim()) {
      return `안녕하세요, 약사님! 혹시 '${cleanName}'(${className.trim()}) 재고가 있을까요? 혹시 없다면 동일 성분/효능으로 대체조제 가능한 약이 있을까요?`;
    }
    return `안녕하세요, 약사님! 혹시 '${cleanName}' 재고가 있을까요? 혹시 없다면 동일 성분으로 대체 가능한 약이 있을까요?`;
  },
};
