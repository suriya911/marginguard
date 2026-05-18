export default function AuditSummary({ audit }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-5 mb-4">
      <div className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-4">Audit Summary</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {[
          { label: 'Reported ROAS',    value: `${audit.total_reported_roas.toFixed(2)}x`, color: 'text-profit' },
          { label: 'True Profit ROAS', value: `${audit.total_true_profit_roas.toFixed(2)}x`, color: audit.total_true_profit_roas < 2 ? 'text-danger' : 'text-warning' },
          { label: 'Unprofitable',     value: audit.campaigns_unprofitable, color: 'text-danger' },
          { label: 'At Risk',          value: audit.campaigns_at_risk,      color: 'text-warning' },
        ].map(({ label, value, color }) => (
          <div key={label} className="text-center">
            <div className="text-xs text-gray-500 mb-1">{label}</div>
            <div className={`font-mono text-2xl font-semibold ${color}`}>{value}</div>
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-300 border-t border-border pt-3">{audit.top_anomaly_summary}</p>
    </div>
  )
}
