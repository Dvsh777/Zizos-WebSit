
"use client"

import { MagnifyingGlass, XMarkMini } from "@medusajs/icons"
import { useCallback, useEffect, useRef, useState } from "react"
import { useSearchBox } from "react-instantsearch"

const DEBOUNCE_MS = 250

/**
 * Free-text search over the listing, refining the same InstantSearch state the
 * sidebar filters do. The input is held locally so typing stays responsive
 * while the query itself is debounced.
 */
const StoreSearchBox = () => {
  const timer = useRef<number | undefined>(undefined)

  const queryHook = useCallback(
    (nextQuery: string, search: (value: string) => void) => {
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => search(nextQuery), DEBOUNCE_MS)
    },
    []
  )

  const { query, refine } = useSearchBox({ queryHook })
  const [inputValue, setInputValue] = useState(query)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  // Follow the query when it changes elsewhere — cleared with the filters, or
  // arriving from the URL on load, which `routing` restores after mount.
  useEffect(() => {
    setInputValue(query)
  }, [query])

  const clear = () => {
    window.clearTimeout(timer.current)
    setInputValue("")
    refine("")
  }

  return (
    <div className="relative isolate mb-6 overflow-hidden border border-white/[0.10] bg-white/[0.025] backdrop-blur-xl transition-all duration-300 focus-within:border-white/[0.22] focus-within:bg-white/[0.04]">
      {/* Restrained glass reflection */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-white/[0.045] via-transparent to-transparent"
      />

      {/* Fine upper edge highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.18] to-transparent"
      />

      <div className="flex items-center gap-x-3 px-4">
        <MagnifyingGlass className="shrink-0 text-ui-fg-muted transition-colors duration-300 group-focus-within:text-ui-fg-base" />

        <input
          type="search"
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value)
            refine(event.target.value)
          }}
          placeholder="Search products"
          aria-label="Search products"
          className="txt-medium min-w-0 w-full bg-transparent py-4 text-ui-fg-base outline-none placeholder:text-ui-fg-muted [&::-webkit-search-cancel-button]:hidden"
          data-testid="store-search-input"
        />

        {inputValue && (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear search"
            className="flex h-8 w-8 shrink-0 items-center justify-center border border-white/[0.08] bg-white/[0.025] text-ui-fg-muted transition-all duration-300 hover:border-white/[0.2] hover:bg-white/[0.08] hover:text-ui-fg-base"
            data-testid="store-search-clear"
          >
            <XMarkMini />
          </button>
        )}
      </div>

      {/* Subtle bottom reflection */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
      />
    </div>
  )
}

export default StoreSearchBox
