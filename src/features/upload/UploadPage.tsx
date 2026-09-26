import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import Button from '../../components/Button'
import ErrorMessage from '../../components/ErrorMessage'
import Spinner from '../../components/Spinner'
import { findExtractor } from '../../extractors'
import { useIndex } from '../../hooks/useIndex'
import { useSettings } from '../../hooks/useSettings'
import { analysisService, driveService } from '../../services'
import type { AnalysisResult } from '../../types'
import { detectCategory } from '../../utils/category'
import AnalysisView from './AnalysisView'
import FilePicker from './FilePicker'

type Step =
  | { kind: 'idle' }
  | { kind: 'analyzing'; file: File }
  | { kind: 'review'; file: File; result: AnalysisResult }
  | { kind: 'saving'; file: File; result: AnalysisResult }
  | { kind: 'error'; message: string; retry?: () => void }

const UNSUPPORTED = '지원하지 않는 형식입니다 (HWP는 PDF로 변환해 올려주세요)'
const toMessage = (e: unknown, fallback: string) => (e instanceof Error ? e.message : fallback)

/** P03 업로드 (F005~F009) */
export default function UploadPage() {
  const navigate = useNavigate()
  const { index, reload } = useIndex()
  const { geminiApiKey } = useSettings()
  const [step, setStep] = useState<Step>({ kind: 'idle' })

  const analyze = async (file: File) => {
    const category = detectCategory(file)
    const extractor = findExtractor(file)
    if (!category || !extractor) {
      setStep({ kind: 'error', message: UNSUPPORTED })
      return
    }
    setStep({ kind: 'analyzing', file })
    try {
      const input = await extractor.extract(file)
      const existingTopics = Object.keys(index?.topics[category] ?? {})
      const result = await analysisService.analyze(input, category, geminiApiKey ?? '', existingTopics)
      setStep({ kind: 'review', file, result })
    } catch (e) {
      setStep({ kind: 'error', message: toMessage(e, '분석하지 못했습니다'), retry: () => analyze(file) })
    }
  }

  const save = async (file: File, result: AnalysisResult) => {
    setStep({ kind: 'saving', file, result })
    try {
      await driveService.saveItem(file, result)
      await reload()
      navigate('/', { state: { savedTitle: result.title } })
    } catch (e) {
      setStep({ kind: 'error', message: toMessage(e, '저장하지 못했습니다'), retry: () => save(file, result) })
    }
  }

  const reset = () => setStep({ kind: 'idle' })

  if (!geminiApiKey) {
    return (
      <>
        <h1>업로드</h1>
        <div className="notice">
          설정에서 Gemini API 키를 입력하세요.{' '}
          <Link to="/settings" className="btn">
            설정으로 가기
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <h1>업로드</h1>
      {step.kind === 'idle' && <FilePicker onFile={analyze} />}

      {step.kind === 'analyzing' && <Spinner label={`'${step.file.name}' 분석 중…`} />}

      {(step.kind === 'review' || step.kind === 'saving') && (
        <>
          <p className="muted">{step.file.name}</p>
          <AnalysisView result={step.result} />
          <div className="actions">
            {step.kind === 'saving' ? (
              <Spinner label="Google Drive에 저장하는 중…" />
            ) : (
              <>
                <Button onClick={reset}>취소</Button>
                <Button variant="primary" onClick={() => save(step.file, step.result)}>
                  저장
                </Button>
              </>
            )}
          </div>
        </>
      )}

      {step.kind === 'error' && (
        <>
          <ErrorMessage message={step.message} onRetry={step.retry} />
          <div className="actions">
            <Button onClick={reset}>처음으로</Button>
          </div>
        </>
      )}
    </>
  )
}
