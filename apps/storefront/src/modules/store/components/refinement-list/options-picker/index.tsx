
"use client"

import * as Accordion from "@radix-ui/react-accordion"
import { useEffect, useState } from "react"

import { ChevronDownMini } from "@medusajs/icons"
import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import clsx from "clsx"

type OptionsPickerProps = {
  selectedValueIds: string[]
  setOptionValueIds: (valueIds: string[]) => void
}

const OptionsPicker = ({
  selectedValueIds,
  setOptionValueIds,
}: OptionsPickerProps) => {
  const [options, setOptions] = useState<HttpTypes.StoreProductOption[]>([])
  const [openItems, setOpenItems] = useState<string[]>([])

  useEffect(() => {
    let cancelled = false

    const fetchOptions = async () => {
      try {
        const response = await sdk.client.fetch<{
          product_options?: HttpTypes.StoreProductOption[]
        }>("/store/product-options", {
          method: "GET",
          query: {
            is_exclusive: false,
            fields: "*values",
          },
        })

        if (!cancelled && response?.product_options) {
          setOptions(response.product_options)
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to fetch product options", error)
        }
      }
    }

    fetchOptions()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (options.length) {
      setOpenItems(options.map((option) => option.id))
    }
  }, [options])

  if (!options.length) return null

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500">
            Product attributes
          </p>
          <h3 className="mt-1 text-sm font-medium tracking-tight text-zinc-200">
            Options
          </h3>
        </div>

        {selectedValueIds.length > 0 && (
          <button
            type="button"
            onClick={() => setOptionValueIds([])}
            className="font-mono text-[9px] uppercase tracking-[0.15em] text-zinc-500 transition-colors hover:text-white"
          >
            Clear ({selectedValueIds.length})
          </button>
        )}
      </div>

      <Accordion.Root
        type="multiple"
        value={openItems}
        onValueChange={(values) => setOpenItems(values as string[])}
        className="flex flex-col"
      >
        {options.map((option) => {
          const values =
            option.values
              ?.map((value) => ({
                id: value.id,
                label: value.value,
              }))
              .filter(
                (value): value is { id: string; label: string } =>
                  !!value.id && !!value.label
              ) || []

          if (!values.length) return null

          const selectedCount = values.filter((value) =>
            selectedValueIds.includes(value.id)
          ).length

          const isOpen = openItems.includes(option.id)

          const toggleValue = (valueId: string) => {
            const isSelected = selectedValueIds.includes(valueId)

            const nextSelections = isSelected
              ? selectedValueIds.filter((id) => id !== valueId)
              : [...selectedValueIds, valueId]

            setOptionValueIds(Array.from(new Set(nextSelections)))
          }

          return (
            <Accordion.Item
              key={option.id}
              value={option.id}
              className="border-t border-white/[0.08] first:border-t-0"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center justify-between py-4 text-left outline-none">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-zinc-300 transition-colors group-hover:text-white">
                      {option.title || "Option"}
                    </span>

                    {selectedCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center border border-white/20 bg-white/[0.08] px-1 font-mono text-[9px] text-white">
                        {selectedCount}
                      </span>
                    )}
                  </div>

                  <span
                    className={clsx(
                      "flex h-7 w-7 items-center justify-center text-zinc-600 transition-transform duration-300 group-hover:text-zinc-300",
                      isOpen && "rotate-180"
                    )}
                  >
                    <ChevronDownMini />
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>

              <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="flex flex-wrap gap-2 pb-5 pt-1">
                  {values.map((value) => {
                    const isSelected = selectedValueIds.includes(value.id)

                    return (
                      <button
                        key={value.id}
                        type="button"
                        onClick={() => toggleValue(value.id)}
                        aria-pressed={isSelected}
                        className={clsx(
                          "min-h-9 border px-3 py-2 text-[11px] transition-all duration-200",
                          isSelected
                            ? "border-white bg-white text-black"
                            : "border-white/[0.12] bg-white/[0.025] text-zinc-500 hover:border-white/40 hover:bg-white/[0.07] hover:text-white"
                        )}
                      >
                        {value.label}
                      </button>
                    )
                  })}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          )
        })}
      </Accordion.Root>
    </section>
  )
}

export default OptionsPicker
