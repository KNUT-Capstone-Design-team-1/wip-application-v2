import { useRealm, useQuery } from "@realm/react"
import { PillBox } from "@/api/db/models/pillBox"
import { deepCopyRealmObj } from "@/utils/converter"

export const usePillBox = () => {
  const realm = useRealm()
  const pillList = useQuery(PillBox)

  const addPill = (data: PillBox) => {
    realm.write(() => {
      realm.create(PillBox, data)
    })
  }

  const getPill = (ITEM_SEQ: string) => {
    const pill = pillList.filtered(`ITEM_SEQ == '${ITEM_SEQ}'`)[0]

    return pill
  }

  const getPillSize = () => {
    return pillList.length
  }

  const getPillList = () => {
    return pillList.map((i) => deepCopyRealmObj(i))
  }

  const delPill = (ITEM_SEQ: string) => {
    const pill = getPill(ITEM_SEQ)

    realm.write(() => {
      realm.delete(pill)
    })
  }

  const delPillList = () => {
    realm.write(() => {
      realm.delete(pillList)
    })
  }

  return {
    addPill,
    getPill,
    getPillSize,
    getPillList,
    delPill,
    delPillList
  }
}