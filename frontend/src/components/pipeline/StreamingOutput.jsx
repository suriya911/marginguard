import { useRef, useEffect } from 'react'
import useMarginStore from '../../store/useMarginStore'

export default function StreamingOutput() {
  const chunks = useMarginStore((s) => s.streamingChunks)
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight
  }, [chunks])

  if (!chunks) return null

  return (
    <div
      ref={ref}
      className="mt-4 bg-black/40 border border-border rounded-lg p-4 font-mono text-xs text-gray-400 max-h-40 overflow-y-auto leading-relaxed whitespace-pre-wrap"
    >
      {chunks}
      <span className="animate-pulse text-ai">▌</span>
    </div>
  )
}
