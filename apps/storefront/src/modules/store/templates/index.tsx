
"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import type { SearchClient } from "instantsearch.js"
import { Configure, InstantSearch } from "react-instantsearch"

import { PRODUCT_INDEX_NAME, searchClient } from "@lib/search-client"
import StoreHits from "@modules/store/components/store-hits"
import StoreRefinements from "@modules/store/components/store-refinements"
import StoreSearchBox from "@modules/store/components/store-search-box"

const PRODUCT_LIMIT = 12

const StoreTemplate = ({ currencyCode }: { currencyCode: string }) => {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Escape key and background scroll handling.
  useEffect(() => {
    if (!filtersOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFiltersOpen(false)
      }
    }

    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [filtersOpen])

  return (
    <main
      className="relative isolate min-h-screen overflow-hidden bg-[#08090b] pb-24 pt-10 text-white small:pt-14"
      data-testid="category-container"
    >
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-64 left-[8%] h-[550px] w-[550px] rounded-full bg-white/[0.025] blur-[160px]" />

        <div className="absolute right-[-18%] top-[35%] h-[500px] w-[500px] rounded-full bg-zinc-400/[0.018] blur-[160px]" />

        <div className="absolute inset-0 opacity-[0.018] [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:80px_80px]" />

        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/[0.015] to-transparent" />
      </div>

      <div className="content-container relative">
        {/* Store introduction */}
        <header className="mb-9 border-b border-white/[0.10] pb-7 small:mb-12 small:pb-9">
          {/* Eyebrow */}
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-7 bg-white/50" />

            <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-zinc-500">
              FORSTEK <span className="text-zinc-700">/</span> THE STORE
            </span>
          </div>

          {/* Main heading and description */}
          <div className="flex flex-col justify-between gap-6 small:flex-row small:items-end small:gap-10">
            <h1
              data-testid="store-page-title"
              className="text-[clamp(3.2rem,7.2vw,6.4rem)] font-semibold leading-[0.86] tracking-[-0.075em] text-white"
            >
              All products<span className="text-zinc-600">.</span>
            </h1>

            <p className="max-w-[310px] text-[13px] leading-[1.8] text-zinc-400 small:pb-1 small:text-sm">
              Useful finds, everyday essentials and things worth discovering.
              Take a look around.
            </p>
          </div>

          {/* Editorial footer */}
          <div className="mt-7 flex items-center justify-between gap-4 border-t border-white/[0.07] pt-4">
            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-zinc-600 small:text-[9px]">
              Curated for everyday discovery
            </span>

            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-zinc-500 small:text-[9px]">
              Tunisia <span className="text-zinc-700">/</span> Online
            </span>
          </div>
        </header>

        <InstantSearch
          indexName={PRODUCT_INDEX_NAME}
          searchClient={searchClient as unknown as SearchClient}
          routing
          future={{ preserveSharedStateOnUnmount: true }}
        >
          <Configure hitsPerPage={PRODUCT_LIMIT} />

          {/* Store toolbar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.09] pb-4">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              aria-expanded={filtersOpen}
              aria-controls="store-filter-drawer"
              className="group relative isolate inline-flex min-h-[46px] items-center gap-3 overflow-hidden border border-white/[0.14] bg-white/[0.035] px-3.5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.045)] backdrop-blur-xl transition-all duration-300 hover:border-white/[0.28] hover:bg-white/[0.065] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 small:min-h-[48px] small:px-4"
            >
              {/* Glass surface */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-white/[0.055] via-transparent to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100"
              />

              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.25] to-transparent"
              />

              {/* Filter icon */}
              <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-white/[0.12] bg-white/[0.035] transition-colors duration-300 group-hover:border-white/[0.25] group-hover:bg-white/[0.08]">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4 text-zinc-400 transition-colors duration-300 group-hover:text-white"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 7h16M7 12h10m-7 5h4" />
                </svg>
              </span>

              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em]">
                Filters
              </span>

              <span className="h-5 w-px bg-white/[0.12]" />

              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-zinc-500 transition-colors duration-300 group-hover:text-zinc-300">
                Refine
              </span>

              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="ml-1 h-3.5 w-3.5 text-zinc-500 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>

              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.10] to-transparent"
              />
            </button>

            <div className="flex items-center gap-2">
              <span className="h-1 w-1 bg-white/40" />

              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-zinc-600 small:text-[9px]">
                FORSTEK <span className="text-zinc-700">/</span> COLLECTION
              </span>
            </div>
          </div>

          {/* Search and product area */}
          <section className="min-w-0">
            <StoreSearchBox />

            <div className="mt-6">
              <StoreHits
                hitsPerPage={PRODUCT_LIMIT}
                currencyCode={currencyCode}
              />
            </div>
          </section>

          {/* Filter drawer portal */}
          {mounted &&
            createPortal(
              <>
                {/* Backdrop */}
                <button
                  type="button"
                  aria-label="Close filters"
                  tabIndex={filtersOpen ? 0 : -1}
                  onClick={() => setFiltersOpen(false)}
                  className={`fixed inset-0 z-[9998] cursor-default bg-black/75 backdrop-blur-[5px] transition-opacity duration-300 ${
                    filtersOpen
                      ? "visible opacity-100"
                      : "invisible pointer-events-none opacity-0"
                  }`}
                />

                {/* Drawer */}
                <aside
                  id="store-filter-drawer"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Product filters"
                  aria-hidden={!filtersOpen}
                  className={`fixed right-0 top-0 z-[9999] flex h-[100dvh] w-full max-w-[420px] flex-col overflow-hidden border-l border-white/[0.12] bg-[#0b0c0f]/95 shadow-[-30px_0_100px_rgba(0,0,0,0.65)] backdrop-blur-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    filtersOpen
                      ? "visible translate-x-0"
                      : "invisible pointer-events-none translate-x-full"
                  }`}
                >
                  {/* Drawer ambient lighting */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                  >
                    <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-white/[0.025] blur-[100px]" />

                    <div className="absolute inset-0 opacity-[0.018] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:64px_64px]" />
                  </div>

                  {/* Drawer header */}
                  <div className="relative flex shrink-0 items-center justify-between border-b border-white/[0.10] px-5 py-5 small:px-6 small:py-6">
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <span className="h-px w-5 bg-white/50" />

                        <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-zinc-500">
                          FORSTEK <span className="text-zinc-700">/</span>{" "}
                          DISCOVER
                        </span>
                      </div>

                      <h2 className="text-[26px] font-semibold leading-none tracking-[-0.055em] text-white">
                        Filters<span className="text-zinc-600">.</span>
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => setFiltersOpen(false)}
                      aria-label="Close filters"
                      className="group flex h-10 w-10 items-center justify-center border border-white/[0.12] bg-white/[0.035] text-zinc-400 transition-all duration-300 hover:border-white/[0.30] hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      >
                        <path d="m6 6 12 12M18 6 6 18" />
                      </svg>
                    </button>

                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.20] to-transparent" />
                  </div>

                  {/* Scrollable filter content */}
                  <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 [scrollbar-color:rgba(255,255,255,0.18)_transparent] [scrollbar-width:thin] small:px-6">
                    <div className="mb-6 flex items-center justify-between border-b border-white/[0.07] pb-4">
                      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-500">
                        Refine your search
                      </span>

                      <span className="font-mono text-[9px] tracking-[0.12em] text-zinc-700">
                        01 <span className="text-zinc-800">/</span> FILTERS
                      </span>
                    </div>

                    <StoreRefinements currencyCode={currencyCode} />
                  </div>

                  {/* Drawer footer */}
                  <div className="relative shrink-0 border-t border-white/[0.10] bg-[#0b0c0f]/95 px-5 py-4 small:px-6">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
                    />

                    <button
                      type="button"
                      onClick={() => setFiltersOpen(false)}
                      className="group flex min-h-12 w-full items-center justify-center gap-3 bg-white px-5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-black transition-colors duration-300 hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c0f]"
                    >
                      Show products

                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14m-6-6 6 6-6 6" />
                      </svg>
                    </button>
                  </div>
                </aside>
              </>,
              document.body
            )}
        </InstantSearch>
      </div>
    </main>
  )
}

export default StoreTemplate
