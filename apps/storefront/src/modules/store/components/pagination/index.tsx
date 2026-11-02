
"use client"

import { clx } from "@modules/common/components/ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export function Pagination({
  page,
  totalPages,
  "data-testid": dataTestid,
}: {
  page: number
  totalPages: number
  "data-testid"?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const arrayRange = (start: number, stop: number) =>
    Array.from({ length: Math.max(0, stop - start + 1) }, (_, index) => start + index)

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return

    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())

    router.push(`${pathname}?${params.toString()}`, { scroll: true })
  }

  if (totalPages <= 1) return null

  const renderPageButton = (
    p: number,
    label: string | number,
    isCurrent: boolean
  ) => (
    <button
      key={p}
      type="button"
      aria-label={`Go to page ${p}`}
      aria-current={isCurrent ? "page" : undefined}
      disabled={isCurrent}
      onClick={() => handlePageChange(p)}
      className={clx(
        "flex h-10 min-w-10 items-center justify-center border px-3 font-mono text-[11px] transition-all duration-300",
        isCurrent
          ? "border-white bg-white text-black"
          : "border-white/[0.10] bg-white/[0.025] text-zinc-500 hover:border-white/40 hover:bg-white/[0.07] hover:text-white"
      )}
    >
      {label}
    </button>
  )

  const renderEllipsis = (key: string) => (
    <span
      key={key}
      aria-hidden="true"
      className="flex h-10 min-w-5 items-center justify-center font-mono text-xs text-zinc-700"
    >
      ···
    </span>
  )

  const renderPageButtons = () => {
    const buttons = []

    if (totalPages <= 7) {
      buttons.push(
        ...arrayRange(1, totalPages).map((p) =>
          renderPageButton(p, p, p === page)
        )
      )
    } else if (page <= 4) {
      buttons.push(
        ...arrayRange(1, 5).map((p) =>
          renderPageButton(p, p, p === page)
        )
      )
      buttons.push(renderEllipsis("ellipsis1"))
      buttons.push(
        renderPageButton(totalPages, totalPages, totalPages === page)
      )
    } else if (page >= totalPages - 3) {
      buttons.push(renderPageButton(1, 1, page === 1))
      buttons.push(renderEllipsis("ellipsis2"))
      buttons.push(
        ...arrayRange(totalPages - 4, totalPages).map((p) =>
          renderPageButton(p, p, p === page)
        )
      )
    } else {
      buttons.push(renderPageButton(1, 1, page === 1))
      buttons.push(renderEllipsis("ellipsis3"))
      buttons.push(
        ...arrayRange(page - 1, page + 1).map((p) =>
          renderPageButton(p, p, p === page)
        )
      )
      buttons.push(renderEllipsis("ellipsis4"))
      buttons.push(
        renderPageButton(totalPages, totalPages, page === totalPages)
      )
    }

    return buttons
  }

  return (
    <nav
      aria-label="Product pagination"
      className="mt-16 flex w-full flex-col items-center gap-5 border-t border-white/[0.08] pt-8"
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="mr-2 flex h-10 w-10 items-center justify-center border border-white/[0.10] bg-white/[0.025] text-zinc-500 transition-all duration-300 hover:border-white/40 hover:text-white disabled:pointer-events-none disabled:opacity-25"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <div className="flex items-center gap-1.5" data-testid={dataTestid}>
          {renderPageButtons()}
        </div>

        <button
          type="button"
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="ml-2 flex h-10 w-10 items-center justify-center border border-white/[0.10] bg-white/[0.025] text-zinc-500 transition-all duration-300 hover:border-white/40 hover:text-white disabled:pointer-events-none disabled:opacity-25"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-600">
        Page {page} <span className="mx-1 text-zinc-800">/</span> {totalPages}
      </span>
    </nav>
  )
}
