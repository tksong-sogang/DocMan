import type { Extractor } from './Extractor'

const MIME_BY_EXT: Record<string, string> = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  heic: 'image/heic',
  heif: 'image/heif',
}

/**
 * PDF, 이미지: Gemini가 직접 읽으므로 파일을 그대로 넘긴다.
 * HEIC → JPEG 변환은 Phase 4-6에서 추가한다.
 */
export const fileExtractor: Extractor = {
  extensions: Object.keys(MIME_BY_EXT),
  async extract(file) {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
    return { kind: 'file', mimeType: file.type || MIME_BY_EXT[ext] || 'image/jpeg', data: file }
  },
}
