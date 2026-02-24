import type { CompletenessResult as CResult } from '../../lib/types'
import StatusBadge from './StatusBadge'

interface Props {
  result: CResult
}

export default function CompletenessResultView({ result }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <StatusBadge isComplete={result.is_complete} warningCount={result.warning_count} />
        <span className="text-sm text-gray-500">
          {result.error_count} error{result.error_count !== 1 ? 's' : ''}, {result.warning_count} warning{result.warning_count !== 1 ? 's' : ''}
        </span>
      </div>

      {result.errors.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-red-800 mb-2">Errors</h3>
          <div className="space-y-2">
            {result.errors.map((err, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-red-800">{err.message}</p>
                  <p className="text-xs text-red-600 mt-0.5">Field: <code className="bg-red-100 px-1 py-0.5 rounded">{err.field}</code></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {result.warnings.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-amber-800 mb-2">Warnings</h3>
          <div className="space-y-2">
            {result.warnings.map((warn, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-amber-800">{warn.message}</p>
                  <p className="text-xs text-amber-600 mt-0.5">Field: <code className="bg-amber-100 px-1 py-0.5 rounded">{warn.field}</code></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {result.errors.length === 0 && result.warnings.length === 0 && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-4">
          All required fields are present and meet minimum requirements.
        </p>
      )}
    </div>
  )
}
