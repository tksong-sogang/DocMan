import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import EmptyState from '../../components/EmptyState'
import ErrorMessage from '../../components/ErrorMessage'
import ItemRow from '../../components/ItemRow'
import ScrollList from '../../components/ScrollList'
import Spinner from '../../components/Spinner'
import { useIndex } from '../../hooks/useIndex'
import type { Item } from '../../types'
import { CATEGORIES, CATEGORY_CONFIG } from '../../utils/category'
import { topicCount } from '../../utils/indexData'
import SearchBar from '../search/SearchBar'
import SearchResultModal from '../search/SearchResultModal'
import SummaryModal from '../summary/SummaryModal'

/** P02 대시보드 (F010, F011, F014) */
export default function DashboardPage() {
  const { index, loading, error, reload } = useIndex()
  const [selected, setSelected] = useState<Item | null>(null)
  const [query, setQuery] = useState<string | null>(null)
  // P03에서 저장을 마치고 넘어오면 완료 메시지를 보여준다
  const savedTitle = (useLocation().state as { savedTitle?: string } | null)?.savedTitle

  if (loading) return <Spinner />
  if (error || !index) return <ErrorMessage message={error ?? '자료 목록을 불러오지 못했습니다'} onRetry={reload} />

  return (
    <>
      {savedTitle && <p className="notice">'{savedTitle}' 저장을 마쳤습니다</p>}
      <SearchBar onSearch={setQuery} />

      {index.items.length === 0 ? (
        <EmptyState message="등록된 자료가 없습니다">
          <Link to="/upload" className="btn btn-primary">
            업로드
          </Link>
        </EmptyState>
      ) : (
        <>
          <div className="card-grid">
            {CATEGORIES.map((category) => (
              <section key={category} className="card stat-card">
                <h2>{CATEGORY_CONFIG[category].label}</h2>
                <dl>
                  <div>
                    <dt>주제</dt>
                    <dd>{topicCount(index, category)}</dd>
                  </div>
                  <div>
                    <dt>건수</dt>
                    <dd>{index.counts[category]}</dd>
                  </div>
                </dl>
              </section>
            ))}
          </div>

          <div className="card-grid">
            {CATEGORIES.map((category) => (
              <section key={category} className="card">
                <h2>최근 {CATEGORY_CONFIG[category].label}</h2>
                <ScrollList
                  items={index.items.filter((item) => item.category === category)}
                  getKey={(item) => item.id}
                  renderItem={(item) => <ItemRow item={item} onClick={setSelected} />}
                  emptyMessage="등록된 자료가 없습니다"
                />
              </section>
            ))}
          </div>
        </>
      )}

      {selected && <SummaryModal item={selected} onClose={() => setSelected(null)} />}
      {query && <SearchResultModal query={query} onClose={() => setQuery(null)} />}
    </>
  )
}
