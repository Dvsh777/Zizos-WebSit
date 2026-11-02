import { HttpTypes } from "@medusajs/types"

export type VerticalKey =
  | "clothing"
  | "sports-nutrition"
  | "electronics-gadgets"
  | "lifestyle-home"

export type Vertical = {
  key: VerticalKey
  /** Position on the homepage, "01" to "04". */
  position: string
  /** Category handle. The backend seed creates a category with this handle. */
  handle: VerticalKey
  name: string
  examples: string
  /** Other category handles that also count as this vertical. */
  aliases: string[]
}

/**
 * The four product pillars. They drive the homepage split, the header and
 * footer navigation, the product cards and the category-aware product pages.
 */
export const VERTICALS: Vertical[] = [
  {
    key: "clothing",
    position: "01",
    handle: "clothing",
    name: "Clothing",
    examples: "T-shirts, pants and outfits",
    // "merch" is where the demo seed puts its shorts.
    aliases: [
      "shirts",
      "t-shirts",
      "sweatshirts",
      "pants",
      "outfits",
      "apparel",
      "merch",
    ],
  },
  {
    key: "sports-nutrition",
    position: "02",
    handle: "sports-nutrition",
    name: "Sports & Nutrition",
    examples: "Creatine, protein and fitness accessories",
    aliases: ["supplements", "protein", "creatine", "fitness"],
  },
  {
    key: "electronics-gadgets",
    position: "03",
    handle: "electronics-gadgets",
    name: "Electronics & Gadgets",
    examples: "Gadgets, accessories and tech products",
    aliases: ["electronics", "gadgets", "tech"],
  },
  {
    key: "lifestyle-home",
    position: "04",
    handle: "lifestyle-home",
    name: "Lifestyle & Home",
    examples: "Everyday items and home accessories",
    aliases: ["lifestyle", "home", "home-accessories"],
  },
]

export const getVerticalByKey = (key: string | null | undefined) =>
  VERTICALS.find((vertical) => vertical.key === key) ?? null

/**
 * Works out which pillar a product belongs to. An explicit `vertical` value in
 * the product metadata wins; otherwise the product's categories (and their
 * parents) are matched against each pillar's handle and aliases.
 */
export const getProductVertical = (
  product: Pick<HttpTypes.StoreProduct, "metadata" | "categories">
): Vertical | null => {
  const explicit = product.metadata?.vertical

  if (typeof explicit === "string") {
    const match = getVerticalByKey(explicit.trim().toLowerCase())

    if (match) {
      return match
    }
  }

  const handles = new Set<string>()

  for (const category of product.categories ?? []) {
    let current: HttpTypes.StoreProductCategory | null | undefined = category

    for (let depth = 0; current && depth < 5; depth += 1) {
      if (current.handle) {
        handles.add(current.handle.toLowerCase())
      }
      current = current.parent_category
    }
  }

  return (
    VERTICALS.find(
      (vertical) =>
        handles.has(vertical.handle) ||
        vertical.aliases.some((alias) => handles.has(alias))
    ) ?? null
  )
}
