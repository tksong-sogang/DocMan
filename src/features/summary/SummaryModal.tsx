import { useState } from 'react'
import Button from '../../components/Button'
import ErrorMessage from '../../components/ErrorMessage'
import Modal from '../../components/Modal'
import Spinner from '../../components/Spinner'
import { useIndex } from '../../hooks/useIndex'
import { driveService } from '../../services'
import type { Item } from '../../types'
import { CATEGORY_CONFIG } from '../../utils/category'
import { formatDate } from '../../utils/date'

/** M01 요약 박스 (F012, F013, F017) */
export default function SummaryModal({ item, onClose }: { item: Item; onClose(): void }) {
  const { reload } = useIndex()
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const openOriginal = () => window.open(item.originalLink, '_blank', 'noopener')

  const handleDelete = async () => {
    if (!window.confirm(`'${item.title}'을(를) 삭제할까요?\n원본과 분석 파일은 Google Drive 휴지통으로 옮겨집니다.`)) return
    setDeleting(true)
    setError(null)
    try {
      await driveService.deleteItem(item)
      onClose()
      await reload()
    } catch (e) {
      setDeleting(false)
      setError(e instanceof Error ? e.message : '삭제하지 못했습니다')
    }
  }

  return (
    <Modal
      title={item.title}
      onClose={onClose}
      actions={
        deleting ? (
          <Spinner label="삭제하는 중…" />
        ) : (
          <>
            <Button variant="danger" onClick={handleDelete} className="modal-action-left">
              삭제
            </Button>
            <Button variant="primary" onClick={openOriginal}>
              원문 보기
            </Button>
          </>
        )
      }
    >
      <p className="muted summary-meta">
        {CATEGORY_CONFIG[item.category].label} · {item.topic} · {formatDate(item.createdAt)}
      </p>
      <ul className="summary-lines">
        {item.summary.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
      {error && <ErrorMessage message={error} />}
    </Modal>
  )
}
