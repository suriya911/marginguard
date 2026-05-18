export default function ExperimentCard({ experiment }) {
  return (
    <div className="bg-surface border border-ai/30 rounded-lg p-5 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-1">A/B Experiment</div>
          <div className="font-semibold text-white">{experiment.product_name}</div>
        </div>
        <span className="font-mono text-xs px-3 py-1 bg-ai/10 border border-ai/30 text-ai rounded">
          {experiment.recommended_duration_days}d test
        </span>
      </div>

      <div className="bg-navy/60 border border-border rounded p-3 mb-4">
        <div className="text-xs text-gray-500 font-mono mb-1">Hypothesis</div>
        <p className="text-sm text-gray-200 italic">"{experiment.hypothesis}"</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-navy/40 rounded p-3">
          <div className="text-xs text-gray-500 font-mono mb-1">Control</div>
          <p className="text-xs text-gray-300">{experiment.control_description}</p>
        </div>
        <div className="bg-ai/5 border border-ai/20 rounded p-3">
          <div className="text-xs text-ai font-mono mb-1">Variant</div>
          <p className="text-xs text-gray-300">{experiment.variant_description}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center border-t border-border pt-3">
        <div>
          <div className="text-xs text-gray-500 mb-1">Primary Metric</div>
          <div className="text-xs text-white font-medium">{experiment.primary_success_metric}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Min. Detectable Effect</div>
          <div className="text-xs text-ai font-mono font-semibold">{experiment.minimum_detectable_effect}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Est. Weekly Upside</div>
          <div className="text-xs text-profit font-mono font-semibold">+${experiment.estimated_weekly_profit_impact_if_successful.toLocaleString()}</div>
        </div>
      </div>
    </div>
  )
}
