import type { Item } from '../types'

/** 자료 한 줄: 제목 · 주제 · 키워드 (F011, F014) */
export default function ItemRow({ item, onClick }: { item: Item; onClick(item: Item): void }) {
  return (
    <button type="button" className="item-row" onClick={() => onClick(item)} title={item.title}>
      <strong>{item.title}</strong>
      <span className="item-row-sep">·</span>
      <span>{item.topic}</span>
      <span className="item-row-sep">·</span>
      <span className="item-row-keywords">{item.keywords.join(', ')}</span>
    </button>
  )
}
