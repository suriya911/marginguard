import useMarginStore from '../../store/useMarginStore'
import clsx from 'clsx'

const INPUT_CHIPS = [
  { label: 'Screenshot',   color: 'text-ai   border-ai/30   bg-ai/10'   },
  { label: 'Margin Data',  color: 'text-profit border-profit/30 bg-profit/10' },
  { label: 'Inventory',    color: 'text-warning border-warning/30 bg-warning/10' },
  { label: 'Constraint',   color: 'text-gray-300 border-border bg-surface' },
]

export default function AgentRunnerPanel() {
  const { pipelineStatus, runPipeline, resetPipeline } = useMarginStore()

  const isIdle     = pipelineStatus === 'idle'
  const isRunning  = pipelineStatus === 'running'
  const isComplete = pipelineStatus === 'complete'
  const isError    = pipelineStatus === 'error'

  return (
    <div className="space-y-4">
      {/* Input chips */}
      <div className="flex flex-wrap gap-2">
        {INPUT_CHIPS.map(({ label, color }) => (
          <span
            key={label}
            className={clsx('font-mono text-xs px-3 py-1.5 rounded border', color)}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Run button */}
      {(isIdle || isError) && (
        <button
          onClick={runPipeline}
          className="w-full py-3 px-6 rounded-lg font-mono font-semibold text-sm tracking-wider uppercase bg-ai/20 border border-ai text-ai hover:bg-ai/30 transition-all"
        >
          {isError ? '⚠ Retry Gemini Pipeline' : '▶ Run Gemini Agent Pipeline'}
        </button>
      )}

      {isRunning && (
        <button
          disabled
          className="w-full py-3 px-6 rounded-lg font-mono font-semibold text-sm tracking-wider uppercase bg-ai/10 border border-ai/40 text-ai/60 cursor-not-allowed"
        >
          <span className="animate-pulse">● Gemini pipeline running…</span>
        </button>
      )}

      {isComplete && (
        <button
          onClick={resetPipeline}
          className="w-full py-3 px-6 rounded-lg font-mono font-semibold text-sm tracking-wider uppercase bg-surface border border-border text-gray-400 hover:border-ai hover:text-ai transition-all"
        >
          ↺ Run Again
        </button>
      )}
    </div>
  )
}
