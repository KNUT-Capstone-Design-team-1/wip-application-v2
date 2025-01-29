import { stringToInt8Array } from "@/utils/converter";
import { PillData } from "@/api/db/models/pillData";
import { PillBox } from "@/api/db/models/pillBox";
import Config from "react-native-config";
import RNFS from "react-native-fs";

const dbConfig: Realm.Configuration = {
  schema: [PillData, PillBox],
  encryptionKey: stringToInt8Array(Config.REALM_ENCRYPTION_KEY as string),
  path: RNFS.DocumentDirectoryPath + "/default.realm"
}

const updateDBConfig: Realm.Configuration = {
  schema: [PillData],
  encryptionKey: stringToInt8Array(Config.REALM_ENCRYPTION_KEY as string),
  path: RNFS.DocumentDirectoryPath + "/res/update.realm"
}

export {
  dbConfig,
  updateDBConfig
}