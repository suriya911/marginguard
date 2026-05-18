import { useNavigate } from 'react-router-dom'
import useMarginStore from '../store/useMarginStore'

// Sabari + Suriya Day 4 — brief components go here
export default function BriefPage() {
  const navigate = useNavigate()
  const brief = useMarginStore((s) => s.brief)

  if (!brief) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <p className="text-gray-500 font-mono text-sm mb-4">No brief yet — run the pipeline first.</p>
        <button
          onClick={() => navigate('/')}
          className="text-ai text-sm font-mono hover:underline"
        >
          ← Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-mono text-xl font-semibold text-white">MarginGuard Brief</h2>
        <button onClick={() => navigate('/')} className="text-gray-400 text-sm font-mono hover:text-white">
          ← Dashboard
        </button>
      </div>

      {/* Placeholder — Day 4 components slot in here */}
      <pre className="bg-surface border border-border rounded-lg p-4 text-xs text-gray-300 overflow-auto max-h-96 font-mono">
        {JSON.stringify(brief, null, 2)}
      </pre>
    </main>
  )
}
