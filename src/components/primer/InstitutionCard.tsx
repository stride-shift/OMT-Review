import type { InstitutionContext } from '../../lib/types'

interface Props {
  context: InstitutionContext
}

export default function InstitutionCard({ context }: Props) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
      <h3 className="text-sm font-semibold text-[#1e3a5f]">Institution Context</h3>
      <p className="text-sm font-medium text-gray-800">{context.institution_name}</p>
      <p className="text-sm text-gray-700">{context.reputation}</p>
      {context.notable_researchers && (
        <p className="text-sm text-gray-600">
          <span className="font-medium">Notable researchers:</span> {context.notable_researchers}
        </p>
      )}
      {context.source_url && (
        <a
          href={context.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Source
        </a>
      )}
    </div>
  )
}
