
import { useMemo } from "react"

import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const OrderCard = ({ order }: OrderCardProps) => {
  const numberOfLines = useMemo(
    () =>
      order.items?.reduce((total, item) => total + item.quantity, 0) ?? 0,
    [order.items]
  )

  const numberOfProducts = order.items?.length ?? 0
  const visibleItems = order.items?.slice(0, 3) ?? []
  const remainingProducts = Math.max(0, numberOfProducts - visibleItems.length)

  return (
    <article
      className="w-full min-w-0 border border-white/10 bg-[#0d0e10] p-4 sm:p-5 text-white"
      data-testid="order-card"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/35 mb-2">
            Order number
          </p>
          <h2 className="text-lg font-semibold tracking-tight">
            #
            <span data-testid="order-display-id">{order.display_id}</span>
          </h2>
        </div>

        <div className="sm:text-right">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/35 mb-2">
            Order total
          </p>
          <p className="text-base font-semibold" data-testid="order-amount">
            {convertToLocale({
              amount: order.total,
              currency_code: order.currency_code,
            })}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-4 pt-4 border-t border-white/10 text-xs text-white/45">
        <span data-testid="order-created-at">
          {new Date(order.created_at).toLocaleDateString()}
        </span>
        <span className="h-1 w-1 rounded-full bg-white/25" />
        <span>
          {numberOfLines} {numberOfLines === 1 ? "item" : "items"}
        </span>
        <span className="h-1 w-1 rounded-full bg-white/25" />
        <span>
          {numberOfProducts} {numberOfProducts === 1 ? "product" : "products"}
        </span>
      </div>

      {visibleItems.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-5">
          {visibleItems.map((item) => (
            <div
              key={item.id}
              className="min-w-0 flex flex-col gap-2"
              data-testid="order-item"
            >
              <div className="border border-white/10 bg-[#151619] overflow-hidden">
                <Thumbnail
                  thumbnail={item.thumbnail}
                  images={[]}
                  size="full"
                />
              </div>

              <div className="min-w-0 flex items-start justify-between gap-2">
                <span
                  className="text-xs text-white/75 leading-relaxed line-clamp-2"
                  data-testid="item-title"
                >
                  {item.title}
                </span>
                <span className="shrink-0 text-xs text-white/40">
                  ×
                  <span data-testid="item-quantity">{item.quantity}</span>
                </span>
              </div>
            </div>
          ))}

          {remainingProducts > 0 && (
            <div className="min-h-24 border border-dashed border-white/15 bg-white/[0.02] flex flex-col items-center justify-center text-center">
              <span className="text-xl font-semibold text-white">
                +{remainingProducts}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-white/40 mt-1">
                More products
              </span>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end mt-5 pt-4 border-t border-white/10">
        <LocalizedClientLink
          href={`/account/orders/details/${order.id}`}
          className="inline-flex items-center justify-center gap-3 border border-white/20 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-white hover:bg-white hover:text-black transition-colors"
          data-testid="order-details-link"
        >
          View order details
          <span aria-hidden="true">↗</span>
        </LocalizedClientLink>
      </div>
    </article>
  )
}

export default OrderCard
