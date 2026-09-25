import { describe, expect, it } from 'vitest'
import {
  buildItemMarkdown,
  buildTableRow,
  createEmptyTable,
  escapeCell,
  insertRowAtTop,
  summaryFileName,
} from './markdown'
import { makeItem } from './testItem'

describe('escapeCell', () => {
  it('파이프와 줄바꿈을 처리한다', () => {
    expect(escapeCell('a|b\nc')).toBe('a\\|b c')
  })
})

describe('buildTableRow', () => {
  it('열 6개, 핵심 내용은 <br>로 잇는다', () => {
    const row = buildTableRow(makeItem())
    expect(row).toBe(
      '| 테스트 문서 | 인공지능 | 머신러닝, 데이터 | - 첫째 줄<br>- 둘째 줄 | 2026-09-26 10:05 | [원본 보기](https://drive.google.com/file/d/orig-1/view) |',
    )
  })
})

describe('insertRowAtTop', () => {
  it('새 행을 헤더 바로 아래에 넣어 최신 행이 맨 위에 온다', () => {
    let table = createEmptyTable('document')
    table = insertRowAtTop(table, buildTableRow(makeItem({ title: '먼저' })))
    table = insertRowAtTop(table, buildTableRow(makeItem({ title: '나중' })))
    const rows = table.split('\n').filter((l) => l.startsWith('| ') && !l.startsWith('| 제목'))
    expect(rows.map((r) => r.split(' | ')[0])).toEqual(['| 나중', '| 먼저'])
  })

  it('구분선이 없으면 오류', () => {
    expect(() => insertRowAtTop('# 제목만', '| a |')).toThrow()
  })
})

describe('buildItemMarkdown', () => {
  it('필드 6개를 표로 담는다', () => {
    const md = buildItemMarkdown(makeItem())
    for (const field of ['제목', '주제', '키워드', '핵심 내용', '생성 일자', '원본 링크']) {
      expect(md).toContain(`| ${field} |`)
    }
  })
})

describe('summaryFileName', () => {
  it('날짜와 안전한 제목으로 만든다', () => {
    expect(summaryFileName(makeItem({ title: 'a/b: c' }))).toBe('20260926-100503_a_b__c.md')
  })
})
