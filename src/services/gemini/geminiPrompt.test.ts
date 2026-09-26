import { describe, expect, it } from 'vitest'
import { buildPrompt, errorMessage, parseAnalysis } from './geminiPrompt'

describe('parseAnalysis', () => {
  it('카테고리 제한에 맞게 키워드와 줄 수를 자르고 기호를 뗀다', () => {
    const text = JSON.stringify({
      title: '  사진  제목 ',
      topic: '회의 메모',
      keywords: ['a', 'b', 'a', 'c', 'd'],
      summary: ['- 첫째', '• 둘째', '1. 셋째', '넷째', '다섯째'],
    })
    expect(parseAnalysis(text, 'photo')).toEqual({
      category: 'photo',
      title: '사진 제목',
      topic: '회의 메모',
      keywords: ['a', 'b', 'c'],
      summary: ['첫째', '둘째', '셋째', '넷째'],
    })
  })

  it('JSON이 아니거나 제목·주제가 없으면 오류', () => {
    expect(() => parseAnalysis('not json', 'document')).toThrow()
    expect(() => parseAnalysis(JSON.stringify({ title: '', topic: 'x' }), 'document')).toThrow()
  })

  it('배열이 아니면 빈 목록으로 본다', () => {
    const r = parseAnalysis(JSON.stringify({ title: 't', topic: 'x', keywords: 'k', summary: null }), 'document')
    expect(r.keywords).toEqual([])
    expect(r.summary).toEqual([])
  })
})

describe('buildPrompt', () => {
  it('카테고리 제한과 기존 주제를 넣는다', () => {
    const p = buildPrompt('document', ['인공지능'])
    expect(p).toContain('5개 이하')
    expect(p).toContain('10줄 이하')
    expect(p).toContain('"인공지능"')
    expect(buildPrompt('photo', [])).not.toContain('이미 등록된 주제')
  })
})

describe('errorMessage', () => {
  it('상태 코드별 안내', () => {
    expect(errorMessage(400, '{"reason":"API_KEY_INVALID"}')).toContain('API 키가 올바르지 않습니다')
    expect(errorMessage(429, '')).toContain('한도')
    expect(errorMessage(503, '')).toContain('일시적인')
  })
})
