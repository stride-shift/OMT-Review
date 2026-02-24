import { Fragment, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Application } from '../lib/types'

export default function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('OMT_applications')
      .select('*')
      .order('application_id')
      .then(({ data }) => {
        if (data) setApps(data)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-[#1e3a5f] border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Applications</h2>
        <p className="text-sm text-gray-500 mt-1">{apps.length} sample applications loaded</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-semibold text-gray-600">ID</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Applicant</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Type</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Institution</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Topic</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Refs</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((app) => (
              <Fragment key={app.application_id}>
                <tr
                  onClick={() => setExpanded(expanded === app.application_id ? null : app.application_id)}
                  className="border-b border-gray-100 hover:bg-blue-50/50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs text-[#1e3a5f] font-semibold">{app.application_id}</td>
                  <td className="px-4 py-3 text-gray-800">{app.primary_contact}</td>
                  <td className="px-4 py-3">
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-medium">
                      {app.funding_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{app.institution}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{app.topic}</td>
                  <td className="px-4 py-3 text-center">
                    {app.reference_count !== null ? (
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${
                        app.reference_count >= 3 ? 'bg-green-100 text-green-800' :
                        app.reference_count === 2 ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {app.reference_count}
                      </span>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                </tr>
                {expanded === app.application_id && (
                  <tr>
                    <td colSpan={6} className="px-4 py-4 bg-gray-50">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        {[
                          ['Email', app.email],
                          ['Faculty', app.faculty],
                          ['Study Choice', app.study_choice],
                          ['Duration', app.duration ? `${app.duration} year(s)` : null],
                          ['Start Date', app.start_date],
                          ['Target Institution', app.target_institution],
                          ['Academic Awards', app.academic_awards],
                          ['Budget Y1/Y2/Y3', [app.budget_year_1, app.budget_year_2, app.budget_year_3].filter(Boolean).map(b => `R${Number(b).toLocaleString()}`).join(' / ') || null],
                        ].map(([label, value]) => value ? (
                          <div key={label as string}>
                            <span className="font-semibold text-gray-500">{label as string}:</span>{' '}
                            <span className="text-gray-700">{value as string}</span>
                          </div>
                        ) : null)}
                        {app.motivation && (
                          <div className="col-span-2">
                            <span className="font-semibold text-gray-500">Motivation:</span>
                            <p className="text-gray-700 mt-1">{app.motivation}</p>
                          </div>
                        )}
                        {app.research_synopsis && (
                          <div className="col-span-2">
                            <span className="font-semibold text-gray-500">Research Synopsis:</span>
                            <p className="text-gray-700 mt-1">{app.research_synopsis}</p>
                          </div>
                        )}
                        {app.programme_description && (
                          <div className="col-span-2">
                            <span className="font-semibold text-gray-500">Programme Description:</span>
                            <p className="text-gray-700 mt-1">{app.programme_description}</p>
                          </div>
                        )}
                        {app.overseas_justification && (
                          <div className="col-span-2">
                            <span className="font-semibold text-gray-500">Overseas Justification:</span>
                            <p className="text-gray-700 mt-1">{app.overseas_justification}</p>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
