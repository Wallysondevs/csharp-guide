/**
 * Diagramas pedagógicos renderizados com CSS puro.
 * Tudo escala bem, respeita dark mode e não depende de imagens externas.
 */

export function BoxModelDiagram() {
  return (
    <div className="my-6 not-prose flex justify-center">
      <div className="relative max-w-md w-full bg-amber-100 border-2 border-dashed border-amber-400 rounded p-6 text-slate-900">
        <span className="absolute top-1 left-2 text-xs font-bold text-amber-700">margin</span>
        <div className="bg-orange-200 border-4 border-orange-500 p-6 relative">
          <span className="absolute top-1 left-2 text-xs font-bold text-orange-800">border</span>
          <div className="bg-yellow-200 p-6 border-2 border-dotted border-yellow-600 relative">
            <span className="absolute top-1 left-2 text-xs font-bold text-yellow-800">padding</span>
            <div className="bg-sky-300 border border-sky-700 py-6 text-center font-bold">
              content
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FlexAxesDiagram() {
  return (
    <div className="my-6 not-prose grid md:grid-cols-2 gap-4">
      <figure className="bg-white border border-border rounded-xl p-5 text-slate-900">
        <figcaption className="text-xs font-semibold text-slate-700 mb-3 text-center">
          flex-direction: row (padrão)
        </figcaption>
        <div className="relative bg-slate-50 border border-slate-200 rounded p-3 flex gap-2 mb-2">
          <div className="bg-blue-500 text-white px-3 py-2 rounded text-sm">1</div>
          <div className="bg-blue-500 text-white px-3 py-2 rounded text-sm">2</div>
          <div className="bg-blue-500 text-white px-3 py-2 rounded text-sm">3</div>
        </div>
        <div className="text-xs text-center">
          <div className="text-blue-600 font-bold">→ main axis (horizontal)</div>
          <div className="text-emerald-600 font-bold">↓ cross axis (vertical)</div>
        </div>
      </figure>
      <figure className="bg-white border border-border rounded-xl p-5 text-slate-900">
        <figcaption className="text-xs font-semibold text-slate-700 mb-3 text-center">
          flex-direction: column
        </figcaption>
        <div className="bg-slate-50 border border-slate-200 rounded p-3 flex flex-col gap-2 mb-2 w-fit mx-auto">
          <div className="bg-purple-500 text-white px-3 py-2 rounded text-sm">1</div>
          <div className="bg-purple-500 text-white px-3 py-2 rounded text-sm">2</div>
          <div className="bg-purple-500 text-white px-3 py-2 rounded text-sm">3</div>
        </div>
        <div className="text-xs text-center">
          <div className="text-purple-600 font-bold">↓ main axis (vertical)</div>
          <div className="text-emerald-600 font-bold">→ cross axis (horizontal)</div>
        </div>
      </figure>
    </div>
  );
}

export function GridLinesDiagram() {
  return (
    <div className="my-6 not-prose flex justify-center">
      <div className="bg-white border border-border rounded-xl p-6 text-slate-900">
        <div className="grid grid-cols-3 grid-rows-3 gap-2 w-[300px] h-[200px] relative">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <div
              key={n}
              className="bg-indigo-100 border border-indigo-400 flex items-center justify-center text-xs font-mono text-indigo-700"
            >
              cell {n}
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-center text-slate-600 font-mono">
          grid-template-columns: 1fr 1fr 1fr · grid-template-rows: repeat(3, 1fr)
        </div>
      </div>
    </div>
  );
}

export function SpecificityBadge({ a = 0, b = 0, c = 0 }: { a?: number; b?: number; c?: number }) {
  return (
    <span className="inline-flex items-center gap-1 font-mono text-xs px-2 py-0.5 rounded-md bg-muted border border-border">
      <span className="text-red-400 font-bold">{a}</span>
      <span className="opacity-30">,</span>
      <span className="text-yellow-400 font-bold">{b}</span>
      <span className="opacity-30">,</span>
      <span className="text-blue-400 font-bold">{c}</span>
    </span>
  );
}

export function PositionDiagram() {
  return (
    <div className="my-6 not-prose grid md:grid-cols-3 gap-3">
      {[
        { label: "static", desc: "no fluxo, ignora top/left", color: "bg-slate-200" },
        { label: "relative", desc: "no fluxo + deslocável", color: "bg-blue-200" },
        { label: "absolute", desc: "fora do fluxo, ancorado", color: "bg-orange-200" },
        { label: "fixed", desc: "preso ao viewport", color: "bg-purple-200" },
        { label: "sticky", desc: "gruda ao rolar", color: "bg-emerald-200" },
      ].map((p) => (
        <div
          key={p.label}
          className={`${p.color} text-slate-900 rounded-xl p-4 border border-slate-300`}
        >
          <div className="font-mono font-bold text-sm">{p.label}</div>
          <div className="text-xs mt-1 opacity-80">{p.desc}</div>
        </div>
      ))}
    </div>
  );
}
