import type { AnalysisResult, IndexData, Item } from '../../types'
import { CATEGORIES, CATEGORY_CONFIG } from '../../utils/category'
import { addItemToIndex } from '../../utils/indexData'
import { buildItemMarkdown, buildTableRow, createEmptyTable, insertRowAtTop, summaryFileName } from '../../utils/markdown'
import type { DriveService } from '../drive/DriveService'
import { buildDummyIndex } from './dummyData'
import { delay } from './delay'

/** 메모리에 저장하는 더미 Drive. 새로고침하면 더미 데이터로 돌아간다 */
export class MockDriveService implements DriveService {
  private index: IndexData = buildDummyIndex()
  /** 경로 → MD 내용 */
  private files = new Map<string, string>()

  async initialize() {
    await delay(500)
    for (const category of CATEGORIES) {
      const path = `DocMan/${CATEGORY_CONFIG[category].folder}/${CATEGORY_CONFIG[category].tableFile}`
      if (!this.files.has(path)) this.files.set(path, createEmptyTable(category))
    }
  }

  async loadIndex() {
    await delay(300)
    return structuredClone(this.index)
  }

  async saveItem(file: File, analysis: AnalysisResult) {
    await delay(800)
    const id = crypto.randomUUID()
    const item: Item = {
      ...analysis,
      id,
      createdAt: new Date().toISOString(),
      originalFileId: `${id}-original`,
      // 더미에서도 원문 보기가 동작하도록 브라우저 메모리의 파일을 가리킨다
      originalLink: URL.createObjectURL(file),
      summaryFileId: `${id}-summary`,
    }
    const folder = `DocMan/${CATEGORY_CONFIG[item.category].folder}`
    this.files.set(`${folder}/summaries/${summaryFileName(item)}`, buildItemMarkdown(item))
    const tablePath = `${folder}/${CATEGORY_CONFIG[item.category].tableFile}`
    const table = this.files.get(tablePath) ?? createEmptyTable(item.category)
    this.files.set(tablePath, insertRowAtTop(table, buildTableRow(item)))
    this.index = addItemToIndex(this.index, item)
    return item
  }
}
