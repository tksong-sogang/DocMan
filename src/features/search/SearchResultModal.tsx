import { useMemo, useState } from 'react'
import ItemRow from '../../components/ItemRow'
import Modal from '../../components/Modal'
import ScrollList from '../../components/ScrollList'
import { useIndex } from '../../hooks/useIndex'
import type { Item } from '../../types'
import { CATEGORIES, CATEGORY_CONFIG } from '../../utils/category'
import { searchItems } from '../../utils/search'
import SummaryModal from '../summary/SummaryModal'

/** M02 검색 결과 박스 (F014). 항목을 누르면 M01이 위에 열린다 */
export default function SearchResultModal({ query, onClose }: { query: string; onClose(): void }) {
  const { index } = useIndex()
  const [selected, setSelected] = useState<Item | null>(null)
  const result = useMemo(() => searchItems(index?.items ?? [], query), [index, query])
  const total = result.document.length + result.photo.length

  return (
    <>
      <Modal title={`검색: ${query}`} onClose={onClose}>
        {total === 0 ? (
          <p className="muted">검색 결과가 없습니다</p>
        ) : (
          CATEGORIES.map((category) => (
            <section key={category} className="search-section">
              <h3>
                {CATEGORY_CONFIG[category].label} <span className="muted">({result[category].length})</span>
              </h3>
              <ScrollList
                items={result[category]}
                getKey={(item) => item.id}
                renderItem={(item) => <ItemRow item={item} onClick={setSelected} />}
                emptyMessage="검색 결과가 없습니다"
              />
            </section>
          ))
        )}
      </Modal>
      {selected && <SummaryModal item={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
