import type { ExtractedInput } from '../../extractors/Extractor'
import type { Category } from '../../types'
import type { AnalysisService } from './AnalysisService'
import { buildPrompt, errorMessage, MAX_TEXT_CHARS, parseAnalysis, RESPONSE_SCHEMA } from './geminiPrompt'
import { fetchWithRetry } from './retry'

// 별칭: 최신 Flash 모델을 자동으로 따라간다 (https://ai.google.dev/gemini-api/docs/models)
const MODEL = 'gemini-flash-latest'
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`
/** 요청 전체 한도 20MB 안에 들도록 제한한다 (base64로 약 1.33배가 된다) */
export const MAX_FILE_BYTES = 14 * 1024 * 1024

function toBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '')
    reader.onerror = () => reject(new Error('파일을 읽지 못했습니다'))
    reader.readAsDataURL(blob)
  })
}

/** Gemini generateContent + JSON 구조화 출력 */
export class GeminiAnalysisService implements AnalysisService {
  async analyze(input: ExtractedInput, category: Category, apiKey: string, existingTopics: string[]) {
    if (!apiKey) throw new Error('설정에서 Gemini API 키를 입력하세요')

    let contentPart: object
    if (input.kind === 'text') {
      if (!input.text.trim()) throw new Error('파일에서 읽을 수 있는 글자가 없습니다')
      contentPart = { text: `[자료 내용]\n${input.text.slice(0, MAX_TEXT_CHARS)}` }
    } else {
      if (input.data.size > MAX_FILE_BYTES) throw new Error('파일이 너무 큽니다 (최대 14MB)')
      contentPart = { inline_data: { mime_type: input.mimeType, data: await toBase64(input.data) } }
    }

    const body = JSON.stringify({
      contents: [{ role: 'user', parts: [contentPart, { text: buildPrompt(category, existingTopics) }] }],
      generationConfig: { responseMimeType: 'application/json', responseSchema: RESPONSE_SCHEMA },
    })
    // 무료 사용량에서 자주 나는 429(한도)·503(과부하)은 잠시 뒤 자동으로 다시 시도한다
    const res = await fetchWithRetry(() =>
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body,
      }),
    ).catch(() => {
      throw new Error('Gemini에 연결하지 못했습니다. 인터넷 연결을 확인하세요')
    })
    if (!res.ok) throw new Error(errorMessage(res.status, await res.text().catch(() => '')))

    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[]
      promptFeedback?: { blockReason?: string }
    }
    if (data.promptFeedback?.blockReason) throw new Error('Gemini가 이 자료의 분석을 거부했습니다')
    const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? ''
    if (!text) throw new Error('분석 결과가 비어 있습니다. 다시 시도하세요')
    return parseAnalysis(text, category)
  }
}
