
"use client"

import clsx from "clsx"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: string) => void
  "data-testid"?: string
}

const sortOptions: {
  value: SortOptions
  label: string
  description: string
}[] = [
  {
    value: "created_at",
    label: "Latest arrivals",
    description: "Recently added",
  },
  {
    value: "price_asc",
    label: "Price: low to high",
    description: "Lowest price first",
  },
  {
    value: "price_desc",
    label: "Price: high to low",
    description: "Highest price first",
  },
]

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  const handleChange = (value: SortOptions) => {
    if (value !== sortBy) {
      setQueryParams("sortBy", value)
    }
  }

  return (
    <section className="flex flex-col gap-4" data-testid={dataTestId}>
      <div>
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500">
          Display order
        </p>

        <h3 className="mt-1 text-sm font-medium tracking-tight text-zinc-200">
          Sort by
        </h3>
      </div>

      <div
        role="radiogroup"
        aria-label="Sort products"
        className="flex flex-col"
      >
        {sortOptions.map((option, index) => {
          const isSelected = sortBy === option.value

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => handleChange(option.value)}
              className={clsx(
                "group flex w-full items-center gap-3 border-t border-white/[0.08] py-3 text-left transition-colors duration-200 first:border-t-0",
                isSelected ? "text-white" : "text-zinc-500 hover:text-zinc-200"
              )}
            >
              <span
                className={clsx(
                  "flex h-4 w-4 shrink-0 items-center justify-center border transition-all duration-200",
                  isSelected
                    ? "border-white bg-white"
                    : "border-white/20 bg-transparent group-hover:border-white/50"
                )}
              >
                {isSelected && (
                  <span className="h-1.5 w-1.5 bg-black" />
                )}
              </span>

              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-xs font-medium">
                  {option.label}
                </span>

                <span className="text-[10px] text-zinc-600 transition-colors group-hover:text-zinc-400">
                  {option.description}
                </span>
              </span>

              <span className="font-mono text-[9px] text-zinc-700">
                0{index + 1}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default SortProducts
