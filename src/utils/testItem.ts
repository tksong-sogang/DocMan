import type { Item } from '../types'

/** 테스트용 항목 생성 */
export function makeItem(overrides: Partial<Item> = {}): Item {
  return {
    id: 'id-1',
    category: 'document',
    title: '테스트 문서',
    topic: '인공지능',
    keywords: ['머신러닝', '데이터'],
    summary: ['첫째 줄', '둘째 줄'],
    createdAt: '2026-09-26T10:05:03',
    originalFileId: 'orig-1',
    originalLink: 'https://drive.google.com/file/d/orig-1/view',
    summaryFileId: 'sum-1',
    ...overrides,
  }
}
