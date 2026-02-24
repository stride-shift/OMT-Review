import type { Citation } from '../../lib/types'

interface Props {
  citations: Citation[]
}

export default function Citations({ citations }: Props) {
  if (citations.length === 0) return null

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Web Sources</h3>
      <ul className="space-y-1.5">
        {citations.map((c, i) => (
          <li key={i} className="text-sm">
            <a
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {c.title || c.url}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
