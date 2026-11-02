import { HttpTypes } from "@medusajs/types"
import { Vertical } from "@lib/util/verticals"

/**
 * Link for one of the four pillars. It points at the category page when the
 * backend has a category with that handle, and at the full store until then,
 * so a missing category never leads to a 404.
 */
export const getVerticalHref = (
  vertical: Vertical,
  categories: Pick<HttpTypes.StoreProductCategory, "handle">[]
) =>
  categories.some((category) => category.handle === vertical.handle)
    ? `/categories/${vertical.handle}`
    : "/store"
