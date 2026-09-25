import { getExtension } from '../utils/category'
import { docxExtractor } from './docxExtractor'
import type { Extractor } from './Extractor'
import { fileExtractor } from './fileExtractor'
import { textExtractor } from './textExtractor'

/** 새 형식을 지원하려면 추출기를 만들어 이 목록에 추가한다 */
const EXTRACTORS: Extractor[] = [textExtractor, docxExtractor, fileExtractor]

/** 파일에 맞는 추출기. 확장자가 없는 카메라 이미지는 fileExtractor로 처리한다 */
export function findExtractor(file: File): Extractor | null {
  const ext = getExtension(file.name)
  if (ext === '' && file.type.startsWith('image/')) return fileExtractor
  return EXTRACTORS.find((e) => e.extensions.includes(ext)) ?? null
}
