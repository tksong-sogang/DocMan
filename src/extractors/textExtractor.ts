import type { Extractor } from './Extractor'

/** MD, TXT: 텍스트를 그대로 읽는다 */
export const textExtractor: Extractor = {
  extensions: ['md', 'txt'],
  async extract(file) {
    return { kind: 'text', text: await file.text() }
  },
}
