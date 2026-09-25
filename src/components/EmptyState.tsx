import type { ReactNode } from 'react'

/** 자료가 없을 때 안내. children에 바로가기 버튼 등을 넣는다 */
export default function EmptyState({ message, children }: { message: string; children?: ReactNode }) {
  return (
    <div className="empty-state">
      <p>{message}</p>
      {children}
    </div>
  )
}
