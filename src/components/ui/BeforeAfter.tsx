import { ReactNode } from "react";

interface BeforeAfterProps {
  beforeLabel?: string;
  afterLabel?: string;
  before: ReactNode;
  after: ReactNode;
  caption?: string;
}

export function BeforeAfter({
  beforeLabel = "❌ Antes",
  afterLabel = "✅ Depois",
  before,
  after,
  caption,
}: BeforeAfterProps) {
  return (
    <figure className="my-6 not-prose">
      <div className="grid md:grid-cols-2 gap-3">
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 overflow-hidden">
          <div className="px-3 py-2 text-xs font-semibold text-red-400 border-b border-red-500/20 bg-red-500/10">
            {beforeLabel}
          </div>
          <div className="p-6 bg-white text-slate-900 min-h-[120px]">{before}</div>
        </div>
        <div className="rounded-xl border border-green-500/30 bg-green-500/5 overflow-hidden">
          <div className="px-3 py-2 text-xs font-semibold text-green-400 border-b border-green-500/20 bg-green-500/10">
            {afterLabel}
          </div>
          <div className="p-6 bg-white text-slate-900 min-h-[120px]">{after}</div>
        </div>
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
