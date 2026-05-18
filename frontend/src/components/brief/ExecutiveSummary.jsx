export default function ExecutiveSummary({ plan, timings }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-5 mb-4">
      <div className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-3">Executive Summary</div>
      <p className="text-gray-200 text-sm leading-relaxed mb-4">{plan.executive_summary}</p>

      {timings && (
        <div className="flex gap-6 border-t border-border pt-3">
          {Object.entries(timings).map(([agent, secs]) => (
            <div key={agent} className="text-center">
              <div className="text-xs text-gray-600 font-mono capitalize">{agent}</div>
              <div className="text-xs text-gray-400 font-mono">{secs}s</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
