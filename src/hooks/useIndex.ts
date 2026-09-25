import { createContext, useContext } from 'react'
import type { IndexData } from '../types'

export interface IndexState {
  index: IndexData | null
  loading: boolean
  error: string | null
  /** Drive에서 index.json을 다시 불러온다 (저장 후 등) */
  reload(): Promise<void>
}

export const IndexContext = createContext<IndexState | null>(null)

/** 불러온 index.json (F010, F011, F014, F015). IndexProvider 안에서만 쓴다 */
export function useIndex(): IndexState {
  const ctx = useContext(IndexContext)
  if (!ctx) throw new Error('useIndex는 IndexProvider 안에서 써야 합니다')
  return ctx
}
