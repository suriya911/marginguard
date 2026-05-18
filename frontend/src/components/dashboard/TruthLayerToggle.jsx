import useMarginStore from '../../store/useMarginStore'
import clsx from 'clsx'

export default function TruthLayerToggle() {
  const { truthLayerActive, toggleTruthLayer } = useMarginStore()

  return (
    <button
      onClick={toggleTruthLayer}
      className={clsx(
        'w-full py-3 px-6 rounded-lg font-mono font-semibold text-sm tracking-wider uppercase transition-all duration-400 border',
        truthLayerActive
          ? 'bg-danger/20 border-danger text-danger hover:bg-danger/30'
          : 'bg-surface border-border text-gray-300 hover:border-danger hover:text-danger'
      )}
    >
      {truthLayerActive
        ? '◉ PROFIT TRUTH LAYER ACTIVE — CLICK TO DEACTIVATE'
        : '○ ACTIVATE PROFIT TRUTH LAYER'}
    </button>
  )
}
