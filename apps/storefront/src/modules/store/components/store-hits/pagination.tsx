
"use client"

import { usePagination } from "react-instantsearch"

import { clx } from "@modules/common/components/ui"

const SearchPagination = () => {
  const { pages, currentRefinement, nbPages, refine } = usePagination({
    padding: 2,
  })

  if (nbPages <= 1) {
    return null
  }

  const renderPage = (page: number) => {
    const active = page === currentRefinement

    return (
      <button
        key={page}
        type="button"
        aria-current={active ? "page" : undefined}
        aria-label={`Go to page ${page + 1}`}
        disabled={active}
        onClick={() => refine(page)}
        className={clx(
          "relative flex h-10 min-w-10 items-center justify-center border px-3 text-sm transition-all duration-300",
          active
            ? "border-white/25 bg-white/[0.10] text-ui-fg-base shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
            : "border-white/[0.07] bg-white/[0.02] text-ui-fg-muted hover:border-white/20 hover:bg-white/[0.07] hover:text-ui-fg-base"
        )}
      >
        {page + 1}
        {active && (
          <span className="absolute inset-x-2 bottom-0 h-px bg-white/50" />
        )}
      </button>
    )
  }

  const renderEllipsis = (key: string) => (
    <span
      key={key}
      className="flex h-10 min-w-5 items-center justify-center text-sm text-ui-fg-muted/60"
    >
      ...
    </span>
  )

  const lastPage = nbPages - 1

  return (
    <div className="mt-14 flex w-full justify-center">
      <div
        className="flex items-center gap-1.5 border border-white/[0.06] bg-white/[0.015] p-1.5 backdrop-blur-md"
        data-testid="product-pagination"
      >
        {!pages.includes(0) && renderPage(0)}
        {!pages.includes(0) &&
          !pages.includes(1) &&
          renderEllipsis("start")}

        {pages.map(renderPage)}

        {!pages.includes(lastPage) &&
          !pages.includes(lastPage - 1) &&
          renderEllipsis("end")}

        {!pages.includes(lastPage) && renderPage(lastPage)}
      </div>
    </div>
  )
}

export default SearchPagination
