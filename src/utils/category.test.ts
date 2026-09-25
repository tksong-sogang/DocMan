import { describe, expect, it } from 'vitest'
import { detectCategory, getExtension } from './category'

describe('getExtension', () => {
  it('소문자 확장자를 돌려준다', () => {
    expect(getExtension('보고서.PDF')).toBe('pdf')
    expect(getExtension('a.b.docx')).toBe('docx')
    expect(getExtension('noext')).toBe('')
  })
})

describe('detectCategory', () => {
  it.each([
    ['a.pdf', 'document'],
    ['a.docx', 'document'],
    ['a.md', 'document'],
    ['a.txt', 'document'],
    ['a.JPG', 'photo'],
    ['a.png', 'photo'],
    ['a.heic', 'photo'],
  ])('%s → %s', (name, expected) => {
    expect(detectCategory({ name, type: '' })).toBe(expected)
  })

  it('지원하지 않는 형식은 null', () => {
    expect(detectCategory({ name: 'a.hwp', type: '' })).toBeNull()
    expect(detectCategory({ name: 'a.xlsx', type: '' })).toBeNull()
  })

  it('확장자가 없는 이미지는 사진으로 본다', () => {
    expect(detectCategory({ name: 'camera', type: 'image/jpeg' })).toBe('photo')
  })
})
