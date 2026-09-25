const pad = (n: number) => String(n).padStart(2, '0')

/** 화면 표시용: 2026-09-26 10:05 (로컬 시간) */
export function formatDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** 파일 이름용: 20260926-100503 (로컬 시간) */
export function toFileStamp(iso: string): string {
  const d = new Date(iso)
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-` +
    `${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
  )
}
