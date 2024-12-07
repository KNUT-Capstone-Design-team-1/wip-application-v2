import { stringToInt8Array } from "@/utils/converter";
import { DrugRecognition } from "./models/drugRecognition";
import { FinishedMedicinePermissionDetail } from "./models/finishedMedicinePermissionDetail";
import Config from "react-native-config";
import RNFS from "react-native-fs";

const dbConfig: Realm.Configuration = {
  schema: [DrugRecognition, FinishedMedicinePermissionDetail],
  encryptionKey: stringToInt8Array(Config.REALM_ENCRYPTION_KEY as string),
  path: RNFS.DocumentDirectoryPath + "/default.realm"
}

const updateDBConfig: Realm.Configuration = {
  schema: [DrugRecognition, FinishedMedicinePermissionDetail],
  encryptionKey: stringToInt8Array(Config.REALM_ENCRYPTION_KEY as string),
  path: RNFS.DocumentDirectoryPath + "/res/update.realm"
}

export {
  dbConfig,
  updateDBConfig
}