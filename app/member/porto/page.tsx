import { Card, CardContent } from "@/components/ui/card"

export const metadata = { title: "Porto — GSF Portaal" }

export default function PortoPage() {
  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-px w-10 bg-primary" />
        <h1 className="font-display text-3xl text-foreground">
          Porto <span className="text-primary">Frequenties</span>
        </h1>
      </div>
      <p className="text-muted-foreground text-sm mb-10 ml-[52px]">
        De porto frequenties zijn altijd random en wisselen regelmatig.
      </p>

      <div className="space-y-3">

        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center text-xl shrink-0">
                📻
              </div>
              <div>
                <p className="font-display text-foreground text-base">Frequentie Bereik</p>
                <p className="text-primary font-mono font-medium text-xl mt-0.5">222.222 — 999.999</p>
                <p className="text-muted-foreground/60 text-xs mt-1">Altijd random, wisselt per sessie</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-md bg-accent border border-border flex items-center justify-center text-xl shrink-0">
                🤖
              </div>
              <div>
                <p className="font-display text-foreground text-sm">Discord Bot Command</p>
                <code className="text-primary font-mono text-lg font-medium mt-1 block">/portoswitch</code>
                <p className="text-muted-foreground/60 text-xs mt-1">Gebruik dit command in Discord om de porto te wisselen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="p-4 rounded-lg border border-yellow-400/20 bg-yellow-400/5">
          <p className="text-yellow-400 text-sm font-medium">
            ⚠️ Gebruik altijd de porto tijdens activiteiten. Zorg dat je op de juiste frequentie zit.
          </p>
        </div>

      </div>
    </div>
  )
}
