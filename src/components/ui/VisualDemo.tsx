import { ReactNode } from "react";
import { CodeBlock } from "./CodeBlock";

interface VisualDemoProps {
  title?: string;
  description?: string;
  code: string;
  language?: string;
  preview: ReactNode;
  /** Stack vertical (default false = lado a lado em telas grandes) */
  stack?: boolean;
  /** Background do painel de preview ("light" | "dark" | "checker") */
  bg?: "light" | "dark" | "checker";
}

const bgs = {
  light: "bg-white text-slate-900",
  dark: "bg-slate-900 text-slate-100",
  checker:
    "bg-white text-slate-900 [background-image:linear-gradient(45deg,#eee_25%,transparent_25%),linear-gradient(-45deg,#eee_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#eee_75%),linear-gradient(-45deg,transparent_75%,#eee_75%)] [background-size:16px_16px] [background-position:0_0,0_8px,8px_-8px,-8px_0]",
};

export function VisualDemo({
  title,
  description,
  code,
  language = "css",
  preview,
  stack = false,
  bg = "light",
}: VisualDemoProps) {
  return (
    <div className="my-6 rounded-xl border border-border overflow-hidden bg-card not-prose">
      {(title || description) && (
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          {title && <h4 className="font-semibold text-sm text-foreground">{title}</h4>}
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
      )}
      <div className={`grid gap-px bg-border ${stack ? "" : "lg:grid-cols-2"}`}>
        <div className="bg-card">
          <div className="px-3 py-2 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold border-b border-border bg-muted/20">
            CSS
          </div>
          <div className="[&>div]:!my-0 [&_pre]:!my-0 [&_pre]:!rounded-none [&_pre]:!border-0">
            <CodeBlock language={language} code={code} />
          </div>
        </div>
        <div className="bg-card">
          <div className="px-3 py-2 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold border-b border-border bg-muted/20">
            Resultado ao vivo
          </div>
          <div className={`p-6 min-h-[140px] ${bgs[bg]}`}>{preview}</div>
        </div>
      </div>
    </div>
  );
}
