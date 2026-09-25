import { describe, expect, it } from 'vitest'
import { addItemToIndex, createEmptyIndex, topicCount } from './indexData'
import { makeItem } from './testItem'

describe('addItemToIndex', () => {
  it('건수와 주제 건수를 올리고 최신 항목을 앞에 넣는다', () => {
    let index = createEmptyIndex()
    index = addItemToIndex(index, makeItem({ id: '1', topic: 'A' }))
    index = addItemToIndex(index, makeItem({ id: '2', topic: 'A' }))
    index = addItemToIndex(index, makeItem({ id: '3', topic: 'B', category: 'photo' }))

    expect(index.counts).toEqual({ document: 2, photo: 1 })
    expect(index.topics).toEqual({ document: { A: 2 }, photo: { B: 1 } })
    expect(index.items.map((i) => i.id)).toEqual(['3', '2', '1'])
    expect(topicCount(index, 'document')).toBe(1)
  })

  it('원래 index를 바꾸지 않는다', () => {
    const index = createEmptyIndex()
    addItemToIndex(index, makeItem())
    expect(index).toEqual(createEmptyIndex())
  })
})
