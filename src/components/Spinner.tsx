export default function Spinner({ label = '불러오는 중…' }: { label?: string }) {
  return (
    <div className="spinner" role="status">
      <span className="spinner-circle" aria-hidden="true" />
      {label}
    </div>
  )
}
