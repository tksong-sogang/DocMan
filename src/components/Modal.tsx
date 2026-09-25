import type { ReactNode } from 'react'
import Button from './Button'

interface Props {
  title: string
  onClose(): void
  children: ReactNode
  /** [닫기] 왼쪽에 놓을 버튼 (예: [원문 보기]) */
  actions?: ReactNode
}

/** 팝업 박스 (M01, M02). 여러 개가 열리면 나중에 연 것이 위에 온다 */
export default function Modal({ title, onClose, children, actions }: Props) {
  return (
    <div className="modal-overlay">
      <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <header className="modal-header">
          <h2>{title}</h2>
        </header>
        <div className="modal-body">{children}</div>
        <footer className="modal-footer">
          {actions}
          <Button onClick={onClose}>닫기</Button>
        </footer>
      </div>
    </div>
  )
}
