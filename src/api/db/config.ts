import { stringToInt8Array } from "@/utils/converter";
import { PillData } from "@/api/db/models/pillData";
import { PillBox } from "@/api/db/models/pillBox";
import Config from "react-native-config";
import RNFS from "react-native-fs";
import wipConfig from '../../../wip_config.json';
import {GLOBAL_STATE} from '@/global_state';

const {schemaVersion} = wipConfig.database;

const dbConfig: Realm.Configuration = {
  schema: [PillData, PillBox],
  schemaVersion,
  encryptionKey: stringToInt8Array(Config.REALM_ENCRYPTION_KEY as string),
  path: RNFS.DocumentDirectoryPath + "/default.realm",
  onMigration: (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < 2) {
      const oldObjects = oldRealm.objects('PillData');
      const newObjects = newRealm.objects('PillData');

      for (let i = 0; i < oldObjects.length; i += 1) {
        newObjects[i].MARK_CODE_FRONT = null;
        newObjects[i].MARK_CODE_BACK = null;
        newObjects[i].FORM_CODE = null;
      }
    }
  }
}

const updateDBConfig: Realm.Configuration = {
  schema: [PillData],
  schemaVersion,
  encryptionKey: stringToInt8Array(Config.REALM_ENCRYPTION_KEY as string),
  path:
    RNFS.DocumentDirectoryPath + `/res/update_${GLOBAL_STATE.dbResourceVersion}.realm`,
};

export {
  dbConfig,
  updateDBConfig
}