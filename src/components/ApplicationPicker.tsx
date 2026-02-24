import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Application } from '../lib/types'

interface Props {
  value: string
  onChange: (id: string, app: Application | null) => void
}

export default function ApplicationPicker({ value, onChange }: Props) {
  const [apps, setApps] = useState<Application[]>([])

  useEffect(() => {
    supabase
      .from('OMT_applications')
      .select('*')
      .order('application_id')
      .then(({ data }) => {
        if (data) setApps(data)
      })
  }, [])

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-gray-700">Application:</label>
      <select
        value={value}
        onChange={(e) => {
          const app = apps.find((a) => a.application_id === e.target.value) || null
          onChange(e.target.value, app)
        }}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[340px]"
      >
        <option value="">Select an application...</option>
        {apps.map((app) => (
          <option key={app.application_id} value={app.application_id}>
            {app.application_id} — {app.primary_contact} ({app.funding_type})
          </option>
        ))}
      </select>
    </div>
  )
}
