import type { AlignmentResult as AResult } from '../../lib/types'
import CheckCard from './CheckCard'

const overallConfig = {
  STRONG: { bg: 'bg-green-100', text: 'text-green-800', label: 'Strong Alignment' },
  MODERATE: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Moderate Alignment' },
  CONCERNS: { bg: 'bg-red-100', text: 'text-red-800', label: 'Alignment Concerns' },
}

interface Props {
  result: AResult
}

export default function AlignmentResultView({ result }: Props) {
  const cfg = overallConfig[result.overall_alignment]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <span className={`${cfg.bg} ${cfg.text} px-3 py-1 rounded-full text-sm font-semibold`}>
          {cfg.label}
        </span>
        <span className="text-xs text-gray-400">Model: {result.model}</span>
      </div>

      <p className="text-sm text-gray-700 bg-white border border-gray-200 rounded-lg p-4">
        {result.summary}
      </p>

      <div className="space-y-3">
        {result.checks.map((check, i) => (
          <CheckCard key={i} check={check} />
        ))}
      </div>
    </div>
  )
}
