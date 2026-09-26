import { describe, expect, it } from 'vitest'
import { childQuery, escapeQuery } from './driveApi'

describe('childQuery', () => {
  it('이름의 따옴표를 처리하고 조건을 잇는다', () => {
    expect(escapeQuery("it's")).toBe("it\\'s")
    expect(childQuery('DocMan', 'root', 'application/vnd.google-apps.folder')).toBe(
      "name = 'DocMan' and 'root' in parents and trashed = false and mimeType = 'application/vnd.google-apps.folder'",
    )
  })
})
