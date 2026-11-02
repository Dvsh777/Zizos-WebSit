import { HttpTypes } from "@medusajs/types"
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import ValueProps from "@modules/home/components/value-props"

/**
 * Homepage Template
 * 1. Hero: Modern 4-way category split (Medusa category-aware)
 * 2. Curated collections rail
 * 3. Value propositions footer bar
 */
const HomeTemplate = ({
  region,
  collections,
  categories,
}: {
  region: HttpTypes.StoreRegion
  collections: HttpTypes.StoreCollection[]
  categories: HttpTypes.StoreProductCategory[]
}) => {
  return (
    <div className="bg-[#0a0a0c] min-h-screen text-white">
      {/* 4-Way Hero Split */}
      <Hero categories={categories} />

      {/* Featured Collections Section */}
      {collections.length > 0 && (
        <section
          aria-label="Collections"
          data-testid="curated-collections"
          className="py-12 border-t border-zinc-900 bg-zinc-950/40"
        >
          <ul className="flex flex-col gap-y-12">
            <FeaturedProducts collections={collections} region={region} />
          </ul>
        </section>
      )}

      {/* Value Proposition Highlights */}
      <div className="border-t border-zinc-900 bg-[#0a0a0c]">
        <ValueProps currencyCode={region.currency_code} />
      </div>
    </div>
  )
}

export default HomeTemplate