
"use client"

import { Table, Text, clx } from "@modules/common/components/ui"
import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    if (quantity < 1 || quantity === item.quantity) return

    setError(null)
    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        setError(err.message || "Couldn't update this item. Try again.")
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  // TODO: Replace with the actual available inventory quantity.
  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory
    ? 10
    : maxQtyFromInventory

  const isPreview = type === "preview"

  return (
    <Table.Row
      className="w-full border-b border-white/10"
      data-testid="product-row"
    >
      <Table.Cell className="!pl-0 p-3 sm:p-4 sm:!pl-0">
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className={clx("flex shrink-0", {
            "w-16": isPreview,
            "w-14 sm:w-20": !isPreview,
          })}
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
          />
        </LocalizedClientLink>
      </Table.Cell>

      <Table.Cell className="min-w-0 py-4 text-left">
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className="inline-block max-w-full"
        >
          <Text
            className="break-words text-sm font-semibold text-white transition-colors hover:text-white/65 sm:text-base"
            data-testid="product-title"
          >
            {item.product_title}
          </Text>
        </LocalizedClientLink>

        <div className="mt-1 text-xs text-white/40">
          <LineItemOptions
            variant={item.variant}
            data-testid="product-variant"
          />
        </div>
      </Table.Cell>

      {type === "full" && (
        <Table.Cell className="py-4">
          <div className="flex w-auto items-center gap-2 sm:w-32 sm:gap-3">
            <DeleteButton
              id={item.id}
              data-testid="product-delete-button"
            />

            <CartItemSelect
              value={item.quantity}
              onChange={(value) =>
                changeQuantity(parseInt(value.target.value, 10))
              }
              className="h-10 w-14"
              data-testid="product-select-button"
              aria-label={`Quantity for ${item.product_title}`}
            >
              {Array.from(
                { length: Math.min(maxQuantity, 10) },
                (_, i) => (
                  <option
                    value={i + 1}
                    key={i + 1}
                    className="bg-[#111214] text-white"
                  >
                    {i + 1}
                  </option>
                )
              )}
            </CartItemSelect>

            {updating && (
              <span className="text-white/50" aria-label="Updating quantity">
                <Spinner />
              </span>
            )}
          </div>

          <ErrorMessage
            error={error}
            data-testid="product-error-message"
          />
        </Table.Cell>
      )}

      {type === "full" && (
        <Table.Cell className="hidden py-4 text-white/60 small:table-cell">
          <LineItemUnitPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </Table.Cell>
      )}

      <Table.Cell className="!pr-0 py-4 text-right">
        <span
          className={clx("!pr-0", {
            "flex h-full flex-col items-end justify-center": isPreview,
          })}
        >
          {isPreview && (
            <span className="mb-1 flex items-center gap-x-1 text-xs text-white/40">
              <span>{item.quantity}x</span>
              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </span>
          )}

          <span className="font-semibold text-white">
            <LineItemPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </span>
        </span>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item
