import Button from '../../components/Button'
import Modal from '../../components/Modal'
import type { Item } from '../../types'
import { CATEGORY_CONFIG } from '../../utils/category'
import { formatDate } from '../../utils/date'

/** M01 요약 박스 (F012, F013) */
export default function SummaryModal({ item, onClose }: { item: Item; onClose(): void }) {
  const openOriginal = () => window.open(item.originalLink, '_blank', 'noopener')

  return (
    <Modal
      title={item.title}
      onClose={onClose}
      actions={
        <Button variant="primary" onClick={openOriginal}>
          원문 보기
        </Button>
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
    </Modal>
  )
}
