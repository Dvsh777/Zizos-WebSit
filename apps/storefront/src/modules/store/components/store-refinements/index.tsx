
"use client"

import { useSortBy } from "react-instantsearch"

import FilterRadioGroup from "@modules/common/components/filter-radio-group"
import {
  CATEGORY_ATTRIBUTE,
  LABELS_ATTRIBUTE,
  getSortOptions,
} from "./attributes"
import CurrentRefinements from "./current-refinements"
import OnSaleToggle from "./on-sale-toggle"
import OptionRefinements from "./option-refinements"
import PriceRange from "./price-range"
import RefinementGroup from "./refinement-group"

const SortProducts = ({ currencyCode }: { currencyCode: string }) => {
  const items = getSortOptions(currencyCode)
  const { currentRefinement, refine } = useSortBy({ items })

  return (
    <FilterRadioGroup
      title="Sort by"
      items={items}
      value={currentRefinement}
      handleChange={refine}
      data-testid="sort-by-container"
    />
  )
}

const StoreRefinements = ({
  currencyCode,
}: {
  currencyCode: string
}) => {
  return (
    <div className="flex flex-col gap-8 py-2">
      <div>
        <div className="mb-4 flex items-center justify-between border-b border-white/[0.08] pb-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500">
            Ordering
          </span>
          <span className="font-mono text-[9px] text-zinc-700">01</span>
        </div>
        <SortProducts currencyCode={currencyCode} />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between border-b border-white/[0.08] pb-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500">
            Active filters
          </span>
          <span className="font-mono text-[9px] text-zinc-700">02</span>
        </div>
        <CurrentRefinements currencyCode={currencyCode} />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between border-b border-white/[0.08] pb-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500">
            Product options
          </span>
          <span className="font-mono text-[9px] text-zinc-700">03</span>
        </div>
        <OptionRefinements />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between border-b border-white/[0.08] pb-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500">
            Price
          </span>
          <span className="font-mono text-[9px] text-zinc-700">04</span>
        </div>
        <PriceRange currencyCode={currencyCode} />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between border-b border-white/[0.08] pb-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500">
            Offers
          </span>
          <span className="font-mono text-[9px] text-zinc-700">05</span>
        </div>
        <OnSaleToggle currencyCode={currencyCode} />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between border-b border-white/[0.08] pb-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500">
            Categories
          </span>
          <span className="font-mono text-[9px] text-zinc-700">06</span>
        </div>
        <RefinementGroup
          attribute={CATEGORY_ATTRIBUTE}
          title="Category"
        />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between border-b border-white/[0.08] pb-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500">
            Labels
          </span>
          <span className="font-mono text-[9px] text-zinc-700">07</span>
        </div>
        <RefinementGroup
          attribute={LABELS_ATTRIBUTE}
          title="Labels"
        />
      </div>
    </div>
  )
}

export default StoreRefinements
