import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"

import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts?.length) {
    return null
  }

  return (
    <div className="content-container py-12 small:py-20">
      <div className="mb-6 flex items-end justify-between gap-4 small:mb-10">
        <h2 className="text-2xl font-semibold tracking-tight text-brand-text">
          {collection.title}
        </h2>
        <InteractiveLink href={`/collections/${collection.handle}`}>
          View all
        </InteractiveLink>
      </div>
      {/* A swipeable row on phones, a four-column grid from 1024px. */}
      <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 xsmall:-mx-6 xsmall:px-6 small:mx-0 small:grid small:grid-cols-4 small:gap-x-6 small:gap-y-12 small:overflow-visible small:px-0 small:pb-0">
        {pricedProducts.map((product) => (
          <li
            key={product.id}
            className="w-[62%] shrink-0 snap-start xsmall:w-[40%] small:w-auto"
          >
            <ProductPreview product={product} region={region} isFeatured />
          </li>
        ))}
      </ul>
    </div>
  )
}
