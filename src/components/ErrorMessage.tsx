import Button from './Button'

export default function ErrorMessage({ message, onRetry }: { message: string; onRetry?(): void }) {
  return (
    <div className="error-message" role="alert">
      <span>{message}</span>
      {onRetry && <Button onClick={onRetry}>다시 시도</Button>}
    </div>
  )
}
