import type { AnalysisResult, Category } from '../../types'
import { CATEGORY_CONFIG } from '../../utils/category'

/** 텍스트 입력이 이보다 길면 잘라서 보낸다 (무료 사용량 절약) */
export const MAX_TEXT_CHARS = 200_000

/** Gemini 구조화 출력 스키마 */
export const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    title: { type: 'STRING' },
    topic: { type: 'STRING' },
    keywords: { type: 'ARRAY', items: { type: 'STRING' } },
    summary: { type: 'ARRAY', items: { type: 'STRING' } },
  },
  required: ['title', 'topic', 'keywords', 'summary'],
}

export function buildPrompt(category: Category, existingTopics: string[]): string {
  const { maxKeywords, maxSummaryLines } = CATEGORY_CONFIG[category]
  const target =
    category === 'document'
      ? '첨부한 문서를 분석하세요.'
      : '첨부한 사진에서 글자를 모두 읽어낸 뒤, 그 내용을 분석하세요. 글자가 거의 없으면 사진에 보이는 내용을 바탕으로 분석하세요.'
  const topics = existingTopics.length
    ? `이미 등록된 주제: ${existingTopics.map((t) => `"${t}"`).join(', ')}\n뜻이 같은 주제가 있으면 그 이름을 그대로 쓰고, 없을 때만 새 주제를 만드세요.`
    : ''
  return [
    target,
    '결과는 한국어로, 아래 규칙을 지켜 JSON으로 답하세요.',
    '- title: 자료의 제목. 자료에 제목이 있으면 그대로, 없으면 내용을 대표하는 짧은 제목',
    '- topic: 자료의 주제 1개. 2~10자 정도의 짧은 명사구',
    `- keywords: 핵심 키워드 ${maxKeywords}개 이하`,
    `- summary: 핵심 내용 ${maxSummaryLines}줄 이하. 한 줄에 한 가지 내용을 개조식으로 짧게 (앞에 기호를 붙이지 말 것)`,
    topics,
  ]
    .filter(Boolean)
    .join('\n')
}

const clean = (s: unknown) => (typeof s === 'string' ? s.replace(/\s+/g, ' ').trim() : '')
// 모델이 줄 앞에 '-', '•', '1.' 같은 기호를 붙여도 떼어 낸다
const stripBullet = (s: string) => s.replace(/^(?:[-•*·]|\d+[.)])\s*/, '')

/** 모델 응답 JSON을 검증하고 카테고리 제한(키워드 수, 줄 수)에 맞춘다 */
export function parseAnalysis(text: string, category: Category): AnalysisResult {
  let raw: Record<string, unknown>
  try {
    raw = JSON.parse(text) as Record<string, unknown>
  } catch {
    throw new Error('분석 결과를 읽지 못했습니다. 다시 시도하세요')
  }
  const { maxKeywords, maxSummaryLines } = CATEGORY_CONFIG[category]
  const list = (v: unknown) => (Array.isArray(v) ? v.map(clean).map(stripBullet).filter(Boolean) : [])

  const title = clean(raw.title)
  const topic = clean(raw.topic)
  if (!title || !topic) throw new Error('분석 결과에 제목이나 주제가 없습니다. 다시 시도하세요')

  return {
    category,
    title,
    topic,
    keywords: [...new Set(list(raw.keywords))].slice(0, maxKeywords),
    summary: list(raw.summary).slice(0, maxSummaryLines),
  }
}

/** HTTP 오류를 사용자에게 보여줄 문장으로 바꾼다 */
export function errorMessage(status: number, body: string): string {
  if (status === 400 && body.includes('API_KEY_INVALID')) return 'Gemini API 키가 올바르지 않습니다. 설정에서 확인하세요'
  if (status === 403) return 'Gemini API를 쓸 권한이 없습니다. API 키를 확인하세요'
  if (status === 429) return 'Gemini 무료 사용량 한도를 넘었습니다. 잠시 후 다시 시도하세요'
  if (status === 413) return '파일이 너무 커서 분석할 수 없습니다'
  if (status >= 500) return 'Gemini 서버에 일시적인 문제가 있습니다. 잠시 후 다시 시도하세요'
  return `분석 요청이 실패했습니다 (${status})`
}
