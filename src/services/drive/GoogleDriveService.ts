import type { AnalysisResult, Category, IndexData, Item } from '../../types'
import { CATEGORIES, CATEGORY_CONFIG } from '../../utils/category'
import { addItemToIndex, createEmptyIndex } from '../../utils/indexData'
import { buildItemMarkdown, buildTableRow, createEmptyTable, insertRowAtTop, summaryFileName } from '../../utils/markdown'
import type { AuthService } from '../auth/AuthService'
import { DriveApi, DriveError, FOLDER_MIME } from './driveApi'
import type { DriveService } from './DriveService'

const ROOT_NAME = 'DocMan'
const INDEX_NAME = 'index.json'

const markdownBlob = (text: string) => new Blob([text], { type: 'text/markdown' })
const jsonBlob = (data: unknown) => new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })

/** 초기화 후 기억하는 폴더·파일 ID */
interface Structure {
  indexId: string
  categories: Record<Category, { originalsId: string; summariesId: string; tableId: string }>
}

/** Google Drive 저장소. drive.file 범위라서 DocMan이 만든 파일만 보인다 */
export class GoogleDriveService implements DriveService {
  private readonly api: DriveApi
  private readonly auth: AuthService
  private structure: Promise<Structure> | null = null

  constructor(auth: AuthService) {
    this.auth = auth
    this.api = new DriveApi(() => {
      const token = auth.getAccessToken()
      if (!token) {
        auth.markExpired()
        throw new Error('로그인이 만료되었습니다. 다시 로그인하세요')
      }
      return token
    })
  }

  /** 401이면 로그인 만료로 처리한다 */
  private async guard<T>(task: () => Promise<T>): Promise<T> {
    try {
      return await task()
    } catch (e) {
      if (e instanceof DriveError && e.status === 401) {
        this.auth.markExpired()
        throw new Error('로그인이 만료되었습니다. 다시 로그인하세요')
      }
      throw e
    }
  }

  private async folder(name: string, parentId: string): Promise<string> {
    const found = await this.api.findChild(name, parentId, FOLDER_MIME)
    return (found ?? (await this.api.createFolder(name, parentId))).id
  }

  private async file(name: string, parentId: string, initial: () => Blob): Promise<string> {
    const found = await this.api.findChild(name, parentId)
    return (found ?? (await this.api.createFile(name, parentId, initial()))).id
  }

  /** 폴더·빈 누적 표·index.json 중 없는 것만 만든다 (F004). 한 번만 실행하고 결과를 기억한다 */
  private ensureStructure(): Promise<Structure> {
    this.structure ??= this.buildStructure().catch((e) => {
      this.structure = null // 실패하면 다음에 다시 시도
      throw e
    })
    return this.structure
  }

  private async buildStructure(): Promise<Structure> {
    const rootId = await this.folder(ROOT_NAME, 'root')
    const indexId = await this.file(INDEX_NAME, rootId, () => jsonBlob(createEmptyIndex()))
    const entries = await Promise.all(
      CATEGORIES.map(async (category) => {
        const { folder, tableFile } = CATEGORY_CONFIG[category]
        const categoryId = await this.folder(folder, rootId)
        const [originalsId, summariesId, tableId] = await Promise.all([
          this.folder('originals', categoryId),
          this.folder('summaries', categoryId),
          this.file(tableFile, categoryId, () => markdownBlob(createEmptyTable(category))),
        ])
        return [category, { originalsId, summariesId, tableId }] as const
      }),
    )
    return { indexId, categories: Object.fromEntries(entries) as Structure['categories'] }
  }

  async initialize() {
    await this.guard(() => this.ensureStructure())
  }

  async loadIndex() {
    return this.guard(async () => {
      const { indexId } = await this.ensureStructure()
      return JSON.parse(await this.api.readText(indexId)) as IndexData
    })
  }

  /** 원본 → 자료별 MD → 누적 표 맨 위 행 → index.json 순서로 저장한다 (F009) */
  async saveItem(file: File, analysis: AnalysisResult) {
    return this.guard(async () => {
      const structure = await this.ensureStructure()
      const ids = structure.categories[analysis.category]

      const original = await this.api.createFile(file.name, ids.originalsId, file)
      const partial = {
        ...analysis,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        originalFileId: original.id,
        originalLink: original.webViewLink ?? `https://drive.google.com/file/d/${original.id}/view`,
      }
      const summary = await this.api.createFile(
        summaryFileName({ ...partial, summaryFileId: '' }),
        ids.summariesId,
        markdownBlob(buildItemMarkdown({ ...partial, summaryFileId: '' })),
      )
      const item: Item = { ...partial, summaryFileId: summary.id }

      const table = await this.api.readText(ids.tableId)
      await this.api.updateContent(ids.tableId, markdownBlob(insertRowAtTop(table, buildTableRow(item))))

      // 다른 기기에서 저장했을 수 있으니 index.json은 저장 직전에 다시 읽는다
      const index = JSON.parse(await this.api.readText(structure.indexId)) as IndexData
      await this.api.updateContent(structure.indexId, jsonBlob(addItemToIndex(index, item)))
      return item
    })
  }
}
