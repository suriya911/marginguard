export default function ArchitecturePage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="font-mono text-xl font-semibold text-white mb-2">Architecture</h2>
      <p className="text-gray-400 text-sm mb-10">Three sequential Gemini 2.0 Flash agents. Each output is the next agent's typed input.</p>

      <div className="space-y-4">
        {[
          { label: 'Agent 1 — Audit', color: 'border-danger', inputs: 'PNG screenshot + Margin JSON + Inventory JSON + Constraint', output: 'ProfitAuditReport', note: 'Multimodal — only agent that reads the screenshot' },
          { label: 'Agent 2 — Reallocation', color: 'border-ai', inputs: 'ProfitAuditReport + Constraint', output: 'BudgetReallocationPlan', note: 'Budget-neutral · CFO language · constraint-aware' },
          { label: 'Agent 3 — Experiment', color: 'border-profit', inputs: 'BudgetReallocationPlan', output: 'ExperimentBrief', note: 'Selects highest profit delta + lowest risk campaign' },
        ].map((a) => (
          <div key={a.label} className={`bg-surface border-l-2 ${a.color} border border-border rounded-lg p-5`}>
            <div className="font-mono font-semibold text-white mb-2">{a.label}</div>
            <div className="text-xs text-gray-400 mb-1"><span className="text-gray-600">IN  </span>{a.inputs}</div>
            <div className="text-xs text-gray-400 mb-2"><span className="text-gray-600">OUT </span>{a.output}</div>
            <div className="text-xs text-gray-600 italic">{a.note}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-surface border border-border rounded-lg p-5">
        <div className="font-mono text-sm text-gray-300 leading-relaxed">
          "MarginGuard uses Gemini's native multimodal reasoning to simultaneously process a visual Google Ads
          dashboard, structured product margin data, real-time inventory signals, and a plain-language brand
          constraint — across a three-agent sequential pipeline — producing typed, Pydantic-validated output
          that no rule-based system, no spreadsheet, and no single-modality model could generate."
        </div>
      </div>
    </main>
  )
}
