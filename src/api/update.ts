import { Realm } from 'realm'
import { getItem } from '@/utils/storage'
import { getDBInfo } from './client/dbInfo'
import { dbConfig, updateDBConfig } from './db/config'

const batchSize = 1000

// TODO: 업데이트 progress 표시
const upsertDB = async (callback: (idx: number, total: number) => void | undefined) => {
  const realm = await Realm.open(dbConfig)
  const updateRealm = await Realm.open(updateDBConfig)

  try {
    for (const schema of updateDBConfig.schema ?? []) {
      const updateObjects = updateRealm.objects(schema.name)

      realm.write(() => {
        for (let idx = 0; idx < updateObjects.length; idx++) {
          realm.create(schema.name, updateObjects[idx], Realm.UpdateMode.Modified)

          if (idx % batchSize === 0 || idx === updateObjects.length - 1) {
            callback(idx, updateObjects.length)
          }
        }
      })
    }

  } catch (e) {
    console.log(e)
  } finally {
    realm.close()
    updateRealm.close()
  }
}

const updateCheck = async () => {
  const lastUpdateDate = await getItem('lastUpdateDate').then((res) => new Date(res == '' ? 0 : res))
  const curDBdate = await getDBInfo().then((res) => new Date(res.resourceDate))

  return lastUpdateDate < curDBdate ? true : false
}

export { upsertDB, updateCheck }