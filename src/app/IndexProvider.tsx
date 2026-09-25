import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { IndexContext, type IndexState } from '../hooks/useIndex'
import { driveService } from '../services'
import type { IndexData } from '../types'

const toMessage = (e: unknown) => (e instanceof Error ? e.message : '자료 목록을 불러오지 못했습니다')

/** index.json을 한 번 불러와 로그인 영역 전체에서 같이 쓴다 */
export default function IndexProvider({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState<IndexData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    driveService
      .loadIndex()
      .then((data) => active && setIndex(data))
      .catch((e) => active && setError(toMessage(e)))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setIndex(await driveService.loadIndex())
    } catch (e) {
      setError(toMessage(e))
    } finally {
      setLoading(false)
    }
  }, [])

  const value = useMemo<IndexState>(() => ({ index, loading, error, reload }), [index, loading, error, reload])
  return <IndexContext.Provider value={value}>{children}</IndexContext.Provider>
}
