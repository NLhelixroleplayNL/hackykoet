"use client"

import { useSession, signIn } from "next-auth/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AanmeldenPage() {
  const { data: session, status } = useSession()

  const [form, setForm] = useState({
    rpName: "",
    leeftijd: "",
    motivatie: "",
    ervaring: "",
    uren: "",
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<"success" | "error" | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch("/api/aanmelden", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      setResult(res.ok ? "success" : "error")
    } catch {
      setResult("error")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-md bg-muted animate-pulse" /></div>
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-16">

        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-10 bg-primary" />
          <h1 className="font-display text-3xl text-foreground">
            Aanmelden <span className="text-primary">GSF</span>
          </h1>
        </div>
        <p className="text-muted-foreground text-sm mb-10 ml-[52px]">
          Vul het formulier in om je aan te melden bij Grove Street Families. Login eerst met Discord zodat we weten wie je bent.
        </p>

        {!session ? (
          <Card className="text-center p-10">
            <CardContent className="p-0 space-y-4">
              <p className="text-muted-foreground">Je moet inloggen met Discord voordat je een sollicitatie kunt indienen.</p>
              <Button onClick={() => signIn("discord")} className="font-medium">
                Login met Discord
              </Button>
            </CardContent>
          </Card>
        ) : result === "success" ? (
          <Card className="border-primary/30 bg-primary/5 text-center p-10">
            <CardContent className="p-0 space-y-3">
              <p className="text-primary text-2xl font-display">Verstuurd!</p>
              <p className="text-muted-foreground text-sm">
                Je sollicitatie is ontvangen. De leiding zal je binnenkort contacten via Discord.
              </p>
              <p className="text-muted-foreground/50 text-xs">Discord: {session.user.username}</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Sollicitatie als{" "}
                <span className="text-primary font-mono">{session.user.username}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">

                <Field label="RP Naam (ingame naam)" required>
                  <input
                    name="rpName"
                    value={form.rpName}
                    onChange={handleChange}
                    required
                    maxLength={64}
                    placeholder="bv. CJ Johnson"
                    className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
                  />
                </Field>

                <Field label="Leeftijd (echt)" required>
                  <input
                    name="leeftijd"
                    value={form.leeftijd}
                    onChange={handleChange}
                    required
                    type="number"
                    min={13}
                    max={99}
                    placeholder="bv. 18"
                    className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
                  />
                </Field>

                <Field label="Uren per week beschikbaar" required>
                  <input
                    name="uren"
                    value={form.uren}
                    onChange={handleChange}
                    required
                    type="number"
                    min={1}
                    max={168}
                    placeholder="bv. 10"
                    className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
                  />
                </Field>

                <Field label="FiveM / RP ervaring" required>
                  <textarea
                    name="ervaring"
                    value={form.ervaring}
                    onChange={handleChange}
                    required
                    rows={3}
                    maxLength={500}
                    placeholder="Hoelang speel je al FiveM? Welke servers? Eerdere gangs?"
                    className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 resize-none"
                  />
                </Field>

                <Field label="Waarom wil je lid worden van GSF?" required>
                  <textarea
                    name="motivatie"
                    value={form.motivatie}
                    onChange={handleChange}
                    required
                    rows={4}
                    maxLength={800}
                    placeholder="Vertel ons waarom je bij Grove Street Families wilt..."
                    className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 resize-none"
                  />
                </Field>

                {result === "error" && (
                  <p className="text-red-400 text-sm">Er is iets misgegaan. Probeer het opnieuw.</p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full font-medium tracking-wide"
                >
                  {loading ? "Versturen..." : "Stuur Sollicitatie In"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-primary ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}
