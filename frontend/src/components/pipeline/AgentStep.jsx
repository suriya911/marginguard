import clsx from 'clsx'

const STATUS_CONFIG = {
  waiting:  { dot: 'bg-gray-600',  label: 'Waiting',           pulse: false },
  running:  { dot: 'bg-ai',        label: 'Gemini reasoning…', pulse: true  },
  complete: { dot: 'bg-profit',    label: 'Complete',          pulse: false },
  error:    { dot: 'bg-danger',    label: 'Error',             pulse: false },
}

const AGENT_META = {
  audit:        { num: '①', label: 'Audit Agent',        desc: 'Screenshot + margin data → profit truth' },
  reallocation: { num: '②', label: 'Reallocation Agent', desc: 'Audit report → budget reallocation plan' },
  experiment:   { num: '③', label: 'Experiment Agent',   desc: 'Budget plan → A/B experiment brief'      },
  optimization: { num: '④', label: 'Optimization Agent', desc: 'Full brief → ranked ad improvement tips' },
}

export default function AgentStep({ agent, status, timing, stat }) {
  const cfg  = STATUS_CONFIG[status] || STATUS_CONFIG.waiting
  const meta = AGENT_META[agent]     || { num: '?', label: agent, desc: '' }

  return (
    <div className={clsx(
      'flex items-center gap-4 p-4 rounded-lg border transition-colors duration-300',
      status === 'running'  && 'border-ai/40 bg-ai/5',
      status === 'complete' && 'border-profit/30 bg-profit/5',
      status === 'error'    && 'border-danger/30 bg-danger/5',
      status === 'waiting'  && 'border-border bg-surface',
    )}>
      <div className={clsx('w-2.5 h-2.5 rounded-full flex-shrink-0', cfg.dot, cfg.pulse && 'animate-pulse')} />
      <div className="flex-1 min-w-0">
        <div className="font-mono text-sm font-semibold text-white">{meta.num} {meta.label}</div>
        <div className="text-xs text-gray-500 mt-0.5">{meta.desc}</div>
      </div>
      <div className="text-right flex-shrink-0">
        {status === 'running'  && <span className="text-xs text-ai font-mono animate-pulse">{cfg.label}</span>}
        {status === 'complete' && timing && (
          <div>
            <span className="text-xs text-profit font-mono">✓ {timing}s</span>
            {stat && <div className="text-xs text-gray-400 mt-0.5">{stat}</div>}
          </div>
        )}
        {status === 'waiting'  && <span className="text-xs text-gray-600 font-mono">{cfg.label}</span>}
        {status === 'error'    && <span className="text-xs text-danger font-mono">Failed</span>}
      </div>
    </div>
  )
}
