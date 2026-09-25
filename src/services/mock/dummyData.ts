import type { Category, IndexData, Item } from '../../types'
import { CATEGORY_CONFIG } from '../../utils/category'
import { addItemToIndex, createEmptyIndex } from '../../utils/indexData'

// 주제별 키워드 후보. 키워드가 겹치는 주제끼리 그래프에서 연결된다
const DOCUMENT_TOPICS: Record<string, string[]> = {
  인공지능: ['머신러닝', '딥러닝', '데이터', 'GPT', '자동화'],
  '데이터 분석': ['데이터', '통계', '시각화', '파이썬', '머신러닝'],
  '기후 변화': ['탄소', '에너지', '환경', '정책', '재생에너지'],
  '재무 관리': ['예산', '투자', '세금', '저축', '정책'],
  '교육 정책': ['정책', '학교', '교육과정', '디지털', '평가'],
  '마케팅 전략': ['브랜드', '고객', 'SNS', '데이터', '광고'],
  '프로젝트 관리': ['일정', '위험', '예산', '협업', '자동화'],
  '건강 관리': ['운동', '식단', '수면', '스트레스', '검진'],
}

const PHOTO_TOPICS: Record<string, string[]> = {
  '회의 메모': ['일정', '협업', '결정'],
  영수증: ['예산', '지출', '세금'],
  '강의 슬라이드': ['교육과정', '머신러닝', '데이터'],
  명함: ['연락처', '회사', '고객'],
  공지문: ['일정', '학교', '안내'],
  '책 페이지': ['독서', '환경', '인용'],
}

function makeDummyItems(category: Category, topics: Record<string, string[]>, total: number, startHour: number): Item[] {
  const { maxKeywords, maxSummaryLines } = CATEGORY_CONFIG[category]
  const names = Object.keys(topics)
  const base = new Date('2026-09-26T09:00:00').getTime()
  return Array.from({ length: total }, (_, i) => {
    const topic = names[i % names.length]
    const pool = topics[topic]
    const n = i + 1
    const id = `mock-${category}-${n}`
    return {
      id,
      category,
      title: `${topic} ${category === 'document' ? '문서' : '사진'} ${n}`,
      topic,
      keywords: Array.from({ length: Math.min(maxKeywords, pool.length) }, (_, k) => pool[(i + k) % pool.length]),
      summary: Array.from(
        { length: (i % maxSummaryLines) + 1 },
        (_, k) => `${topic}에 관한 핵심 내용 ${k + 1}번째 줄입니다.`,
      ),
      // n이 클수록 최근 자료
      createdAt: new Date(base - (startHour + (total - n)) * 3600_000).toISOString(),
      originalFileId: `${id}-original`,
      originalLink: 'about:blank',
      summaryFileId: `${id}-summary`,
    }
  })
}

/** 문서 26건, 사진 25건이 들어 있는 더미 index */
export function buildDummyIndex(): IndexData {
  const items = [
    ...makeDummyItems('document', DOCUMENT_TOPICS, 26, 0),
    ...makeDummyItems('photo', PHOTO_TOPICS, 25, 1),
  ].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  // 오래된 것부터 추가해야 최신 항목이 앞에 온다
  return items.reduce(addItemToIndex, createEmptyIndex())
}
