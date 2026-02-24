interface Props {
  label: string
  onClick: () => void
  onForce: () => void
  loading: boolean
  disabled: boolean
  cached: boolean | null
}

export default function RunToolButton({ label, onClick, onForce, loading, disabled, cached }: Props) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:bg-[#2a4f7f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {loading ? 'Running...' : label}
      </button>
      {cached !== null && cached && (
        <span className="inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Cached result
          <button onClick={onForce} className="ml-1 underline hover:text-amber-900">Re-run</button>
        </span>
      )}
    </div>
  )
}
