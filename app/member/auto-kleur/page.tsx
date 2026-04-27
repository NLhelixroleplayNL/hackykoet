import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = { title: "Auto Kleur — GSF Portaal" }

const AUTO_IMG = "https://cdn.discordapp.com/attachments/1478807776179388623/1497736981281771700/image.png?ex=69f09602&is=69ef4482&hm=d31eb17db0648ec549d4c872ed02382bd18f6c19effccd482a1aac6751fb4db6&"

export default function AutoKleurPage() {
  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-px w-12 bg-primary" />
        <h1 className="text-4xl font-black text-foreground">
          Auto <span className="text-primary">Kleur</span>
        </h1>
      </div>
      <p className="text-muted-foreground text-sm mb-10 ml-[60px]">
        Verplichte gang kleur voor voertuigen van Grove Street Families leden.
      </p>

      <div className="space-y-4">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <Image
              src={AUTO_IMG}
              alt="Gang Auto Kleur"
              width={1200}
              height={800}
              className="w-full h-auto"
              unoptimized
            />
          </CardContent>
        </Card>

        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
          <p className="text-primary font-semibold text-sm">
            🚗 Gebruik altijd de bovenstaande kleur op je gangauto. Afwijkingen worden niet getolereerd.
          </p>
        </div>
      </div>
    </div>
  )
}
