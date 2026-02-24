import ApplicationPicker from '../components/ApplicationPicker'
import RunToolButton from '../components/RunToolButton'
import CompletenessResultView from '../components/completeness/CompletenessResult'
import { useTools } from '../lib/ToolContext'

export default function CompletenessPage() {
  const { completeness, setCompletenessApp, runCompleteness } = useTools()
  const { appId, selectedApp, result, loading, error } = completeness

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Completeness Checker</h2>
        <p className="text-sm text-gray-500 mt-1">
          Rule-based validation of required fields — no LLM, instant results
        </p>
      </div>

      <div className="space-y-4">
        <ApplicationPicker
          value={appId}
          onChange={(id, app) => setCompletenessApp(id, app)}
        />

        {selectedApp && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="font-semibold text-gray-500">Applicant:</span> {selectedApp.primary_contact}</div>
              <div><span className="font-semibold text-gray-500">Type:</span> {selectedApp.funding_type}</div>
              <div><span className="font-semibold text-gray-500">Institution:</span> {selectedApp.institution}</div>
              <div><span className="font-semibold text-gray-500">Topic:</span> {selectedApp.topic}</div>
            </div>
          </div>
        )}

        <RunToolButton
          label="Run Completeness Check"
          onClick={() => runCompleteness()}
          onForce={() => runCompleteness(true)}
          loading={loading}
          disabled={!appId}
          cached={result?.cached ?? null}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {result && <CompletenessResultView result={result} />}
      </div>
    </div>
  )
}
