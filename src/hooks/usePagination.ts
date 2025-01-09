import { useState, useEffect } from 'react'
import { useQuery } from '@realm/react'
import { DrugRecognition, TDrugRecognition } from '@/api/db/models/drugRecognition'
import { calcCosineSimilarity, textToVector } from '@/utils/similarity'
import { deepCopyRealmObj } from '@/utils/converter'

//TODO: 데이터를 가져오는 과정을 비동기로 처리하기
export const usePagination = (filter: string, params: string[], pageSize: number, initData: any) => {

  const queryRecog = useQuery(DrugRecognition)

  const [page, setPage] = useState(1)
  const [totalSize, setTotalSize] = useState(0)
  const [paginatedData, setPaginatedData] = useState<TDrugRecognition[]>([])
  const [mergedData, setMergedData] = useState<TDrugRecognition[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const mergeData = async () => {
    if (!filter) {
      setMergedData([])
      setTotalSize(0)
      return
    }

    const recogFilter = queryRecog.filtered(filter, ...params)
    let recogArr

    if ('ITEM_SEQ' in initData) {
      const orderInitData: Record<string, number> = initData.ITEM_SEQ.reduce((acc: Record<string, number>, item: string, index: number) => {
        acc[item] = index;
        return acc
      }, {} as Record<string, number>)

      recogArr = recogFilter
        .slice()
        .sort((a: DrugRecognition, b: DrugRecognition) => {
          return orderInitData[a.ITEM_SEQ] - orderInitData[b.ITEM_SEQ]
        })
    }

    if ((initData.PRINT_FRONT + initData.PRINT_BACK) != "") {
      const initVector = textToVector(initData.PRINT_FRONT + initData.PRINT_BACK)

      recogArr = recogFilter.map((val) => {
        const recogObj = deepCopyRealmObj(val) as TDrugRecognition
        recogObj.SIMILARITY = (recogObj.PRINT_FRONT as string + recogObj.PRINT_BACK as string) != ""
          ? calcCosineSimilarity(initVector, recogObj.VECTOR as number[])
          : 0
        return recogObj
      }).sort((a: any, b: any) => {
        if (b.SIMILARITY !== a.SIMILARITY) {
          return b.SIMILARITY - a.SIMILARITY
        }
        return (a.ITEM_NAME as string).localeCompare(b.ITEM_NAME as string)
      })
    } else {
      recogArr = recogFilter.slice()
    }

    setMergedData(recogArr)
    setTotalSize(recogArr.length)
    setIsLoading(false)
  }

  useEffect(() => {

    const fetchData = async () => {
      await mergeData()
    }

    fetchData()

    return (() => {
      setMergedData([])
      setPaginatedData([])
      setPage(1)
    })

  }, [filter, params])

  useEffect(() => {
    const start = (page - 1) * pageSize
    const end = page * pageSize
    setPaginatedData((prev) => [...prev, ...mergedData.slice(start, end)])
  }, [page, mergedData, pageSize])

  const loadData = () => {
    if (paginatedData.length < mergedData.length) {
      setPage((prev) => prev + 1)
    }
  }

  return { paginatedData, totalSize, loadData, isLoading }
}