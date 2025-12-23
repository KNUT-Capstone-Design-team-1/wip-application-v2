import { Realm } from 'realm';
import { getItem } from '@/utils/storage';
import { getDBInfo } from './client/dbInfo';
import { dbConfig, updateDBConfig } from './db/config';
import { TPillData } from './db/models/pillData';
import { GLOBAL_STATE } from '@/global_state';

// TODO: 업데이트 progress 표시
// (callback: (idx: number, total: number) => void | undefined) => {}
const upsertDB = async () => {
  const realm = await Realm.open(dbConfig);
  const updateRealm = await Realm.open(updateDBConfig);

  try {
    for (const schema of updateDBConfig.schema ?? []) {
      const updateObjects = updateRealm.objects<TPillData>(schema.name);

      realm.write(() => {
        for (let idx = 0; idx < updateObjects.length; idx++) {
          if (updateObjects[idx].DELETED) {
            const targetObj = realm.objectForPrimaryKey(
              schema.name,
              updateObjects[idx].ITEM_SEQ,
            );
            if (targetObj) {
              realm.delete(targetObj);
            }
          } else {
            realm.create(
              schema.name,
              updateObjects[idx],
              Realm.UpdateMode.Modified,
            );
          }
        }
      });
    }
  } catch (e) {
    console.log(e);
  } finally {
    realm.close();
    updateRealm.close();
  }
};

const updateCheck = async () => {
  const lastUpdateDate = await getItem('lastUpdateDate').then(
    (res) => new Date(res === '' ? 0 : res),
  );
  const curDBdate = await getDBInfo().then((res) => new Date(res.resourceDate));

  GLOBAL_STATE.curDBdate = curDBdate;

  return lastUpdateDate < curDBdate ? true : false;
};

export { upsertDB, updateCheck };
