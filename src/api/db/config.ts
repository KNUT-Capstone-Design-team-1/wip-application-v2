import { stringToInt8Array } from "@/utils/converter";
import { PillData } from "@/api/db/models/pillData";
import { PillBox } from "@/api/db/models/pillBox";
import Config from "react-native-config";
import RNFS from "react-native-fs";
import packageJSON from "../../../package.json";

const resourceVersion = packageJSON.config.databaseResourceVersion;
const schemaVersion = parseInt(resourceVersion.split('_')[0]);

const dbConfig: Realm.Configuration = {
  schema: [PillData, PillBox],
  schemaVersion,
  encryptionKey: stringToInt8Array(Config.REALM_ENCRYPTION_KEY as string),
  path: RNFS.DocumentDirectoryPath + "/default.realm"
}

const updateDBConfig: Realm.Configuration = {
  schema: [PillData],
  schemaVersion,
  encryptionKey: stringToInt8Array(Config.REALM_ENCRYPTION_KEY as string),
  path: RNFS.DocumentDirectoryPath + `/res/update_${resourceVersion}.realm`
}

export {
  dbConfig,
  updateDBConfig
}