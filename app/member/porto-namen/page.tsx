import { Card, CardContent } from "@/components/ui/card"

export const metadata = { title: "Porto Namen — GSF Portaal" }

export default function PortoNamenPage() {
  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-px w-10 bg-primary" />
        <h1 className="font-display text-3xl text-foreground">
          Porto <span className="text-primary">Namen</span>
        </h1>
      </div>
      <p className="text-muted-foreground text-sm mb-10 ml-[52px]">
        Grove Street Families porto naamgeving. Verplicht voor alle leden.
      </p>

      <div className="space-y-3">

        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-5">
            <p className="text-[11px] text-muted-foreground/60 uppercase tracking-wider font-medium mb-3">Verplicht Format</p>
            <div className="flex items-center gap-3">
              <code className="text-primary font-display text-2xl font-mono tracking-wide">GSF | [Naam]</code>
            </div>
            <p className="text-muted-foreground/60 text-xs mt-3">
              Let op de spaties — voor EN na het | teken
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-5">
              <p className="text-primary text-[11px] font-medium uppercase tracking-wider mb-3">✅ Goed</p>
              <div className="space-y-2">
                <code className="block text-foreground font-mono font-medium text-lg">GSF | Hacky</code>
                <code className="block text-foreground/60 font-mono text-base">GSF | Naam</code>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-400/20 bg-red-400/5">
            <CardContent className="p-5">
              <p className="text-red-400 text-[11px] font-medium uppercase tracking-wider mb-3">❌ Fout</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <code className="text-foreground/40 font-mono font-medium text-lg line-through">GSF Hacky</code>
                  <span className="text-red-400/60 text-xs">geen |</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-foreground/40 font-mono text-base line-through">GSFHacky</code>
                  <span className="text-red-400/60 text-xs">alles aan elkaar</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-foreground/40 font-mono text-base line-through">Hacky GSF</code>
                  <span className="text-red-400/60 text-xs">verkeerde volgorde</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-red-400/20">
          <CardContent className="p-5 flex items-start gap-4">
            <div className="w-9 h-9 rounded-md bg-red-400/10 border border-red-400/20 flex items-center justify-center text-lg shrink-0">
              ⚠️
            </div>
            <div>
              <p className="font-display text-foreground text-sm mb-1">Geen porto naam = Waarschuwing</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Heb je de verkeerde naam of geen naam op porto — dan ontvang je direct een <span className="text-red-400 font-medium">warn</span>.
                Zet je naam goed en duidelijk leesbaar.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="p-5 rounded-lg border border-border/40 bg-card">
          <p className="text-muted-foreground text-sm leading-relaxed italic">
            &ldquo;Gwn lett je naam duidelijk&rdquo;
          </p>
          <p className="text-primary/60 text-xs mt-2 font-medium">— Leiding Grove Street Families</p>
        </div>

      </div>
    </div>
  )
}
