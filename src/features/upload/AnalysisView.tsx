import type { AnalysisResult } from '../../types'
import { CATEGORY_CONFIG } from '../../utils/category'

/** 저장 전 분석 결과 표시 (F007, F008) */
export default function AnalysisView({ result }: { result: AnalysisResult }) {
  return (
    <dl className="card analysis-view">
      <dt>카테고리</dt>
      <dd>{CATEGORY_CONFIG[result.category].label}</dd>
      <dt>제목</dt>
      <dd>{result.title}</dd>
      <dt>주제</dt>
      <dd>{result.topic}</dd>
      <dt>키워드</dt>
      <dd>{result.keywords.join(', ')}</dd>
      <dt>핵심 내용</dt>
      <dd>
        <ul className="summary-lines">
          {result.summary.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </dd>
    </dl>
  )
}
