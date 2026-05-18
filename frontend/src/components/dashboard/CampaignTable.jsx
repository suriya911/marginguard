import useMarginStore from '../../store/useMarginStore'
import { GLOWNEST_CAMPAIGNS_ROAS, GLOWNEST_CAMPAIGNS_TRUTH } from '../../constants/glownest'
import CampaignRow from './CampaignRow'

export default function CampaignTable() {
  const truthLayerActive = useMarginStore((s) => s.truthLayerActive)

  // Beat 2 always reads from constants — never from API
  const campaigns = truthLayerActive ? GLOWNEST_CAMPAIGNS_TRUTH : GLOWNEST_CAMPAIGNS_ROAS

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden mb-6">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <span className="text-xs text-gray-500 font-mono uppercase tracking-widest">
          Campaigns · 5 active
        </span>
        {truthLayerActive && (
          <span className="text-xs font-mono text-danger animate-pulse">
            ◉ PROFIT TRUTH LAYER ACTIVE
          </span>
        )}
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-2 text-xs text-gray-500 font-mono uppercase tracking-wider">Campaign</th>
            <th className="px-4 py-2 text-xs text-gray-500 font-mono uppercase tracking-wider">Spend</th>
            <th className="px-4 py-2 text-xs text-gray-500 font-mono uppercase tracking-wider">Reported ROAS</th>
            <th className="px-4 py-2 text-xs text-gray-500 font-mono uppercase tracking-wider">
              True Profit ROAS
              {!truthLayerActive && <span className="ml-1 text-gray-700">(hidden)</span>}
            </th>
            <th className="px-4 py-2 text-xs text-gray-500 font-mono uppercase tracking-wider">Status</th>
            <th className="px-4 py-2 text-xs text-gray-500 font-mono uppercase tracking-wider">Inventory</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => (
            <CampaignRow key={c.campaign_id} campaign={c} truthActive={truthLayerActive} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
