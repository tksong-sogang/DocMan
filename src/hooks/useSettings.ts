import { useState } from 'react'

const KEY = 'docman.geminiApiKey'

function readKey(): string | null {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

/** Gemini API 키 (F003). 이 브라우저의 localStorage에만 저장한다 */
export function useSettings() {
  const [geminiApiKey, setKey] = useState(readKey)

  const saveGeminiApiKey = (value: string) => {
    const trimmed = value.trim()
    try {
      localStorage.setItem(KEY, trimmed)
    } catch {
      // 저장소를 쓸 수 없으면 이번 화면에서만 유지
    }
    setKey(trimmed)
  }

  const clearGeminiApiKey = () => {
    try {
      localStorage.removeItem(KEY)
    } catch {
      // 무시
    }
    setKey(null)
  }

  return { geminiApiKey, saveGeminiApiKey, clearGeminiApiKey }
}
