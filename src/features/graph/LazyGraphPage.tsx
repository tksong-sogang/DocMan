import { lazy, Suspense } from 'react'
import Spinner from '../../components/Spinner'

// 그래프 라이브러리(vis-network)가 커서 그래프 페이지를 열 때만 불러온다
const GraphPage = lazy(() => import('./GraphPage'))

export default function LazyGraphPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <GraphPage />
    </Suspense>
  )
}
