
import {SiteLayout } from "@/components/SiteLayout";
import { useI18n } from "@/lib/i18n";

export type NormativeProps = {
    rules : Record<string, string[]>;
}

function Normative({rules} : NormativeProps) {


   return (
    <>
      <SiteLayout>
        <div className="space-y-6">
          {Object.entries(rules).map(([title, items,], i) => (
            <div key={i} className="grid gap-4 rounded-xl border border-border bg-card p-8 md:grid-cols-[200px_1fr]">
              <div>
                <span className="font-display text-sm font-bold text-primary">0{i + 1}</span>
                <h2 className="font-display text-xl font-bold">{title}</h2>
              </div>
              <div className="space-y-3 text-muted-foreground">
                {items.map((p) => <p key={p}>{p}</p>)}
              </div>
            </div>
          ))}
        </div>
      </SiteLayout>
      
    </>
  );
}
