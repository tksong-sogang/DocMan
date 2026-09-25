import type { AnalysisResult, IndexData, Item } from '../../types'

/** Google Drive 저장소 (F004, F009, F010~F015 데이터) */
export interface DriveService {
  /** DocMan 폴더, 하위 폴더, 빈 누적 표 MD, index.json 중 없는 것만 만든다 (F004) */
  initialize(): Promise<void>
  loadIndex(): Promise<IndexData>
  /**
   * 원본 → 자료별 MD → 누적 표 맨 위 행 추가 → index.json 갱신 순서로 저장한다 (F009)
   */
  saveItem(file: File, analysis: AnalysisResult): Promise<Item>
}
