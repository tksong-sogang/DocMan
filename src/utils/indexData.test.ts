import { describe, expect, it } from 'vitest'
import { addItemToIndex, createEmptyIndex, removeItemFromIndex, topicCount } from './indexData'
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

describe('removeItemFromIndex', () => {
  const build = () =>
    [
      makeItem({ id: '1', topic: 'A' }),
      makeItem({ id: '2', topic: 'A' }),
      makeItem({ id: '3', topic: 'B', category: 'photo' }),
    ].reduce(addItemToIndex, createEmptyIndex())

  it('건수와 주제 건수를 1 줄이고 항목을 뺀다', () => {
    const index = removeItemFromIndex(build(), '1')
    expect(index.counts).toEqual({ document: 1, photo: 1 })
    expect(index.topics.document).toEqual({ A: 1 })
    expect(index.items.map((i) => i.id)).toEqual(['3', '2'])
  })

  it('주제 건수가 0이 되면 주제를 없앤다', () => {
    const index = removeItemFromIndex(build(), '3')
    expect(index.topics.photo).toEqual({})
    expect(topicCount(index, 'photo')).toBe(0)
  })

  it('없는 항목이면 그대로 돌려준다', () => {
    const index = build()
    expect(removeItemFromIndex(index, 'nope')).toBe(index)
  })
})
