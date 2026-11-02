
"use client"

import type { Hit } from "instantsearch.js"
import { useEffect, useRef } from "react"
import { useHits, useInstantSearch } from "react-instantsearch"

import useSearchSettled from "@lib/hooks/use-search-settled"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text } from "@modules/common/components/ui"
import Thumbnail from "@modules/products/components/thumbnail"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import SearchPagination from "./pagination"
import HitPrice, { HitPricing } from "./price"

type ProductHit = Hit<
  {
    title: string | null
    handle: string | null
    thumbnail: string | null
  } & HitPricing
>

type StoreHitsProps = {
  hitsPerPage: number
  currencyCode: string
}

const StoreHits = ({ hitsPerPage, currencyCode }: StoreHitsProps) => {
  const { items } = useHits<ProductHit>()
  const { status, error, indexUiState } = useInstantSearch()
  const { isSearching, hasNoResultsYet } = useSearchSettled()

  const listRef = useRef<HTMLUListElement>(null)

  const { page, ...refinements } = indexUiState
  const currentPage = page ?? 1
  const refinementKey = JSON.stringify(refinements)

  const settled = useRef({ page: currentPage, refinementKey })

  useEffect(() => {
    if (!isSearching) {
      settled.current = { page: currentPage, refinementKey }
    }
  }, [isSearching, currentPage, refinementKey])

  const isPagingOnly =
    refinementKey === settled.current.refinementKey &&
    currentPage !== settled.current.page

  const showSkeleton = hasNoResultsYet || (isSearching && isPagingOnly)

  useEffect(() => {
    const list = listRef.current

    if (!list) return

    const cards =
      list.querySelectorAll<HTMLElement>(".forstek-product-reveal")

    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      cards.forEach((card) => card.classList.add("is-visible"))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target as HTMLElement
            card.classList.add("is-visible")
            observer.unobserve(card)
          }
        })
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -4% 0px",
      }
    )

    cards.forEach((card) => {
      if (!card.classList.contains("is-visible")) {
        observer.observe(card)
      }
    })

    return () => observer.disconnect()
  }, [items, showSkeleton])

  if (status === "error") {
    return (
      <Text
        className="py-16 text-center text-ui-fg-error"
        data-testid="products-error"
      >
        Couldn&apos;t load products
        {error?.message ? `: ${error.message}` : "."}
      </Text>
    )
  }

  return (
    <>
      {showSkeleton ? (
        <SkeletonProductGrid numberOfProducts={hitsPerPage} />
      ) : !items.length ? (
        <Text
          className="py-16 text-center text-ui-fg-subtle"
          data-testid="no-products"
        >
          No products matched these filters.
        </Text>
      ) : (
        <div className="relative isolate">
          {/* Ambient lighting behind the grid */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-8 -inset-y-10 -z-10 opacity-60"
          >
            <div className="absolute left-[15%] top-0 h-64 w-64 rounded-full bg-white/[0.025] blur-[100px]" />
            <div className="absolute right-[10%] top-[35%] h-72 w-72 rounded-full bg-white/[0.018] blur-[110px]" />
          </div>

          <ul
            ref={listRef}
            className="grid w-full grid-cols-2 gap-x-5 gap-y-9 small:grid-cols-3 small:gap-x-6 medium:grid-cols-4 medium:gap-y-12"
            data-testid="products-list"
          >
            {items.map((hit, index) =>
              hit.handle ? (
                <li
                  key={hit.objectID}
                  className="forstek-product-reveal min-w-0"
                  style={{
                    animationDelay: `${Math.min(index * 45, 270)}ms`,
                  }}
                >
                  <LocalizedClientLink
                    href={`/products/${hit.handle}`}
                    className="group block"
                  >
                    <div data-testid="product-wrapper">
                      {/* Product image frame */}
                      <div className="forstek-product-frame relative isolate overflow-hidden border border-white/[0.09] bg-[#0c0d0f] transition-all duration-500 ease-out group-hover:border-white/[0.20] group-hover:shadow-[0_10px_35px_rgba(0,0,0,0.22)]">
                        {/* Product image */}
                        <div className="relative transition-transform duration-700 ease-out group-hover:scale-[1.012]">
                          <Thumbnail
                            thumbnail={hit.thumbnail}
                            size="full"
                          />
                        </div>

                        {/* Diagonal glass light sweep */}
                        <div
                          aria-hidden="true"
                          className="forstek-glass-sweep pointer-events-none absolute inset-0 z-10 overflow-hidden"
                        >
                          <div className="forstek-glass-sweep-beam absolute left-1/2 top-1/2 h-[240%] w-[28%] -translate-x-1/2 -translate-y-1/2 rotate-[45deg]" />
                        </div>

                        {/* Subtle static glass reflection */}
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 z-[5] opacity-40 transition-opacity duration-500 group-hover:opacity-70"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.045] via-transparent via-35% to-transparent" />

                          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.22] to-transparent" />

                          <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-white/[0.10] via-transparent to-transparent" />
                        </div>

                        {/* Inner edge */}
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-[1px] z-20 border border-white/[0.025] transition-colors duration-500 group-hover:border-white/[0.07]"
                        />
                      </div>

                      {/* Product information */}
                      <div className="mt-4 flex items-start justify-between gap-x-3">
                        <Text
                          className="min-w-0 text-ui-fg-subtle transition-colors duration-300 group-hover:text-ui-fg-base"
                          data-testid="product-title"
                        >
                          {hit.title}
                        </Text>

                        <div className="shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-0.5">
                          <HitPrice
                            hit={hit}
                            currencyCode={currencyCode}
                          />
                        </div>
                      </div>

                      {/* Fine hover divider */}
                      <div
                        aria-hidden="true"
                        className="mt-3 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-white/25 via-white/[0.08] to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100"
                      />
                    </div>
                  </LocalizedClientLink>
                </li>
              ) : null
            )}
          </ul>
        </div>
      )}

      <SearchPagination />

      <style jsx>{`
        .forstek-product-reveal {
          opacity: 0;
          transform: translateY(9px);
        }

        .forstek-product-reveal.is-visible {
          animation: forstek-card-reveal 520ms
            cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes forstek-card-reveal {
          from {
            opacity: 0;
            transform: translateY(9px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* The glass glint travels from bottom-right to top-left. */
        .forstek-glass-sweep {
          opacity: 0;
        }

        .forstek-glass-sweep-beam {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.015) 25%,
            rgba(255, 255, 255, 0.11) 43%,
            rgba(255, 255, 255, 0.34) 50%,
            rgba(255, 255, 255, 0.12) 57%,
            rgba(255, 255, 255, 0.015) 75%,
            transparent 100%
          );
          filter: blur(5px);
          opacity: 0;
        }

        .group:hover .forstek-glass-sweep {
          opacity: 1;
        }

        .group:hover .forstek-glass-sweep-beam {
          animation: forstek-glint-sweep 850ms
            cubic-bezier(0.22, 0.61, 0.36, 1) both;
        }

        @keyframes forstek-glint-sweep {
          0% {
            opacity: 0;
            transform: translate(250%, 55%) rotate(45deg);
          }
          12% {
            opacity: 1;
          }
          75% {
            opacity: 0.8;
          }
          100% {
            opacity: 0;
            transform: translate(-250%, -55%) rotate(45deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .forstek-product-reveal {
            opacity: 1;
            transform: none;
          }

          .forstek-product-reveal.is-visible {
            animation: none;
          }

          .forstek-glass-sweep,
          .forstek-glass-sweep-beam {
            display: none;
          }
        }
      `}</style>
    </>
  )
}

export default StoreHits
