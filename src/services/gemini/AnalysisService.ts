import type { ExtractedInput } from '../../extractors/Extractor'
import type { AnalysisResult, Category } from '../../types'

/** Gemini 자료 분석 (F007, F008) */
export interface AnalysisService {
  analyze(input: ExtractedInput, category: Category, apiKey: string): Promise<AnalysisResult>
}
