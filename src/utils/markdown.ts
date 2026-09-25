import type { Category, Item } from '../types'
import { CATEGORY_CONFIG } from './category'
import { formatDate, toFileStamp } from './date'

const TABLE_COLUMNS = ['제목', '주제', '키워드', '핵심 내용', '생성 일자', '원본 링크']

/** 표 셀 안에서 표 구조를 깨는 문자를 처리한다 */
export function escapeCell(text: string): string {
  return text.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ').trim()
}

const summaryCell = (summary: string[]) => summary.map((line) => `- ${escapeCell(line)}`).join('<br>')
const linkCell = (item: Item) => `[원본 보기](${item.originalLink})`

/** 자료별 MD 파일 이름 (PRD 5.4) */
export function summaryFileName(item: Item): string {
  const safeTitle = item.title.replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, '_').slice(0, 50)
  return `${toFileStamp(item.createdAt)}_${safeTitle}.md`
}

/** 자료별 MD: 필드를 표로 정리한다 (PRD 5.4) */
export function buildItemMarkdown(item: Item): string {
  const rows: [string, string][] = [
    ['제목', escapeCell(item.title)],
    ['주제', escapeCell(item.topic)],
    ['키워드', item.keywords.map(escapeCell).join(', ')],
    ['핵심 내용', summaryCell(item.summary)],
    ['생성 일자', formatDate(item.createdAt)],
    ['원본 링크', linkCell(item)],
  ]
  return [
    `# ${item.title}`,
    '',
    '| 필드 | 내용 |',
    '|---|---|',
    ...rows.map(([k, v]) => `| ${k} | ${v} |`),
    '',
  ].join('\n')
}

/** 빈 누적 표 MD (F004) */
export function createEmptyTable(category: Category): string {
  return [
    `# ${CATEGORY_CONFIG[category].label} 목록`,
    '',
    `| ${TABLE_COLUMNS.join(' | ')} |`,
    `|${TABLE_COLUMNS.map(() => '---').join('|')}|`,
    '',
  ].join('\n')
}

/** 누적 표의 한 행 */
export function buildTableRow(item: Item): string {
  const cells = [
    escapeCell(item.title),
    escapeCell(item.topic),
    item.keywords.map(escapeCell).join(', '),
    summaryCell(item.summary),
    formatDate(item.createdAt),
    linkCell(item),
  ]
  return `| ${cells.join(' | ')} |`
}

/** 누적 표의 헤더 바로 아래(맨 위)에 행을 넣는다 (F009) */
export function insertRowAtTop(tableMarkdown: string, row: string): string {
  const lines = tableMarkdown.split('\n')
  const separator = lines.findIndex((line) => /^\|(\s*:?-+:?\s*\|)+\s*$/.test(line))
  if (separator < 0) throw new Error('누적 표에서 헤더 구분선을 찾을 수 없습니다')
  lines.splice(separator + 1, 0, row)
  return lines.join('\n')
}
