import { stringToInt8Array } from '@/utils/converter';
import { PillData } from '@/api/db/models/pillData';
import { PillBox } from '@/api/db/models/pillBox';
import RNFS from 'react-native-fs';
import wipConfig from '../../../wip_config.json';
import { GLOBAL_STATE } from '@/global_state';

const { schemaVersion } = wipConfig.database;

const dbConfig: Realm.Configuration = {
  schema: [PillData, PillBox],
  schemaVersion,
  encryptionKey: stringToInt8Array(
    process.env.EXPO_PUBLIC_REALM_ENCRYPTION_KEY as string,
  ),
  path: RNFS.DocumentDirectoryPath + '/default.realm',
  onMigration: () => {},
};

const updateDBConfig: Realm.Configuration = {
  schema: [PillData],
  schemaVersion,
  encryptionKey: stringToInt8Array(
    process.env.EXPO_PUBLIC_REALM_ENCRYPTION_KEY as string,
  ),
  path:
    RNFS.DocumentDirectoryPath +
    `/res/update_${GLOBAL_STATE.dbResourceVersion}.realm`,
};

export { dbConfig, updateDBConfig };
