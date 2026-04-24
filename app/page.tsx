import Image from "next/image"
import Link from "next/link"
import SignInButton from "@/components/SignInButton"

const INFO_CARDS = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Loyaliteit",
    description:
      "Grove Street Families staan voor loyaliteit boven alles. Eén voor allen, allen voor één. Eens GSF, altijd GSF.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      </svg>
    ),
    title: "Territorium",
    description:
      "Wij domineren Los Santos van Ganton tot Idlewood. Grove Street is ons thuis en wij verdedigen het met alles wat we hebben.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Respect",
    description:
      "Respect wordt verdiend, niet gegeven. Bewijs je waarde aan de familia en stijg op in de rangen van Grove Street.",
  },
]

export default function HomePage() {
  return (
    <div className="bg-black min-h-screen">
      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-20 animate-fade-in">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left: Text */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-green-500" />
              <span className="text-green-400 text-xs font-bold tracking-[0.35em] uppercase">
                Los Santos, San Andreas
              </span>
            </div>

            <h1 className="text-8xl sm:text-9xl font-black text-green-400 tracking-tighter leading-none mb-4"
              style={{ textShadow: "0 0 60px rgba(34,197,94,0.35)" }}>
              GSF
            </h1>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 leading-snug">
              Grove Street<br />
              <span className="text-green-400">Families</span>
            </h2>

            <p className="text-gray-400 text-base leading-relaxed mb-10 max-w-md">
              Wij zijn de Grove Street Families — de sterkste en meest loyale crew
              van Los Santos. Groen vloeit door onze aderen. Grove Street is voor altijd.
            </p>

            <div className="flex flex-wrap gap-4">
              <SignInButton size="lg" />
              <Link
                href="/leden"
                className="inline-flex items-center gap-2 border border-green-500/60 text-green-400
                           hover:bg-green-500/10 hover:border-green-500 font-semibold px-6 py-3
                           rounded-lg transition-all duration-200 active:scale-95 text-base"
              >
                Bekijk Leden
              </Link>
            </div>
          </div>

          {/* Right: Logo */}
          <div className="flex-shrink-0">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80"
              style={{ filter: "drop-shadow(0 0 40px rgba(34,197,94,0.35))" }}>
              <Image
                src="/logo.png"
                alt="Grove Street Families Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="border-t border-green-500/10" />
      </div>

      {/* ── Info Section ── */}
      <section id="info" className="max-w-6xl mx-auto px-4 py-20 animate-slide-up">
        <div className="flex items-center gap-3 mb-12">
          <div className="h-px w-12 bg-green-500" />
          <h2 className="text-3xl font-black text-white tracking-tight">
            Over <span className="text-green-400">GSF</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INFO_CARDS.map((card) => (
            <div key={card.title} className="gsf-card hover:border-green-500/25 transition-colors">
              <div className="text-green-400 mb-4">{card.icon}</div>
              <h3 className="font-bold text-white text-lg mb-2">{card.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-green-500/10 py-8">
        <p className="text-center text-gray-600 text-sm tracking-wider">
          © Grove Street Families — <span className="text-green-500/60">Grove Street 4 Life</span>
        </p>
      </footer>
    </div>
  )
}
