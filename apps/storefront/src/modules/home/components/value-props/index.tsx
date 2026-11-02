type ValueProp = {
  title: string
  description: string
}

const buildValueProps = (currencyCode: string): ValueProp[] => [
  {
    title: "Delivery across Tunisia",
    description: "Orders ship to your door, wherever you are in the country.",
  },
  {
    title: "Order on WhatsApp",
    description:
      "Open any product, pick your options and send the order in one tap.",
  },
  {
    title: "Return policy",
    description:
      "Return windows and conditions are set out on our returns page.",
  },
  {
    title: `Prices in ${currencyCode.toUpperCase()}`,
    description: "See what you pay in local currency, with no conversion surprises.",
  },
]

export default function ValueProps({ currencyCode }: { currencyCode: string }) {
  return (
    <section
      aria-labelledby="value-props-heading"
      className="border-t border-ui-border-base bg-brand-surface"
      data-testid="value-props"
    >
      <div className="content-container py-12 small:py-16">
        <h2 id="value-props-heading" className="sr-only">
          Why shop with us
        </h2>
        <ul className="grid grid-cols-1 gap-8 xsmall:grid-cols-2 small:grid-cols-4">
          {buildValueProps(currencyCode).map((prop) => (
            <li key={prop.title}>
              <h3 className="text-large-semi text-brand-text">{prop.title}</h3>
              <p className="mt-2 max-w-xs text-base-regular text-brand-muted">
                {prop.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
