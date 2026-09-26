import { useRef, useState, type DragEvent } from 'react'
import Button from '../../components/Button'

const ACCEPT = '.pdf,.docx,.md,.txt,.jpg,.jpeg,.png,.webp,.heic,.heif'
// 카메라 버튼은 터치 기기(폰)에서만 보인다 (F006)
const isTouchDevice = () => window.matchMedia('(pointer: coarse)').matches

/** 드래그 앤 드롭, 파일 선택, 카메라 촬영 (F005, F006). 한 번에 파일 1개 */
export default function FilePicker({ onFile }: { onFile(file: File): void }) {
  const fileInput = useRef<HTMLInputElement>(null)
  const cameraInput = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [showCamera] = useState(isTouchDevice)

  const pick = (files: FileList | null) => {
    if (files?.[0]) onFile(files[0])
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    pick(e.dataTransfer.files)
  }

  return (
    <div
      className={`dropzone${dragging ? ' dropzone-active' : ''}`}
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <p>여기에 파일을 끌어다 놓으세요</p>
      <p className="muted">PDF, DOCX, MD, TXT, 사진 · 한 번에 1개</p>
      <div className="actions">
        <Button variant="primary" onClick={() => fileInput.current?.click()}>
          파일 선택
        </Button>
        {showCamera && <Button onClick={() => cameraInput.current?.click()}>카메라</Button>}
      </div>
      <input ref={fileInput} type="file" accept={ACCEPT} hidden onChange={(e) => pick(e.target.files)} />
      <input
        ref={cameraInput}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(e) => pick(e.target.files)}
      />
    </div>
  )
}
