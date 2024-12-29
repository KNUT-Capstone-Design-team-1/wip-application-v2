import { useState, useEffect } from 'react'
import { useQuery } from '@realm/react'
import _ from 'lodash'
import { DrugRecognition } from '@/api/db/models/drugRecognition'
import { FinishedMedicinePermissionDetail } from '@/api/db/models/finishedMedicinePermissionDetail'

//TODO: 정렬 알고리즘 구현 필요 => properties similarity
//TODO: 데이터를 가져오는 과정을 비동기로 처리하기
export const usePagination = (filter: string, params: string[], pageSize: number) => {

  const queryRecog = useQuery(DrugRecognition)
  const queryFinished = useQuery(FinishedMedicinePermissionDetail)

  const [page, setPage] = useState(1)
  const [totalSize, setTotalSize] = useState(0)
  const [paginatedData, setPaginatedData] = useState<(DrugRecognition | FinishedMedicinePermissionDetail)[]>([])
  const [mergedData, setMergedData] = useState<(DrugRecognition | FinishedMedicinePermissionDetail)[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const mergeData = async () => {
    if (!filter) {
      setMergedData([])
      setTotalSize(0)
      return
    }

    const recogArr = queryRecog.filtered(filter, ...params).map((value) => value.toJSON())
    const totalData = recogArr.map((recog) =>
      _.merge(recog, queryFinished.filtered(`ITEM_SEQ == '${recog.ITEM_SEQ}'`)[0])
    )

    setMergedData(totalData)
    setTotalSize(totalData.length)
    setIsLoading(false)
  }

  useEffect(() => {

    const fetchData = async () => {
      await mergeData()
    }

    fetchData()

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