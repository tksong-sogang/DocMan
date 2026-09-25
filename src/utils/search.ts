import type { Category, Item } from '../types'

export type SearchResult = Record<Category, Item[]>

/** 주제·키워드 부분 일치 검색, 대소문자 무시 (F014). 순서는 입력 순서(최신 먼저)를 유지한다 */
export function searchItems(items: Item[], query: string): SearchResult {
  const result: SearchResult = { document: [], photo: [] }
  const q = query.trim().toLowerCase()
  if (!q) return result
  for (const item of items) {
    const fields = [item.topic, ...item.keywords]
    if (fields.some((f) => f.toLowerCase().includes(q))) result[item.category].push(item)
  }
  return result
}
