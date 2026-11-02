
"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { retrieveCart } from "@lib/data/cart"
import { CART_UPDATED_EVENT } from "@lib/util/cart-events"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"

const countItems = (cart?: HttpTypes.StoreCart | null) =>
  cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

const CartDropdown = ({
  cart: serverCart,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const [clientCart, setClientCart] =
    useState<HttpTypes.StoreCart | null>(null)

  const cartState = serverCart ?? clientCart

  const [activeTimer, setActiveTimer] =
    useState<ReturnType<typeof setTimeout> | undefined>(undefined)

  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems = countItems(cartState)
  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  useEffect(() => {
    if (serverCart) return

    let isInitialLoad = true

    const load = () =>
      retrieveCart()
        .then((cart) => {
          if (isInitialLoad) {
            itemRef.current = countItems(cart)
            isInitialLoad = false
          }

          setClientCart(cart)
        })
        .catch(() => {})

    load()
    window.addEventListener(CART_UPDATED_EVENT, load)

    return () => window.removeEventListener(CART_UPDATED_EVENT, load)
  }, [serverCart])

  const timedOpen = () => {
    open()
    const timer = setTimeout(close, 5000)
    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) clearTimeout(activeTimer)
    open()
  }

  useEffect(() => {
    return () => {
      if (activeTimer) clearTimeout(activeTimer)
    }
  }, [activeTimer])

  const pathname = usePathname()

  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, pathname])

  return (
    <div
      className="relative z-50 flex h-full items-center"
      onMouseEnter={openAndCancel}
      onMouseLeave={close}
    >
      <Popover className="relative flex h-full items-center">

        {/* Header cart trigger */}
        <PopoverButton
          className="group flex h-full items-center gap-2.5 text-[11px] font-medium tracking-wide text-zinc-400 transition-colors hover:text-white focus:outline-none"
          as="div"
        >
          <LocalizedClientLink
            className="flex h-full items-center gap-2.5"
            href="/cart"
            data-testid="nav-cart-link"
          >
            <span className="relative flex items-center">
              <svg
                viewBox="0 0 24 24"
                className="h-[17px] w-[17px] transition-transform duration-300 group-hover:-translate-y-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 8h14l-1.2 12H6.2L5 8Z" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-white px-1 text-[8px] font-semibold text-black">
                  {totalItems}
                </span>
              )}
            </span>

            <span>Cart</span>
            <span className="font-mono text-[10px] text-zinc-600 transition-colors group-hover:text-zinc-300">
              ({totalItems})
            </span>
          </LocalizedClientLink>
        </PopoverButton>

        {/* Cart dropdown */}
        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-2"
        >
          <PopoverPanel
            static
            className="absolute right-0 top-[calc(100%+1px)] hidden w-[min(420px,90vw)] border border-white/[0.12] bg-[#0c0c0f] text-white shadow-[0_25px_80px_rgba(0,0,0,0.65)] small:block"
            data-testid="nav-cart-dropdown"
          >
            {/* Dropdown header */}
            <div className="flex items-center justify-between border-b border-white/[0.09] px-6 py-5">
              <div>
                <h3 className="text-sm font-semibold tracking-wide">
                  Your bag
                </h3>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-500">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </p>
              </div>

              <LocalizedClientLink
                href="/cart"
                className="text-[10px] uppercase tracking-widest text-zinc-500 transition-colors hover:text-white"
              >
                View bag →
              </LocalizedClientLink>
            </div>

            {cartState && cartState.items?.length ? (
              <>
                {/* Items */}
                <div className="grid max-h-[390px] grid-cols-1 gap-y-5 overflow-y-auto p-5">
                  {cartState.items
                    .sort((a, b) =>
                      (a.created_at ?? "") > (b.created_at ?? "")
                        ? -1
                        : 1
                    )
                    .map((item) => (
                      <div
                        className="grid grid-cols-[88px_1fr] gap-4 border-b border-white/[0.08] pb-5 last:border-0 last:pb-0"
                        key={item.id}
                        data-testid="cart-item"
                      >
                        <LocalizedClientLink
                          href={`/products/${item.product_handle}`}
                          className="w-[88px] overflow-hidden border border-white/[0.08] bg-[#151518]"
                        >
                          <Thumbnail
                            thumbnail={item.thumbnail}
                            images={item.variant?.product?.images}
                            size="square"
                          />
                        </LocalizedClientLink>

                        <div className="flex min-w-0 flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="overflow-hidden text-ellipsis text-sm font-medium text-zinc-200">
                                <LocalizedClientLink
                                  href={`/products/${item.product_handle}`}
                                  data-testid="product-link"
                                  className="transition-colors hover:text-white"
                                >
                                  {item.title}
                                </LocalizedClientLink>
                              </h3>

                              <div className="shrink-0 text-xs text-zinc-300">
                                <LineItemPrice
                                  item={item}
                                  style="tight"
                                  currencyCode={cartState.currency_code}
                                />
                              </div>
                            </div>

                            <div className="mt-2 text-[11px] text-zinc-500">
                              <LineItemOptions
                                variant={item.variant}
                                data-testid="cart-item-variant"
                                data-value={item.variant}
                              />
                            </div>

                            <span
                              className="mt-1 block font-mono text-[10px] text-zinc-500"
                              data-testid="cart-item-quantity"
                              data-value={item.quantity}
                            >
                              Qty: {item.quantity}
                            </span>
                          </div>

                          <DeleteButton
                            id={item.id}
                            className="mt-3 w-fit text-[10px] uppercase tracking-widest text-zinc-600 transition-colors hover:text-red-400"
                            data-testid="cart-item-remove-button"
                          >
                            Remove
                          </DeleteButton>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Subtotal */}
                <div className="border-t border-white/[0.09] bg-white/[0.015] p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-medium text-zinc-300">
                        Subtotal
                      </span>
                      <span className="ml-2 text-[10px] text-zinc-600">
                        Excl. taxes
                      </span>
                    </div>

                    <span
                      className="text-sm font-semibold text-white"
                      data-testid="cart-subtotal"
                      data-value={subtotal}
                    >
                      {convertToLocale({
                        amount: subtotal,
                        currency_code: cartState.currency_code,
                      })}
                    </span>
                  </div>

                  <LocalizedClientLink
                    href="/cart"
                    className="flex w-full items-center justify-center gap-3 bg-white px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-black transition-all hover:bg-zinc-200"
                  >
                    Go to cart
                    <span aria-hidden="true">→</span>
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              /* Empty cart */
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="mb-5 flex h-14 w-14 items-center justify-center border border-white/[0.10] bg-white/[0.025]">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6 text-zinc-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 8h14l-1.2 12H6.2L5 8Z" />
                    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
                  </svg>
                </div>

                <h4 className="text-sm font-medium text-white">
                  Your bag is empty
                </h4>

                <p className="mt-2 max-w-[220px] text-xs leading-relaxed text-zinc-500">
                  Discover something you'll love and add it to your bag.
                </p>

                <LocalizedClientLink
                  href="/store"
                  className="mt-7 border border-white/20 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-white transition-all hover:bg-white hover:text-black"
                >
                  Explore products →
                </LocalizedClientLink>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown
