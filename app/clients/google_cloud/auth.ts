import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import crypto from 'crypto';

/**
 * GCP 인증 인스턴스
 */
export class GoogleAuthInstance {
  protected readonly token: string;

  constructor() {
    this.token = this.createToken();
  }

  /**
   * 토큰 생성
   * @returns
   */
  private createToken() {
    const rsaPubKey = (process.env.GOOGLE_CLOUD_RSA_PUB_KEY as string).replace(
      /\\n/g,
      '\n',
    );

    dayjs.extend(utc);
    const now = dayjs.utc().format();

    return crypto
      .publicEncrypt(`${rsaPubKey}`, Buffer.from(now))
      .toString('base64');
  }
}
