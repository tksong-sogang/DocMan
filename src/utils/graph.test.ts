import { describe, expect, it } from 'vitest'
import { buildTopicGraph } from './graph'
import { makeItem } from './testItem'

describe('buildTopicGraph', () => {
  it('주제를 노드로, 공유 키워드 수를 연결선 가중치로 만든다', () => {
    const { nodes, edges } = buildTopicGraph([
      makeItem({ topic: 'A', keywords: ['x', 'y'] }),
      makeItem({ topic: 'A', keywords: ['z'] }),
      makeItem({ topic: 'B', keywords: ['X', 'z'], category: 'photo' }),
      makeItem({ topic: 'C', keywords: ['w'] }),
    ])
    expect(nodes).toEqual([
      { id: 'A', count: 2 },
      { id: 'B', count: 1 },
      { id: 'C', count: 1 },
    ])
    expect(edges).toEqual([{ from: 'A', to: 'B', weight: 2 }])
  })
})
