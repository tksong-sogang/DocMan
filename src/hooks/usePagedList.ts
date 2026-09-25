import { useCallback, useState } from 'react'

/** 목록을 pageSize개씩 늘려 가며 보여준다 (F011, F014) */
export function usePagedList<T>(items: T[], pageSize = 10) {
  const [count, setCount] = useState(pageSize)
  const [prevItems, setPrevItems] = useState(items)

  // 목록이 바뀌면(새 검색 등) 처음 페이지로 돌아간다
  if (items !== prevItems) {
    setPrevItems(items)
    setCount(pageSize)
  }

  const total = items.length
  const loadMore = useCallback(() => setCount((c) => Math.min(c + pageSize, total)), [pageSize, total])

  return { visible: items.slice(0, count), hasMore: count < total, loadMore }
}
