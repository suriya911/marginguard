import useMarginStore from '../../store/useMarginStore'

export default function ConstraintInput() {
  const { constraint, setConstraint } = useMarginStore()

  return (
    <div className="mb-4">
      <label className="block text-xs text-gray-500 font-mono uppercase tracking-widest mb-2">
        Brand Constraint
      </label>
      <textarea
        value={constraint}
        onChange={(e) => setConstraint(e.target.value)}
        rows={3}
        className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-gray-200 font-sans placeholder-gray-600 focus:outline-none focus:border-ai resize-none"
        placeholder="e.g. Do not scale campaigns with low inventory…"
      />
    </div>
  )
}
