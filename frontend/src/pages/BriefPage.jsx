import useMarginStore from '../store/useMarginStore'
import OptimizationSuggestions from '../components/brief/OptimizationSuggestions'

function SectionHeader({ label }) {
  return (
    <div className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-3 border-b border-border pb-2">
      {label}
    </div>
  )
}

function StatCard({ label, value, sub, highlight }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <div className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-1">{label}</div>
      <div className={`font-mono text-xl font-semibold ${highlight || 'text-white'}`}>{value}</div>
      {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
    </div>
  )
}

function AuditSection({ audit }) {
  return (
    <div className="mb-8">
      <SectionHeader label="① Audit — Profit Truth" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <StatCard label="Campaigns" value={audit.total_campaigns_analyzed} sub="analyzed" />
        <StatCard label="Unprofitable" value={audit.campaigns_unprofitable} highlight="text-danger" sub="true ROAS < 1" />
        <StatCard label="At Risk" value={audit.campaigns_at_risk} highlight="text-warning" sub="needs attention" />
        <StatCard
          label="Daily Waste"
          value={`$${Math.round(audit.total_wasted_daily_spend).toLocaleString()}`}
          highlight="text-danger"
          sub="unprofitable spend"
        />
      </div>

      <div className="space-y-2">
        {audit.campaign_truths.map((c) => (
          <div key={c.campaign_id} className="bg-surface border border-border rounded-lg p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white text-sm">{c.product_name}</div>
              <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{c.narrative}</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs text-gray-500">Reported</div>
              <div className="font-mono text-sm text-gray-300">{c.reported_roas.toFixed(1)}x</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs text-gray-500">True</div>
              <div className={`font-mono text-sm font-semibold ${c.true_profit_roas < 1 ? 'text-danger' : c.true_profit_roas < 2 ? 'text-warning' : 'text-profit'}`}>
                {c.true_profit_roas.toFixed(2)}x
              </div>
            </div>
            {c.anomaly_flags?.length > 0 && (
              <div className="flex gap-1 flex-shrink-0">
                {c.anomaly_flags.map((f) => (
                  <span key={f} className="text-xs bg-warning/10 border border-warning/30 text-warning px-1.5 py-0.5 rounded font-mono uppercase">
                    {f.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ReallocationSection({ plan }) {
  return (
    <div className="mb-8">
      <SectionHeader label="② Reallocation — Budget Plan" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <StatCard
          label="Projected Weekly Uplift"
          value={`+$${Math.round(plan.projected_weekly_profit_delta).toLocaleString()}`}
          highlight="text-profit"
          sub="profit delta"
        />
        <StatCard label="Budget Neutral" value={plan.budget_neutral_verified ? '✓ Verified' : '✗ Mismatch'} highlight={plan.budget_neutral_verified ? 'text-profit' : 'text-danger'} />
        <StatCard label="Risk Level" value={plan.risk_level} highlight="text-warning" />
      </div>

      <div className="space-y-2">
        {plan.moves.map((m, i) => (
          <div key={i} className="bg-surface border border-border rounded-lg p-4 flex items-center gap-4">
            <div className={`font-mono text-lg font-bold flex-shrink-0 ${m.delta_daily_spend > 0 ? 'text-profit' : 'text-danger'}`}>
              {m.delta_daily_spend > 0 ? '+' : ''}{Math.round(m.delta_daily_spend)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white text-sm">{m.product_name}</div>
              <div className="text-xs text-gray-500 mt-0.5">{m.rationale}</div>
            </div>
            <div className="text-right flex-shrink-0 text-xs text-gray-500">
              <div>${Math.round(m.current_daily_spend)} → ${Math.round(m.new_daily_spend)}/day</div>
            </div>
          </div>
        ))}
      </div>

      {plan.cfo_narrative && (
        <div className="mt-3 bg-surface border border-border rounded-lg p-4">
          <div className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-1">CFO Narrative</div>
          <p className="text-sm text-gray-300">{plan.cfo_narrative}</p>
        </div>
      )}
    </div>
  )
}

function ExperimentSection({ exp }) {
  return (
    <div className="mb-8">
      <SectionHeader label="③ Experiment — A/B Brief" />
      <div className="bg-surface border border-border rounded-lg p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="font-semibold text-white">{exp.product_name}</div>
            <div className="text-xs text-gray-500 mt-0.5 font-mono">{exp.experiment_id}</div>
          </div>
          <div className="text-right text-xs text-gray-500">
            <div>{exp.duration_days} days · {exp.traffic_split_pct}% traffic</div>
          </div>
        </div>
        <div className="bg-ai/5 border border-ai/20 rounded p-3 mb-3">
          <div className="text-xs text-ai font-mono uppercase tracking-wider mb-1">Hypothesis</div>
          <div className="text-sm text-gray-200">{exp.hypothesis}</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-1">Control</div>
            <div className="text-sm text-gray-300">{exp.control_description}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-1">Variant</div>
            <div className="text-sm text-gray-300">{exp.variant_description}</div>
          </div>
        </div>
        {exp.success_metric && (
          <div className="mt-3 text-xs text-gray-500">
            Success metric: <span className="text-gray-300 font-mono">{exp.success_metric}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function BriefPage() {
  const brief        = useMarginStore((s) => s.brief)
  const audit        = useMarginStore((s) => s.auditReport)
  const reallocation = useMarginStore((s) => s.reallocationPlan)
  const experiment   = useMarginStore((s) => s.experimentBrief)
  const optimization = useMarginStore((s) => s.optimizationReport)
  const resetPipeline = useMarginStore((s) => s.resetPipeline)

  if (!brief) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 font-mono text-sm">
        No brief available — run the pipeline first.
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-1">MarginGuard Brief</div>
          <h1 className="text-2xl font-bold text-white">GlowNest Beauty</h1>
          <div className="text-xs text-gray-500 mt-1 font-mono">
            Pipeline completed in {brief.pipeline_duration_seconds}s
          </div>
        </div>
        <button
          onClick={resetPipeline}
          className="px-4 py-2 rounded-lg border border-border text-gray-400 hover:text-white hover:border-gray-500 text-xs font-mono transition-colors"
        >
          ← New Run
        </button>
      </div>

      {/* Sections */}
      {audit        && <AuditSection audit={audit} />}
      {reallocation && <ReallocationSection plan={reallocation} />}
      {experiment   && <ExperimentSection exp={experiment} />}
      {optimization && <OptimizationSuggestions report={optimization} />}
    </div>
  )
}
