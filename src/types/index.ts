/** 자료 카테고리: 일반 문서 / 사진 */
export type Category = 'document' | 'photo'

/** Gemini 분석 결과 (F007, F008) */
export interface AnalysisResult {
  category: Category
  title: string
  topic: string
  /** 문서 5개 이하, 사진 3개 이하 */
  keywords: string[]
  /** 핵심 내용 줄 목록. 문서 10줄 이하, 사진 4줄 이하 */
  summary: string[]
}

/** 저장된 자료 한 건 (F009, PRD 5.2) */
export interface Item extends AnalysisResult {
  id: string
  /** ISO 8601 */
  createdAt: string
  originalFileId: string
  originalLink: string
  summaryFileId: string
}

/** Drive의 DocMan/index.json (PRD 5.3) */
export interface IndexData {
  version: 1
  /** 카테고리별 건수. 저장할 때마다 1씩 올린다 */
  counts: Record<Category, number>
  /** 카테고리별 { 주제: 건수 }. 키 개수가 주제 수 */
  topics: Record<Category, Record<string, number>>
  /** 최신 항목이 앞 */
  items: Item[]
}

/** 브라우저 localStorage에 저장하는 설정 (F003) */
export interface AppSettings {
  geminiApiKey: string | null
}

/** 로그인한 Google 계정 정보 (F001, P05 표시용) */
export interface AuthUser {
  email: string
  name: string
}
