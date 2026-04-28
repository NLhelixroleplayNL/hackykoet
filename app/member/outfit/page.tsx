import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = { title: "Outfit — GSF Portaal" }

const OUTFIT_IMG = "https://cdn.discordapp.com/attachments/1478807758286487708/1497736344779227198/image.png?ex=69f0956b&is=69ef43eb&hm=9e8571d2e7d2b33a5df823ff6326e0a5b582e0b6c66465bb7d25b7d52005a28c&"
const OUTFIT_CODE = "5BmyGHnD76"

export default function OutfitPage() {
  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-px w-10 bg-primary" />
        <h1 className="font-display text-3xl text-foreground">
          Gang <span className="text-primary">Outfit</span>
        </h1>
      </div>
      <p className="text-muted-foreground text-sm mb-10 ml-[52px]">
        De verplichte outfit voor alle leden van Grove Street Families.
      </p>

      <div className="space-y-4">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Outfit Code</p>
              <p className="text-primary font-display text-2xl tracking-wider font-mono">{OUTFIT_CODE}</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground text-sm">Voer deze code in bij de kleermaker</p>
              <p className="text-xs text-muted-foreground/50 mt-1">Verplicht voor alle leden</p>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <Image
              src={OUTFIT_IMG}
              alt="Gang Outfit"
              width={1200}
              height={800}
              className="w-full h-auto"
              unoptimized
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
