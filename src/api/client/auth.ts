import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import Config from "react-native-config";
import QuickCrypto from "react-native-quick-crypto"
import { Buffer } from "@craftzdog/react-native-buffer";

const getToken = () => {
  const rsaPubKey = Config.GOOGLE_CLOUD_RSA_PUB_KEY?.replace(/\\n/g, "\n")

  dayjs.extend(utc)
  const now = dayjs.utc().format()

  return QuickCrypto
    .publicEncrypt({ key: rsaPubKey }, Buffer.from(now))
    .toString("base64")
}

export {
  getToken
}