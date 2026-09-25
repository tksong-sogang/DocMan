import type { Category } from '../types'

/** 카테고리별 설정: 표시 이름, 분석 제한(F007, F008), Drive 저장 위치(PRD 5.1) */
export const CATEGORY_CONFIG: Record<
  Category,
  { label: string; maxKeywords: number; maxSummaryLines: number; folder: string; tableFile: string }
> = {
  document: {
    label: '일반 문서',
    maxKeywords: 5,
    maxSummaryLines: 10,
    folder: 'Documents',
    tableFile: 'Documents.md',
  },
  photo: {
    label: '사진',
    maxKeywords: 3,
    maxSummaryLines: 4,
    folder: 'Photos',
    tableFile: 'Photos.md',
  },
}

export const CATEGORIES: Category[] = ['document', 'photo']

const EXTENSIONS: Record<Category, string[]> = {
  document: ['pdf', 'docx', 'md', 'txt'],
  photo: ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'],
}

/** 소문자, 점 없는 확장자. 없으면 빈 문자열 */
export function getExtension(fileName: string): string {
  const dot = fileName.lastIndexOf('.')
  return dot < 0 ? '' : fileName.slice(dot + 1).toLowerCase()
}

/** 확장자로 카테고리를 정한다 (F005). 지원하지 않는 형식이면 null */
export function detectCategory(file: { name: string; type: string }): Category | null {
  const ext = getExtension(file.name)
  for (const category of CATEGORIES) {
    if (EXTENSIONS[category].includes(ext)) return category
  }
  // 카메라 촬영 파일은 확장자가 없을 수 있다 (F006)
  if (ext === '' && file.type.startsWith('image/')) return 'photo'
  return null
}
