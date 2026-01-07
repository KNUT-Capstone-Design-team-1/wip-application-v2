import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import crypto from "crypto";

export class GoogleAuthInstance {
  protected readonly token: string;

  constructor() {
    this.token = this.createToken();
  }

  private createToken() {
    const rsaPubKey = (process.env.GOOGLE_CLOUD_RSA_PUB_KEY as string).replace(
      /\\n/g,
      "\n"
    );

    dayjs.extend(utc);
    const now = dayjs.utc().format();

    return crypto
      .publicEncrypt(`${rsaPubKey}`, Buffer.from(now))
      .toString("base64");
  }
}
