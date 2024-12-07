import { Realm } from 'realm'
import { getItem } from '@/utils/storage'
import { getDBInfo } from './client/dbInfo'
import { dbConfig, updateDBConfig } from './db/config'

// TODO: 업데이트 progress 표시
const upsertDB = async (callback: (idx?: number, total?: number) => void | undefined) => {
  const realm = await Realm.open(dbConfig)
  const updateRealm = await Realm.open(updateDBConfig)

  try {
    for (const schema of dbConfig.schema ?? []) {
      updateRealm.objects(schema.name).forEach((obj, idx) => {
        realm.write(() => {
          realm.create(schema.name, obj, Realm.UpdateMode.Modified)
        })
        callback(idx, dbConfig.schema?.length)
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