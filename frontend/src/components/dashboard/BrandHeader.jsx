export default function BrandHeader() {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="font-mono text-2xl font-semibold text-white tracking-tight">
          GlowNest Beauty
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Google Ads · May 8–14, 2026 · 5 campaigns
        </p>
      </div>
      <div className="text-right">
        <div className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-1">
          Total Daily Budget
        </div>
        <div className="font-mono text-2xl font-semibold text-white">$1,145</div>
      </div>
    </div>
  )
}
