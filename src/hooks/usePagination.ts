import { useState, useMemo, useEffect } from 'react'
import { useQuery } from '@realm/react'
import _ from 'lodash'
import { DrugRecognition } from '@/api/db/models/drugRecognition'
import { FinishedMedicinePermissionDetail } from '@/api/db/models/finishedMedicinePermissionDetail'

//TODO: 정렬 알고리즘 구현 필요 => properties similarity
export const usePagination = (filter: string, params: string[], pageSize: number) => {
  const queryRecog = useQuery({
    type: DrugRecognition,
    query: collection => collection.filtered(filter as string, ...params),
  }, params)

  const queryFinished = useQuery({ type: FinishedMedicinePermissionDetail }, params)

  const [page, setPage] = useState(1)
  const [totalSize, setTotalSize] = useState(0)
  const [paginatedData, setPaginatedData] = useState<(DrugRecognition | FinishedMedicinePermissionDetail)[]>([])

  const mergeData = useMemo(() => {
    const recogArr = queryRecog.map((value) => value.toJSON())
    const totalData = recogArr.map((recog) =>
      _.merge(recog, queryFinished.filtered(`ITEM_SEQ == '${recog.ITEM_SEQ}'`)[0])
    )

    setTotalSize(totalData.length)

    return totalData
  }, [queryRecog, queryFinished])

  useEffect(() => {
    const start = (page - 1) * pageSize
    const end = page * pageSize
    setPaginatedData((prev) => [...prev, ...mergeData.slice(start, end)])
  }, [page, mergeData, pageSize])

  const loadData = () => {
    if (paginatedData.length < mergeData.length) {
      setPage((prev) => prev + 1)
    }
  }

  return { paginatedData, totalSize, loadData }
}