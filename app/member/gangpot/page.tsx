import { getGangpotItems } from "@/lib/queries"
import { Card, CardContent } from "@/components/ui/card"

export const revalidate = 30
export const metadata = { title: "Gang Pot — GSF Portaal" }

export default async function MemberGangpotPage() {
  const items = await getGangpotItems()

  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px w-10 bg-primary" />
        <h1 className="font-display text-3xl text-foreground">
          Gang <span className="text-primary">Pot</span>
        </h1>
      </div>
      <p className="text-muted-foreground text-sm mb-2 ml-[52px]">
        Alle items in de gang pot. Wordt uitgedeeld op promotiedag.
      </p>
      <p className="text-primary/60 text-xs mb-10 ml-[52px]">
        {items.length} verschillende items
      </p>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">📦</p>
          <p className="text-muted-foreground">De gang pot is leeg.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((item) => (
            <Card key={item.id as number} className="flex items-center justify-between p-4 hover:border-primary/20 transition-colors">
              <CardContent className="p-0 flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-primary text-base">📦</span>
                  </div>
                  <div>
                    <p className="text-foreground font-medium text-sm capitalize">
                      {(item.item_name as string).replace(/_/g, " ")}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Bijgewerkt {new Date(item.updated_at as Date).toLocaleDateString("nl-NL")}
                    </p>
                  </div>
                </div>
                <p className="text-primary font-display text-xl ml-4">×{item.amount as number}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
