import { useState } from 'react'
import clsx from 'clsx'

const CATEGORY_ICON = {
  creative:     '✏️',
  targeting:    '🎯',
  bidding:      '💰',
  landing_page: '📄',
  audience:     '👥',
  inventory:    '📦',
  budget:       '📊',
}

const PRIORITY_STYLE = {
  high:   { badge: 'bg-danger/20 text-danger border-danger/30',   dot: 'bg-danger',   label: 'HIGH'   },
  medium: { badge: 'bg-warning/20 text-warning border-warning/30', dot: 'bg-warning', label: 'MEDIUM' },
  low:    { badge: 'bg-gray-700 text-gray-400 border-gray-600',    dot: 'bg-gray-500', label: 'LOW'    },
}

const EFFORT_COLOR = {
  'Low (30 min)':      'text-profit',
  'Medium (2–3 hrs)':  'text-warning',
  'High (1–2 days)':   'text-danger',
}

function SuggestionCard({ s, expanded, onToggle }) {
  const pri  = PRIORITY_STYLE[s.priority]
  const icon = CATEGORY_ICON[s.category] || '💡'

  return (
    <div
      className={clsx(
        'bg-surface border rounded-lg transition-all duration-200 cursor-pointer',
        s.priority === 'high'   && 'border-danger/30',
        s.priority === 'medium' && 'border-warning/20',
        s.priority === 'low'    && 'border-border',
        expanded && 'ring-1 ring-ai/30'
      )}
      onClick={onToggle}
    >
      {/* Header — always visible */}
      <div className="flex items-start gap-3 p-4">
        <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={clsx('font-mono text-xs px-2 py-0.5 rounded border', pri.badge)}>
              {pri.label}
            </span>
            <span className="text-xs text-gray-500 capitalize">{s.category.replace('_', ' ')}</span>
            {s.campaign_name && (
              <span className="text-xs text-gray-600 font-mono">· {s.campaign_name}</span>
            )}
          </div>
          <div className="font-semibold text-white text-sm">{s.title}</div>
          <div className="text-xs text-gray-400 mt-1 line-clamp-2">{s.description}</div>
        </div>
        <div className="text-right flex-shrink-0 ml-2">
          <div className="font-mono text-sm text-profit font-semibold">
            +${s.estimated_weekly_profit_impact.toLocaleString()}/wk
          </div>
          <div className="text-xs text-gray-500 mt-0.5">{s.effort}</div>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-border pt-3 space-y-3">
          <div>
            <div className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-1">Expected Impact</div>
            <div className="text-sm text-gray-300">{s.expected_impact}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-2">Action Steps</div>
            <ol className="space-y-1">
              {s.action_steps.map((step, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-300">
                  <span className="font-mono text-ai flex-shrink-0">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-gray-600">
              Effort: <span className={clsx('font-medium', EFFORT_COLOR[s.effort] || 'text-gray-400')}>{s.effort}</span>
            </span>
            <span className="text-xs text-gray-600 font-mono">{s.suggestion_id}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default function OptimizationSuggestions({ report }) {
  const [expanded, setExpanded] = useState(null)
  const [filter, setFilter]     = useState('all')

  const filters = ['all', 'high', 'medium', 'low']
  const shown   = filter === 'all'
    ? report.suggestions
    : report.suggestions.filter((s) => s.priority === filter)

  return (
    <div className="mb-6">
      {/* Header */}
      <div className="bg-surface border border-border rounded-lg p-5 mb-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-1">
              Ad Optimization Suggestions
            </div>
            <div className="text-white font-semibold">{report.total_suggestions} suggestions found</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-xl font-semibold text-profit">
              +${report.estimated_total_weekly_profit_impact.toLocaleString()}/wk
            </div>
            <div className="text-xs text-gray-500 mt-0.5">total estimated upside</div>
          </div>
        </div>
        <p className="text-sm text-gray-300 border-t border-border pt-3">{report.executive_summary}</p>
      </div>

      {/* Priority filter tabs */}
      <div className="flex gap-2 mb-3">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              'px-3 py-1 rounded text-xs font-mono uppercase tracking-wider transition-colors',
              filter === f
                ? 'bg-ai/20 border border-ai/40 text-ai'
                : 'bg-surface border border-border text-gray-500 hover:text-gray-300'
            )}
          >
            {f === 'all' ? `All (${report.total_suggestions})` : f}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-2">
        {shown.map((s) => (
          <SuggestionCard
            key={s.suggestion_id}
            s={s}
            expanded={expanded === s.suggestion_id}
            onToggle={() => setExpanded(expanded === s.suggestion_id ? null : s.suggestion_id)}
          />
        ))}
      </div>
    </div>
  )
}
