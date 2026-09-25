import { describe, expect, it } from 'vitest'
import { searchItems } from './search'
import { makeItem } from './testItem'

const items = [
  makeItem({ id: '1', topic: '인공지능', keywords: ['GPT', '딥러닝'] }),
  makeItem({ id: '2', topic: '기후 변화', keywords: ['탄소'], category: 'photo' }),
  makeItem({ id: '3', topic: '재무', keywords: ['예산', 'AI 투자'] }),
]

describe('searchItems', () => {
  it('주제와 키워드를 부분 일치, 대소문자 무시로 찾는다', () => {
    expect(searchItems(items, 'gpt').document.map((i) => i.id)).toEqual(['1'])
    expect(searchItems(items, '기후').photo.map((i) => i.id)).toEqual(['2'])
    expect(searchItems(items, 'ai').document.map((i) => i.id)).toEqual(['3'])
  })

  it('제목과 핵심 내용은 찾지 않는다', () => {
    const r = searchItems(items, '테스트 문서')
    expect(r.document).toEqual([])
    expect(r.photo).toEqual([])
  })

  it('빈 검색어는 결과 없음', () => {
    expect(searchItems(items, '  ')).toEqual({ document: [], photo: [] })
  })
})
