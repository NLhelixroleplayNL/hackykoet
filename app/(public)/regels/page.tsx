import { Card, CardContent } from "@/components/ui/card"

export const metadata = { title: "Regels — Grove Street Families" }

const RULES = [
  {
    title: "Schelden & Racisme",
    icon: "🚫",
    body: "Het gebruik van ziektes als scheldwoord of het maken van racistische opmerkingen is streng verboden en leidt tot een ban op de main Discord. Ook de intentie om te schelden met hedendaagse ziektes of discriminerende uitingen valt hieronder.",
  },
  {
    title: "Reclame",
    icon: "📢",
    body: "Alle vormen van promotie die niet gerelateerd zijn aan Radov zijn niet toegestaan. Dit geldt voor servers, social media, diensten en andere externe platforms.",
  },
  {
    title: "Gedragsregels",
    icon: "🤝",
    body: "Ongepast gedrag zoals spam, trollen of het opzettelijk uitlokken van discussies is niet toegestaan. Discussies zijn prima, zolang deze respectvol verlopen. Wij willen dat iedereen zich welkom voelt en zichzelf kan zijn. Haatdragende, discriminerende of vrouwonvriendelijke reacties worden daarom niet getolereerd.",
  },
  {
    title: "NSFW",
    icon: "🔞",
    body: "Het versturen of delen van pornografisch of seksueel getint materiaal is absoluut verboden.",
  },
  {
    title: "Externe Software / ToS",
    icon: "⚠️",
    body: "Wij zijn verplicht om de Discord ToS na te leven. Het gebruik van externe software (zoals BetterDiscord) is daarom niet toegestaan. Bij constatering hiervan kan verwijdering uit de server volgen.",
  },
  {
    title: "Regels Omzeilen",
    icon: "🔄",
    body: "Het bewust proberen te omzeilen of verdraaien van regels wordt gezien als een overtreding en zal bestraft worden.",
  },
  {
    title: "Complimenten Kanaal",
    icon: "💬",
    body: "Gebruik het kanaal alleen waarvoor het bedoeld is. Geen complimenten voor jezelf en alleen reageren met emoji's.",
  },
  {
    title: "Disclaimer",
    icon: "📋",
    body: "Het menendez behoudt te allen tijde het recht om regels aan te passen, uit te breiden of te wijzigen wanneer nodig.",
  },
]

export default function RegelsPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-16">

        <div className="flex items-center gap-3 mb-2">
          <div className="h-px w-12 bg-primary" />
          <h1 className="text-4xl font-black text-foreground">
            Grove Street <span className="text-primary">Regels</span>
          </h1>
        </div>
        <p className="text-muted-foreground text-sm mb-12 ml-[60px]">
          Lees de regels goed door. Onwetendheid is geen excuus.
        </p>

        <div className="space-y-4">
          {RULES.map((rule, i) => (
            <Card
              key={i}
              className="group relative hover:border-primary/20 transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-lg">
                    {rule.icon}
                  </div>
                  <div>
                    <h2 className="text-foreground font-bold text-base mb-2">{rule.title}</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">{rule.body}</p>
                  </div>
                </div>
                <span className="absolute top-4 right-4 text-border font-black text-2xl select-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-xl border border-primary/20 bg-primary/5 text-center">
          <p className="text-primary font-bold mb-1">Grove Street 4 Life</p>
          <p className="text-muted-foreground text-sm">
            Door deel te nemen aan de server ga je akkoord met bovenstaande regels.
          </p>
        </div>

      </div>
    </div>
  )
}
