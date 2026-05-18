import { useNavigate } from 'react-router-dom'
import useMarginStore from '../store/useMarginStore'
import AuditSummary from '../components/brief/AuditSummary'
import CampaignTruthCard from '../components/brief/CampaignTruthCard'
import BudgetDeltaTable from '../components/brief/BudgetDeltaTable'
import ExperimentCard from '../components/brief/ExperimentCard'
import ExecutiveSummary from '../components/brief/ExecutiveSummary'

export default function BriefPage() {
  const navigate = useNavigate()
  const brief    = useMarginStore((s) => s.brief)

  if (!brief) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <p className="text-gray-500 font-mono text-sm mb-4">No brief yet — run the pipeline first.</p>
        <button onClick={() => navigate('/')} className="text-ai text-sm font-mono hover:underline">
          ← Back to Dashboard
        </button>
      </div>
    )
  }

  const { audit, reallocation, experiment, agent_timings } = brief

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-mono text-xl font-semibold text-white">MarginGuard Brief</h2>
          <p className="text-gray-500 text-xs mt-1">
            Pipeline ran in {brief.pipeline_duration_seconds}s · {new Date().toLocaleDateString()}
          </p>
        </div>
        <button onClick={() => navigate('/')} className="text-gray-400 text-sm font-mono hover:text-white">
          ← Dashboard
        </button>
      </div>

      <ExecutiveSummary plan={reallocation} timings={agent_timings} />
      <AuditSummary audit={audit} />

      <div className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-3">Campaign Truth</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {audit.campaign_truths.map((t) => (
          <CampaignTruthCard key={t.campaign_id} truth={t} />
        ))}
      </div>

      <BudgetDeltaTable plan={reallocation} />
      <ExperimentCard experiment={experiment} />
    </main>
  )
}
