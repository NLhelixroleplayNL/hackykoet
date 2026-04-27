import { Card, CardContent } from "@/components/ui/card"

export const metadata = { title: "Sancties — GSF Portaal" }

const SANCTIES = [
  {
    level: "Warn 1",
    label: "Eerste Waarschuwing",
    color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/5",
    dot: "bg-yellow-400",
    description: "Je ontvangt je eerste officiële waarschuwing. Dit wordt geregistreerd.",
  },
  {
    level: "Warn 2",
    label: "Tweede Waarschuwing",
    color: "text-orange-400 border-orange-400/30 bg-orange-400/5",
    dot: "bg-orange-400",
    description: "Je ontvangt je tweede waarschuwing. Één meer en je bent eruit.",
  },
  {
    level: "Warn 3",
    label: "Ontslag",
    color: "text-red-400 border-red-400/30 bg-red-400/5",
    dot: "bg-red-500",
    description: "Drie warns betekent ontslag uit Grove Street Families. Je verliest je lidmaatschap.",
  },
]

export default function SanctiesPage() {
  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-px w-12 bg-primary" />
        <h1 className="text-4xl font-black text-foreground">
          Gang <span className="text-primary">Sancties</span>
        </h1>
      </div>
      <p className="text-muted-foreground text-sm mb-10 ml-[60px]">
        Overtredingen worden bestraft. Houd je aan de regels.
      </p>

      <div className="relative space-y-4">

        {/* Timeline line */}
        <div className="absolute left-[27px] top-10 bottom-10 w-px bg-border/50" />

        {SANCTIES.map((s, i) => (
          <div key={i} className="relative flex gap-5">
            <div className={`w-3.5 h-3.5 rounded-full mt-5 shrink-0 z-10 ring-4 ring-background ${s.dot}`} />
            <Card className={`flex-1 border ${s.color}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-muted-foreground/60 text-xs font-bold uppercase tracking-widest mb-1">{s.level}</p>
                    <h2 className="text-foreground font-black text-xl">{s.label}</h2>
                    <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{s.description}</p>
                  </div>
                  <span className="text-4xl font-black text-border/40 select-none shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <div className="mt-10 p-5 rounded-xl border border-red-400/20 bg-red-400/5">
        <p className="text-red-400 font-bold text-sm">
          3 warns = automatisch ontslag. Geen uitzonderingen.
        </p>
      </div>
    </div>
  )
}
