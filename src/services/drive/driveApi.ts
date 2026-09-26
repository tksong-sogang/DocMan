// Google Drive v3 REST 호출 도우미
// https://developers.google.com/workspace/drive/api/reference/rest/v3

const API = 'https://www.googleapis.com/drive/v3'
const UPLOAD = 'https://www.googleapis.com/upload/drive/v3'
export const FOLDER_MIME = 'application/vnd.google-apps.folder'

export interface DriveFile {
  id: string
  webViewLink?: string
}

export class DriveError extends Error {
  readonly status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

/** 쿼리 문자열 안의 따옴표와 역슬래시를 처리한다 */
export function escapeQuery(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

export function childQuery(name: string, parentId: string, mimeType?: string): string {
  const parts = [`name = '${escapeQuery(name)}'`, `'${escapeQuery(parentId)}' in parents`, 'trashed = false']
  if (mimeType) parts.push(`mimeType = '${mimeType}'`)
  return parts.join(' and ')
}

export class DriveApi {
  private readonly getToken: () => string

  /** getToken은 토큰이 없으면 예외를 던져야 한다 */
  constructor(getToken: () => string) {
    this.getToken = getToken
  }

  private async request(url: string, init: RequestInit = {}): Promise<Response> {
    const res = await fetch(url, {
      ...init,
      headers: { ...init.headers, Authorization: `Bearer ${this.getToken()}` },
    })
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      throw new DriveError(res.status, `Google Drive 요청 실패 (${res.status}) ${body.slice(0, 200)}`)
    }
    return res
  }

  /** 부모 폴더 안에서 이름으로 찾는다. 없으면 null */
  async findChild(name: string, parentId: string, mimeType?: string): Promise<DriveFile | null> {
    const params = new URLSearchParams({
      q: childQuery(name, parentId, mimeType),
      fields: 'files(id,webViewLink)',
      spaces: 'drive',
      pageSize: '1',
    })
    const res = await this.request(`${API}/files?${params}`)
    const { files } = (await res.json()) as { files: DriveFile[] }
    return files[0] ?? null
  }

  async createFolder(name: string, parentId: string): Promise<DriveFile> {
    const res = await this.request(`${API}/files?fields=id`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify({ name, mimeType: FOLDER_MIME, parents: [parentId] }),
    })
    return (await res.json()) as DriveFile
  }

  /**
   * 파일을 만든다. 5MB가 넘는 원본도 올릴 수 있도록 resumable 업로드를 쓴다.
   * https://developers.google.com/workspace/drive/api/guides/manage-uploads
   */
  async createFile(name: string, parentId: string, content: Blob): Promise<DriveFile> {
    const mimeType = content.type || 'application/octet-stream'
    const start = await this.request(`${UPLOAD}/files?uploadType=resumable&fields=id,webViewLink`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8', 'X-Upload-Content-Type': mimeType },
      body: JSON.stringify({ name, parents: [parentId], mimeType }),
    })
    const sessionUrl = start.headers.get('Location')
    if (!sessionUrl) throw new Error('Google Drive 업로드 주소를 받지 못했습니다')
    const res = await this.request(sessionUrl, { method: 'PUT', headers: { 'Content-Type': mimeType }, body: content })
    return (await res.json()) as DriveFile
  }

  async readText(fileId: string): Promise<string> {
    const res = await this.request(`${API}/files/${encodeURIComponent(fileId)}?alt=media`)
    return res.text()
  }

  /** 휴지통으로 옮긴다 (30일 안에 Drive에서 복구 가능). 이미 없는 파일이면 무시한다 */
  async trash(fileId: string): Promise<void> {
    try {
      await this.request(`${API}/files/${encodeURIComponent(fileId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({ trashed: true }),
      })
    } catch (e) {
      if (e instanceof DriveError && e.status === 404) return
      throw e
    }
  }

  /** 파일 내용만 바꾼다 (누적 표 MD, index.json) */
  async updateContent(fileId: string, content: Blob): Promise<void> {
    await this.request(`${UPLOAD}/files/${encodeURIComponent(fileId)}?uploadType=media`, {
      method: 'PATCH',
      headers: { 'Content-Type': content.type || 'application/octet-stream' },
      body: content,
    })
  }
}
