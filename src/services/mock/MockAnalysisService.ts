import type { ExtractedInput } from '../../extractors/Extractor'
import type { Category } from '../../types'
import { CATEGORY_CONFIG } from '../../utils/category'
import type { AnalysisService } from '../gemini/AnalysisService'
import { delay } from './delay'

/** 더미 분석. 카테고리별 제한(키워드 수, 줄 수)에 맞는 고정 결과를 돌려준다 */
export class MockAnalysisService implements AnalysisService {
  async analyze(input: ExtractedInput, category: Category) {
    await delay(1000)
    const { maxKeywords, maxSummaryLines } = CATEGORY_CONFIG[category]
    const firstLine = input.kind === 'text' ? input.text.split('\n').find((l) => l.trim()) : undefined
    return {
      category,
      title: firstLine?.trim().slice(0, 40) || `더미 분석 결과 (${CATEGORY_CONFIG[category].label})`,
      topic: '더미 주제',
      keywords: Array.from({ length: maxKeywords }, (_, i) => `키워드${i + 1}`),
      summary: Array.from({ length: maxSummaryLines }, (_, i) => `더미 핵심 내용 ${i + 1}번째 줄입니다.`),
    }
  }
}
