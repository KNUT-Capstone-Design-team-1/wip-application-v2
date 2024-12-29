const stringToInt8Array = (data: string): Int8Array => {
  const res = data.match(/-?\d+/g)?.map(Number)
  return new Int8Array(res ?? [])
}

const deepCopyRealmObj = <T extends object>(data: T): T => {
  return JSON.parse(JSON.stringify(data))
}

/* 객체 복사 재귀 사용
import { Dictionary } from "realm"

const isRealmArray = (data: any): data is unknown[] => {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.length === 'number' &&
    typeof data.map === 'function'
  )
}

const deepCopyRealmObj = <T extends object>(data: T): T => {
  const result: Partial<T> = {}

  for (const [key, value] of Object.entries(data)) {
    if (isRealmArray(value)) {
      result[key as keyof T] = value.map((item) => {
        typeof item === 'object' && item !== null
          ? deepCopyRealmObj(item)
          : item
      }) as T[keyof T]
    } else if (value instanceof Dictionary) {
      const dictCopy: Record<string, any> = {}
      for (const [dictKey, dictValue] of Object.entries(value)) {
        if (isRealmArray(dictValue)) {
          dictCopy[dictKey] = dictValue.map((item) =>
            typeof item === 'object' && item !== null
              ? deepCopyRealmObj(item)
              : item
          )
        } else if (typeof dictValue === 'object' && dictValue !== null) {
          dictCopy[dictKey] = deepCopyRealmObj(dictValue)
        } else {
          dictCopy[dictKey] = dictValue
        }
      }
      result[key as keyof T] = dictCopy as T[keyof T]
    } else if (typeof value === 'object' && value !== null) {
      result[key as keyof T] = deepCopyRealmObj(value)
    } else {
      result[key as keyof T] = value
    }
  }

  return result as T
}
*/


export {
  stringToInt8Array,
  deepCopyRealmObj
}