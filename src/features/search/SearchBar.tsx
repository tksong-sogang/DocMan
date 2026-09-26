import { useState, type FormEvent } from 'react'
import Button from '../../components/Button'

/** P02 검색창 (F014) */
export default function SearchBar({ onSearch }: { onSearch(query: string): void }) {
  const [value, setValue] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const q = value.trim()
    if (q) onSearch(q)
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="주제나 키워드로 검색"
        aria-label="검색어"
      />
      <Button type="submit" variant="primary">
        검색
      </Button>
    </form>
  )
}
