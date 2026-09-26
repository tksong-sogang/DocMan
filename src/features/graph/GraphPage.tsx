import { useMemo, useState } from 'react'
import EmptyState from '../../components/EmptyState'
import ErrorMessage from '../../components/ErrorMessage'
import Spinner from '../../components/Spinner'
import { useIndex } from '../../hooks/useIndex'
import { buildTopicGraph } from '../../utils/graph'
import SearchResultModal from '../search/SearchResultModal'
import TopicGraph from './TopicGraph'

/** P04 그래프 분석 (F015, F014) */
export default function GraphPage() {
  const { index, loading, error, reload } = useIndex()
  const [query, setQuery] = useState<string | null>(null)
  const graph = useMemo(() => buildTopicGraph(index?.items ?? []), [index])

  if (loading) return <Spinner />
  if (error || !index) return <ErrorMessage message={error ?? '자료 목록을 불러오지 못했습니다'} onRetry={reload} />

  return (
    <>
      <h1>그래프 분석</h1>
      {graph.nodes.length === 0 ? (
        <EmptyState message="그래프로 보여줄 주제가 없습니다" />
      ) : (
        <>
          <p className="muted">주제를 누르면 그 주제로 검색합니다. 선이 굵을수록 공유하는 키워드가 많습니다.</p>
          <TopicGraph nodes={graph.nodes} edges={graph.edges} onSelectTopic={setQuery} />
        </>
      )}
      {query && <SearchResultModal query={query} onClose={() => setQuery(null)} />}
    </>
  )
}
