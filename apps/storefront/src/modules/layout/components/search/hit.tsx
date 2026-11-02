
"use client"

import Image from "next/image"
import type { Hit as HitType } from "instantsearch.js"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PlaceholderImage from "@modules/common/icons/placeholder-image"

export type ProductHit = HitType<{
  title: string | null
  handle: string | null
  thumbnail: string | null
}>

type SearchHitProps = {
  hit: ProductHit
  onNavigate?: () => void
}

const SearchHit = ({ hit, onNavigate }: SearchHitProps) => {
  if (!hit.handle) return null

  return (
    <li className="group">
      <LocalizedClientLink
        href={`/products/${hit.handle}`}
        onClick={onNavigate}
        className="flex items-center gap-4 border-b border-white/[0.06] px-6 py-4 transition-colors hover:bg-white/[0.035]"
        data-testid="search-hit-link"
      >
        {/* Product image */}
        <div className="relative h-[76px] w-[64px] shrink-0 overflow-hidden border border-white/[0.08] bg-[#151518]">
          {hit.thumbnail ? (
            <Image
              src={hit.thumbnail}
              alt={hit.title ?? ""}
              fill
              sizes="64px"
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              draggable={false}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-zinc-600">
              <PlaceholderImage size={22} />
            </div>
          )}
        </div>

        {/* Product information */}
        <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="line-clamp-2 text-[13px] font-medium leading-relaxed text-zinc-300 transition-colors group-hover:text-white">
              {hit.title || "Untitled product"}
            </p>

            <span className="mt-2 block font-mono text-[9px] uppercase tracking-[0.15em] text-zinc-600">
              View product
            </span>
          </div>

          <span className="shrink-0 text-sm text-zinc-600 transition-all group-hover:translate-x-1 group-hover:text-white">
            →
          </span>
        </div>
      </LocalizedClientLink>
    </li>
  )
}

export default SearchHit

