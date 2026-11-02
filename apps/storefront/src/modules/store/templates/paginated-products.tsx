
import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { OptionValueIds } from "@lib/util/product-option-filters"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  optionValueIds,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  optionValueIds?: OptionValueIds
}) {
  const queryParams: PaginatedProductsParams = {
    limit: PRODUCT_LIMIT,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const {
    response: { products, count },
  } = await listProductsWithSort({
    page,
    queryParams,
    sortBy,
    countryCode,
    optionValueIds,
  })

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <div className="w-full min-w-0">
      {/* Product grid */}
      <ul
        className="grid w-full min-w-0 grid-cols-2 gap-x-3 gap-y-8 small:grid-cols-3 small:gap-x-5 small:gap-y-10 medium:grid-cols-4 medium:gap-x-6 medium:gap-y-12"
        data-testid="products-list"
      >
        {products.map((p, index) => (
          <li
            key={p.id}
            className="group min-w-0"
            style={{
              animationDelay: `${Math.min(index * 45, 400)}ms`,
            }}
          >
            <div className="h-full transition-transform duration-500 ease-out motion-safe:group-hover:-translate-y-1">
              <ProductPreview product={p} region={region} />
            </div>
          </li>
        ))}
      </ul>

      {/* Empty state */}
      {products.length === 0 && (
        <div className="flex min-h-[300px] flex-col items-center justify-center border border-white/[0.09] bg-white/[0.015] px-6 py-16 text-center">
          <span className="mb-5 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600">
            No results found
          </span>
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            Nothing here. Yet.
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-500">
            Try changing your filters or search for something else.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-14 border-t border-white/[0.09] pt-7 small:mt-16">
          <div className="mb-5 flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-600">
              Keep exploring
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-zinc-500">
              {String(page).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
            </span>
          </div>

          <Pagination
            data-testid="product-pagination"
            page={page}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  )
}
