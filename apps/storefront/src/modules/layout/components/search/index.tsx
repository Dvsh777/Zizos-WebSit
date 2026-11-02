
"use client"

import { MagnifyingGlass } from "@medusajs/icons"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import type { SearchClient } from "instantsearch.js"

import {
  Configure,
  InstantSearch,
  useHits,
  useInstantSearch,
  useSearchBox,
} from "react-instantsearch"

import useSearchSettled from "@lib/hooks/use-search-settled"
import useToggleState from "@lib/hooks/use-toggle-state"
import { PRODUCT_INDEX_NAME, searchClient } from "@lib/search-client"

import SearchDrawer from "./drawer"
import SearchHit, { ProductHit } from "./hit"

const HITS_PER_PAGE = 12
const DEBOUNCE_MS = 250

const SearchPanel = ({ onNavigate }: { onNavigate: () => void }) => {
  const timer = useRef<number | undefined>(undefined)

  const queryHook = useCallback(
    (nextQuery: string, search: (value: string) => void) => {
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(
        () => search(nextQuery),
        DEBOUNCE_MS
      )
    },
    []
  )

  const { query, refine } = useSearchBox({ queryHook })
  const { items } = useHits<ProductHit>()
  const { status, error } = useInstantSearch()
  const { isSettled } = useSearchSettled()

  const [inputValue, setInputValue] = useState(query)

  useEffect(() => {
    return () => window.clearTimeout(timer.current)
  }, [])

  const hasInput = Boolean(inputValue.trim())
  const isPending = inputValue.trim() !== query.trim()
  const hasResults = Boolean(query.trim()) && items.length > 0

  return (
    <>
      {/* Search input */}
      <div className="px-6 pb-5 pt-6">
        <label
          htmlFor="forstek-search-input"
          className="mb-3 block font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-600"
        >
          What are you looking for?
        </label>

        <div className="group flex items-center gap-3 border-b border-white/20 pb-4 transition-colors focus-within:border-white">
          <MagnifyingGlass className="h-5 w-5 shrink-0 text-zinc-500 transition-colors group-focus-within:text-white" />

          <input
            id="forstek-search-input"
            type="search"
            value={inputValue}
            onChange={(event) => {
              const value = event.target.value
              setInputValue(value)
              refine(value)
            }}
            placeholder="Search products..."
            aria-label="Search products"
            autoFocus
            className="w-full bg-transparent text-[15px] font-medium text-white outline-none placeholder:text-zinc-700"
            data-testid="search-input"
          />

          {hasInput && (
            <button
              type="button"
              onClick={() => {
                setInputValue("")
                refine("")
              }}
              className="shrink-0 text-[10px] uppercase tracking-widest text-zinc-600 transition-colors hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Results heading */}
      <div className="flex items-center justify-between border-y border-white/[0.07] px-6 py-3">
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-500">
          {hasInput ? "Search results" : "Product discovery"}
        </span>

        {hasResults && isSettled && (
          <span className="font-mono text-[9px] text-zinc-600">
            {items.length} RESULTS
          </span>
        )}
      </div>

      {/* Results */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {!hasInput ? (
          <div
            className="flex flex-col items-center justify-center px-8 py-20 text-center"
            data-testid="search-empty"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center border border-white/[0.09] bg-white/[0.02]">
              <MagnifyingGlass className="h-6 w-6 text-zinc-600" />
            </div>

            <p className="text-sm font-medium text-zinc-300">
              Find something interesting.
            </p>

            <p className="mt-2 max-w-[220px] text-xs leading-relaxed text-zinc-600">
              Search our collection of clothing, sports nutrition, electronics and home essentials.
            </p>
          </div>
        ) : status === "error" ? (
          <div
            className="px-6 py-12 text-center"
            data-testid="search-error"
          >
            <p className="text-sm text-red-400">
              Couldn't search products.
            </p>
            <p className="mt-2 break-words text-xs text-zinc-600">
              {error?.message || "Please try again."}
            </p>
          </div>
        ) : !isSettled || isPending ? (
          <div
            className="flex items-center justify-center gap-3 px-6 py-14"
            data-testid="search-loading"
          >
            <span className="h-4 w-4 animate-spin border border-white/20 border-t-white" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              Searching
            </span>
          </div>
        ) : hasResults ? (
          <ul data-testid="search-results">
            {items.map((hit) => (
              <SearchHit
                key={hit.objectID}
                hit={hit}
                onNavigate={onNavigate}
              />
            ))}
          </ul>
        ) : (
          <div
            className="px-6 py-14 text-center"
            data-testid="search-no-results"
          >
            <p className="text-sm font-medium text-zinc-300">
              No products found.
            </p>

            <p className="mt-2 break-words text-xs text-zinc-600">
              No results for "{query}". Try another search.
            </p>
          </div>
        )}
      </div>
    </>
  )
}

const Search = () => {
  const { state: isOpen, open, close } = useToggleState()

  const { countryCode } = useParams<{ countryCode: string }>()

  return (
    <>
      {/* Header search trigger */}
      <Link
        href={`/${countryCode}/search`}
        onClick={(event) => {
          event.preventDefault()
          open()
        }}
        aria-label="Search products"
        title="Search products"
        className="group flex h-10 w-10 items-center justify-center border border-transparent text-zinc-400 transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.04] hover:text-white"
        data-testid="nav-search-button"
      >
        <MagnifyingGlass className="h-[17px] w-[17px] transition-transform duration-300 group-hover:scale-110" />
      </Link>

      {/* Search drawer */}
      <SearchDrawer isOpen={isOpen} close={close}>
        <InstantSearch
          indexName={PRODUCT_INDEX_NAME}
          searchClient={searchClient as unknown as SearchClient}
          future={{ preserveSharedStateOnUnmount: true }}
        >
          <Configure hitsPerPage={HITS_PER_PAGE} />
          <SearchPanel onNavigate={close} />
        </InstantSearch>
      </SearchDrawer>
    </>
  )
}

export default Search
