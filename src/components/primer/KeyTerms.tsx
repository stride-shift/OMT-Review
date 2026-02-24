import type { KeyTerm } from '../../lib/types'

interface Props {
  terms: KeyTerm[]
}

export default function KeyTerms({ terms }: Props) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Key Terms</h3>
      <dl className="space-y-2">
        {terms.map((t, i) => (
          <div key={i} className="bg-gray-50 rounded-lg px-3 py-2">
            <dt className="text-sm font-semibold text-[#1e3a5f]">{t.term}</dt>
            <dd className="text-sm text-gray-600 mt-0.5">{t.definition}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
