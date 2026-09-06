import { deviceExpoDataSource } from '@features/nearby_pharmacy/data/datasources/device_expo_datasource';

// 기기 I/O 리포지토리
export const deviceRepository = {
  // 텍스트를 클립보드에 복사
  async copyToClipboard(text: string): Promise<void> {
    await deviceExpoDataSource.copyToClipboard(text);
  },

  // 전화 앱(다이얼러) 실행
  async openDialer(phoneNumber: string): Promise<void> {
    await deviceExpoDataSource.openUrl(`tel:${phoneNumber}`);
  },
};
