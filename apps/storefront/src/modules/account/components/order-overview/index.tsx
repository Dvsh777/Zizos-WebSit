
"use client"

import OrderCard from "../order-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

const OrderOverview = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {
  if (orders?.length) {
    return (
      <div className="flex flex-col gap-4 w-full min-w-0">
        <div className="flex items-end justify-between border-b border-white/10 pb-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/35 mb-2">
              FORSTEK / ACCOUNT
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Your orders
            </h1>
          </div>
          <span className="text-xs text-white/40">
            {orders.length} {orders.length === 1 ? "order" : "orders"}
          </span>
        </div>

        {orders.map((order) => (
          <div key={order.id} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
            <OrderCard order={order} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className="w-full min-w-0 border border-white/10 bg-[#0d0e10] px-5 py-12 sm:px-8 text-center"
      data-testid="no-orders-container"
    >
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/35 mb-4">
        FORSTEK / ACCOUNT
      </p>
      <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
        No orders yet
      </h2>
      <p className="text-sm text-white/45 mt-3 max-w-sm mx-auto">
        You haven&apos;t placed an order yet. Once you do, you&apos;ll find its
        details and status here.
      </p>
      <div className="mt-7">
        <LocalizedClientLink
          href="/store"
          className="inline-flex items-center justify-center bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-black hover:bg-white/85 transition-colors"
          data-testid="continue-shopping-button"
        >
          Explore the store
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderOverview
