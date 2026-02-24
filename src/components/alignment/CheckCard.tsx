import type { AlignmentCheck } from '../../lib/types'

const statusConfig = {
  aligned: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', badge: 'bg-green-100 text-green-800', label: 'Aligned' },
  concern: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', badge: 'bg-amber-100 text-amber-800', label: 'Concern' },
  flag: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', badge: 'bg-red-100 text-red-800', label: 'Flag' },
  not_applicable: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600', badge: 'bg-gray-100 text-gray-600', label: 'N/A' },
}

const checkNames: Record<string, string> = {
  expertise_to_research: 'Expertise-to-Research',
  ambition_calibration: 'Ambition Calibration',
  budget_to_plan: 'Budget-to-Plan',
  motivation_to_research: 'Motivation-to-Research',
  overseas_justification: 'Overseas Justification',
}

interface Props {
  check: AlignmentCheck
}

export default function CheckCard({ check }: Props) {
  const cfg = statusConfig[check.status]

  return (
    <div className={`${cfg.bg} border ${cfg.border} rounded-lg p-4 space-y-3`}>
      <div className="flex items-center justify-between">
        <h4 className={`text-sm font-semibold ${cfg.text}`}>
          {checkNames[check.category] || check.category}
        </h4>
        <span className={`${cfg.badge} px-2 py-0.5 rounded-full text-xs font-semibold uppercase`}>
          {cfg.label}
        </span>
      </div>

      <p className={`text-sm ${cfg.text}`}>{check.finding}</p>

      {check.evidence.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">Evidence</p>
          <ul className="space-y-1">
            {check.evidence.map((e, i) => (
              <li key={i} className="text-xs text-gray-700 bg-white/60 rounded px-2 py-1 italic">
                "{e}"
              </li>
            ))}
          </ul>
        </div>
      )}

      {check.reviewer_question && (
        <div className="bg-white/60 rounded px-3 py-2">
          <p className="text-xs font-medium text-gray-500 mb-0.5">Reviewer Question</p>
          <p className="text-sm text-gray-800">{check.reviewer_question}</p>
        </div>
      )}
    </div>
  )
}
