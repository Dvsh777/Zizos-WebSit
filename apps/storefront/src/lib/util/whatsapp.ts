/**
 * WhatsApp ordering helpers. The business number is public by nature, so it
 * lives in a NEXT_PUBLIC variable. Digits only, with the country code and no
 * plus sign, for example 21612345678.
 */
export const getWhatsAppNumber = () =>
  (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "")

const fractionDigits = (currencyCode: string) => {
  try {
    return (
      new Intl.NumberFormat("en", {
        style: "currency",
        currency: currencyCode.toUpperCase(),
      }).resolvedOptions().maximumFractionDigits ?? 2
    )
  } catch {
    return 2
  }
}

/** Formats an amount the way a customer reads it, for example "35.000 TND". */
export const formatPriceForMessage = (amount: number, currencyCode: string) => {
  const digits = fractionDigits(currencyCode)
  const value = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    useGrouping: false,
  }).format(amount)

  return `${value} ${currencyCode.toUpperCase()}`
}

export type OrderMessageInput = {
  storeName: string
  productTitle: string
  /** One entry per product option, for example { label: "Size", value: "M" }. */
  options?: { label: string; value: string }[]
  amount?: number | null
  currencyCode?: string | null
  quantity?: number
  pageUrl?: string | null
}

export const buildOrderMessage = ({
  storeName,
  productTitle,
  options = [],
  amount,
  currencyCode,
  quantity = 1,
  pageUrl,
}: OrderMessageInput) => {
  const lines = [
    `Hello ${storeName}, I would like to order:`,
    "",
    `Product: ${productTitle}`,
  ]

  for (const option of options) {
    lines.push(`${option.label}: ${option.value}`)
  }

  lines.push(`Quantity: ${quantity}`)

  if (amount != null && currencyCode) {
    lines.push(`Price: ${formatPriceForMessage(amount, currencyCode)}`)
  }

  if (pageUrl) {
    lines.push(`Link: ${pageUrl}`)
  }

  return lines.join("\n")
}

export const buildHelpMessage = ({
  storeName,
  productTitle,
  topic,
  pageUrl,
}: {
  storeName: string
  productTitle: string
  topic: string
  pageUrl?: string | null
}) =>
  [
    `Hello ${storeName}, I have a question about ${topic} for ${productTitle}.`,
    ...(pageUrl ? ["", `Link: ${pageUrl}`] : []),
  ].join("\n")

export const buildWhatsAppUrl = (number: string, message: string) =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`
