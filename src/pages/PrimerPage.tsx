import ApplicationPicker from '../components/ApplicationPicker'
import RunToolButton from '../components/RunToolButton'
import PrimerResultView from '../components/primer/PrimerResult'
import { useTools } from '../lib/ToolContext'

export default function PrimerPage() {
  const { primer, setPrimerApp, runPrimer } = useTools()
  const { appId, selectedApp, result, loading, error } = primer

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Subject Matter Primer</h2>
        <p className="text-sm text-gray-500 mt-1">
          LLM-generated background briefing with web search — field overview, key terms, and evaluation guidance
        </p>
      </div>

      <div className="space-y-4">
        <ApplicationPicker
          value={appId}
          onChange={(id, app) => setPrimerApp(id, app)}
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
          label="Generate Primer"
          onClick={() => runPrimer()}
          onForce={() => runPrimer(true)}
          loading={loading}
          disabled={!appId}
          cached={result?.cached ?? null}
        />

        {loading && (
          <p className="text-sm text-gray-500 italic">
            Generating primer with web search — this may take 15-30 seconds...
          </p>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {result && <PrimerResultView result={result} />}
      </div>
    </div>
  )
}
