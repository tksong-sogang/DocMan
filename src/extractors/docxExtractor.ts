import type { Extractor } from './Extractor'

/** DOCX: mammoth로 본문 텍스트를 뽑는다 */
export const docxExtractor: Extractor = {
  extensions: ['docx'],
  async extract(file) {
    // DOCX를 올릴 때만 불러오도록 동적 import
    const mammoth = await import('mammoth')
    const { value } = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })
    return { kind: 'text', text: value }
  },
}
