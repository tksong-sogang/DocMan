import type { ExtractedInput } from '../../extractors/Extractor'
import type { AnalysisResult, Category } from '../../types'

/** Gemini 자료 분석 (F007, F008) */
export interface AnalysisService {
  /**
   * @param existingTopics 이미 등록된 주제. 알맞은 주제가 있으면 같은 이름을 쓰도록 모델에 알려준다
   */
  analyze(
    input: ExtractedInput,
    category: Category,
    apiKey: string,
    existingTopics: string[],
  ): Promise<AnalysisResult>
}
