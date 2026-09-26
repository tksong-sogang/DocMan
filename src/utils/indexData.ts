import type { IndexData, Item } from '../types'

export function createEmptyIndex(): IndexData {
  return {
    version: 1,
    counts: { document: 0, photo: 0 },
    topics: { document: {}, photo: {} },
    items: [],
  }
}

/** 새 항목을 반영한 index를 돌려준다. 다시 집계하지 않고 카운트만 올린다 (F009, F010) */
export function addItemToIndex(index: IndexData, item: Item): IndexData {
  const topics = index.topics[item.category]
  return {
    ...index,
    counts: { ...index.counts, [item.category]: index.counts[item.category] + 1 },
    topics: {
      ...index.topics,
      [item.category]: { ...topics, [item.topic]: (topics[item.topic] ?? 0) + 1 },
    },
    items: [item, ...index.items],
  }
}

/**
 * 항목을 뺀 index를 돌려준다 (F017). 다시 집계하지 않고 건수만 1 줄이며, 0이 된 주제는 없앤다.
 * 이미 없는 항목이면 index를 그대로 돌려준다.
 */
export function removeItemFromIndex(index: IndexData, itemId: string): IndexData {
  const item = index.items.find((i) => i.id === itemId)
  if (!item) return index
  const { [item.topic]: topicCount = 0, ...otherTopics } = index.topics[item.category]
  const topics = topicCount > 1 ? { ...otherTopics, [item.topic]: topicCount - 1 } : otherTopics
  return {
    ...index,
    counts: { ...index.counts, [item.category]: Math.max(0, index.counts[item.category] - 1) },
    topics: { ...index.topics, [item.category]: topics },
    items: index.items.filter((i) => i.id !== itemId),
  }
}

/** 카테고리의 주제 수 (F010) */
export function topicCount(index: IndexData, category: Item['category']): number {
  return Object.keys(index.topics[category]).length
}
