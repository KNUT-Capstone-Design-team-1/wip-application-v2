import {
  IDeviceDataSource,
  deviceExpoDataSource,
} from '@features/nearby_pharmacy/data/datasources/device_expo_datasource';

// 기기 I/O 리포지토리 인터페이스
export interface IDeviceRepository {
  copyToClipboard(text: string): Promise<void>;
  openDialer(phoneNumber: string): Promise<void>;
}

// 기기 I/O 리포지토리 구현체
export class DeviceRepository implements IDeviceRepository {
  constructor(
    private readonly dataSource: IDeviceDataSource = deviceExpoDataSource,
  ) {}

  // 텍스트를 클립보드에 복사
  async copyToClipboard(text: string): Promise<void> {
    await this.dataSource.copyToClipboard(text);
  }

  // 전화 앱(다이얼러) 실행
  async openDialer(phoneNumber: string): Promise<void> {
    await this.dataSource.openUrl(`tel:${phoneNumber}`);
  }
}

// 기기 I/O 리포지토리 싱글톤 인스턴스
export const deviceRepository = new DeviceRepository();
