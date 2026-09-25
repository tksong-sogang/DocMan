import { useEffect, useRef, type ReactNode } from 'react'
import { usePagedList } from '../hooks/usePagedList'

interface Props<T> {
  items: T[]
  getKey(item: T): string
  renderItem(item: T): ReactNode
  pageSize?: number
  emptyMessage?: string
}

/** 처음 pageSize개를 보여주고, 끝까지 스크롤하면 pageSize개씩 더 보여준다 (F011, F014) */
export default function ScrollList<T>({ items, getKey, renderItem, pageSize = 10, emptyMessage }: Props<T>) {
  const { visible, hasMore, loadMore } = usePagedList(items, pageSize)
  const rootRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!hasMore || !sentinelRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore()
      },
      { root: rootRef.current },
    )
    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [hasMore, loadMore])

  if (items.length === 0 && emptyMessage) return <p className="muted">{emptyMessage}</p>

  return (
    <div ref={rootRef} className="scroll-list">
      <ul>
        {visible.map((item) => (
          <li key={getKey(item)}>{renderItem(item)}</li>
        ))}
      </ul>
      {hasMore && <div ref={sentinelRef} className="scroll-list-sentinel" />}
    </div>
  )
}
