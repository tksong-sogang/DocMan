/** 분석 서비스에 넘길 입력: 추출한 텍스트 또는 Gemini에 그대로 보낼 파일 */
export type ExtractedInput =
  | { kind: 'text'; text: string }
  | { kind: 'file'; mimeType: string; data: Blob }

/** 파일 형식별 추출기. 새 형식(예: HWP)은 추출기를 추가해서 지원한다 */
export interface Extractor {
  /** 소문자, 점 없이 (예: 'pdf', 'docx') */
  extensions: string[]
  extract(file: File): Promise<ExtractedInput>
}
