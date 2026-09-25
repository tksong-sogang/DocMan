import type { Item } from '../types'

export interface TopicNode {
  /** 주제 이름 */
  id: string
  /** 이 주제의 자료 수 */
  count: number
}

export interface TopicEdge {
  from: string
  to: string
  /** 두 주제가 공유하는 키워드 수 */
  weight: number
}

/** 주제 연관 그래프 데이터 (F015). 두 카테고리의 주제를 합쳐서 만든다 */
export function buildTopicGraph(items: Item[]): { nodes: TopicNode[]; edges: TopicEdge[] } {
  const topics = new Map<string, { count: number; keywords: Set<string> }>()
  for (const item of items) {
    const entry = topics.get(item.topic) ?? { count: 0, keywords: new Set<string>() }
    entry.count += 1
    for (const k of item.keywords) entry.keywords.add(k.trim().toLowerCase())
    topics.set(item.topic, entry)
  }

  const nodes = [...topics].map(([id, { count }]) => ({ id, count }))
  const edges: TopicEdge[] = []
  const entries = [...topics]
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const [a, aData] = entries[i]
      const [b, bData] = entries[j]
      let weight = 0
      for (const k of aData.keywords) if (bData.keywords.has(k)) weight++
      if (weight > 0) edges.push({ from: a, to: b, weight })
    }
  }
  return { nodes, edges }
}
