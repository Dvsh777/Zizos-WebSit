
import { HttpTypes } from "@medusajs/types"
import { VERTICALS } from "@lib/util/verticals"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getVerticalHref } from "@modules/home/components/featured-categories"

const TILES = [
  {
    placement: "small:row-span-2",
    number: "01",
    size: "text-[clamp(2.75rem,5.5vw,5.75rem)]",
    decoration: "rounded-full",
  },
  {
    placement: "small:col-span-2",
    number: "02",
    size: "text-[clamp(2.5rem,4.5vw,4.5rem)]",
    decoration: "rotate-45",
  },
  {
    placement: "",
    number: "03",
    size: "text-[clamp(1.8rem,2.5vw,2.6rem)]",
    decoration: "rotate-12",
  },
  {
    placement: "",
    number: "04",
    size: "text-[clamp(1.8rem,2.5vw,2.6rem)]",
    decoration: "rounded-sm",
  },
]

const Hero = ({
  categories,
}: {
  categories: HttpTypes.StoreProductCategory[]
}) => {
  return (
    <section
      aria-labelledby="hero-heading"
      data-testid="home-hero"
      className="relative isolate w-full overflow-hidden bg-[#080809] text-white"
    >
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-48 left-[15%] h-[600px] w-[600px] rounded-full bg-white/[0.035] blur-[160px]" />
        <div className="absolute right-[-15%] top-[35%] h-[500px] w-[500px] rounded-full bg-zinc-500/[0.035] blur-[150px]" />
        <div className="absolute bottom-[-200px] left-[35%] h-[400px] w-[700px] rounded-full bg-white/[0.025] blur-[150px]" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:80px_80px]" />
      </div>

      {/* Editorial introduction */}
      <div className="content-container relative pb-10 pt-14 small:pb-14 small:pt-24">

        <div className="flex flex-col justify-between gap-10 small:flex-row small:items-end">

          <div className="max-w-4xl">

            <div className="mb-8 flex items-center gap-3">
              <span className="h-px w-8 bg-white/70" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                The new way to shop
              </span>
            </div>

            <h1
              id="hero-heading"
              className="text-[clamp(3.5rem,9vw,8.5rem)] font-semibold leading-[0.82] tracking-[-0.075em]"
            >
              More than
              <span className="mt-3 block text-zinc-500">
                just shopping.
              </span>
            </h1>

          </div>

          <div className="max-w-[300px] pb-1 small:mr-3">

            <p className="text-base leading-relaxed text-zinc-400">
              Your everyday essentials, discoveries and next favorites.
              All in one place, delivered across Tunisia.
            </p>

            <div className="mt-7 flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                Explore our collections
              </span>
            </div>

          </div>
        </div>

        {/* Decorative divider */}
        <div className="mt-14 flex items-center gap-4 border-t border-white/[0.10] pt-5">
          <span className="font-mono text-[10px] text-zinc-600">
            01 — 04
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-600">
            Find your category
          </span>
        </div>

      </div>

      {/* Category architecture */}
      <div className="content-container relative pb-20">

        <ul className="grid grid-cols-1 gap-3 small:grid-cols-[1.15fr_1fr_1fr] small:grid-rows-[minmax(210px,1fr)_minmax(210px,1fr)]">

          {VERTICALS.map((vertical, index) => {
            const tile = TILES[index]

            if (!tile) return null

            return (
              <li
                key={vertical.key}
                className={`group relative isolate min-h-[220px] overflow-hidden border border-white/[0.11] bg-white/[0.025] backdrop-blur-2xl transition-all duration-500 hover:border-white/30 hover:bg-white/[0.055] hover:shadow-[0_20px_80px_rgba(0,0,0,0.45)] ${tile.placement}`}
              >

                <LocalizedClientLink
                  href={getVerticalHref(vertical, categories)}
                  data-testid="hero-category-link"
                  className="relative flex h-full min-h-[220px] flex-col justify-between overflow-hidden p-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/70 small:p-8"
                >

                  {/* Large background number */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-4 -top-12 select-none font-mono text-[clamp(9rem,19vw,17rem)] font-bold leading-none tracking-[-0.1em] text-white/[0.025] transition-all duration-700 group-hover:-translate-y-3 group-hover:text-white/[0.065]"
                  >
                    {tile.number}
                  </span>

                  {/* Ambient light */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 opacity-50 transition-opacity duration-700 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(ellipse at 15% 0%, rgba(255,255,255,0.13), transparent 65%)",
                    }}
                  />

                  {/* Glass reflection */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50 group-hover:opacity-100"
                  />

                  {/* Top line */}
                  <div className="relative flex items-center justify-between">

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-500">
                        {vertical.position || tile.number}
                      </span>
                      <span className="h-px w-7 bg-zinc-700 transition-all duration-500 group-hover:w-12 group-hover:bg-zinc-300" />
                    </div>

                    <span className="border border-white/[0.12] bg-white/[0.035] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-400 backdrop-blur-xl transition-all group-hover:border-white/40 group-hover:text-white">
                      Discover
                    </span>

                  </div>

                  {/* Decorative geometry */}
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute right-12 top-1/2 hidden h-16 w-16 border border-white/[0.10] transition-all duration-700 group-hover:scale-125 group-hover:rotate-90 group-hover:border-white/25 small:block ${tile.decoration}`}
                  >
                    <div className="absolute inset-3 border border-white/[0.08]" />
                  </div>

                  {/* Bottom content */}
                  <div className="relative z-10 flex items-end justify-between gap-4">

                    <div className="flex min-w-0 flex-col gap-3">

                      <span
                        className={`font-semibold leading-[0.9] tracking-[-0.055em] text-white transition-transform duration-500 group-hover:translate-x-1 ${tile.size}`}
                      >
                        {vertical.name}
                      </span>

                      <span className="max-w-[30ch] text-[13px] leading-relaxed text-zinc-500 transition-colors duration-300 group-hover:text-zinc-300">
                        {vertical.examples}
                      </span>

                    </div>

                    {/* Interactive arrow */}
                    <span
                      aria-hidden="true"
                      className="flex h-12 w-12 shrink-0 items-center justify-center border border-white/[0.15] bg-white/[0.035] text-white backdrop-blur-xl transition-all duration-500 group-hover:border-white group-hover:bg-white group-hover:text-black group-hover:shadow-[0_0_35px_rgba(255,255,255,0.15)]"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="m13 6 6 6-6 6" />
                      </svg>
                    </span>

                  </div>

                  {/* Hover sheen */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  />

                </LocalizedClientLink>
              </li>
            )
          })}

        </ul>

        {/* Bottom information */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.09] pt-6">

          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-600">
            A destination for everyday discoveries
          </span>

          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-zinc-700" />
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">
              Tunisia
            </span>
          </div>

        </div>

      </div>
    </section>
  )
}

export default Hero
