import type { PrimerResult as PResult } from '../../lib/types'
import KeyTerms from './KeyTerms'
import InstitutionCard from './InstitutionCard'
import Citations from './Citations'

interface Props {
  result: PResult
}

export default function PrimerResultView({ result }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400">Model: {result.model}</span>
      </div>

      <section>
        <h3 className="text-sm font-semibold text-gray-700 mb-1">Field Overview</h3>
        <p className="text-sm text-gray-700 bg-white border border-gray-200 rounded-lg p-4">
          {result.field_overview}
        </p>
      </section>

      <KeyTerms terms={result.key_terms} />

      <section>
        <h3 className="text-sm font-semibold text-gray-700 mb-1">Research Context</h3>
        <p className="text-sm text-gray-700 bg-white border border-gray-200 rounded-lg p-4 whitespace-pre-line">
          {result.research_context}
        </p>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-gray-700 mb-1">Evaluation Guidance</h3>
        <p className="text-sm text-gray-700 bg-white border border-gray-200 rounded-lg p-4 whitespace-pre-line">
          {result.evaluation_guidance}
        </p>
      </section>

      <InstitutionCard context={result.institution_context} />

      <section className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-500 mb-1">Confidence Note</h3>
        <p className="text-xs text-gray-500 italic">{result.confidence_note}</p>
      </section>

      <Citations citations={result.citations} />
    </div>
  )
}
