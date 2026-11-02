
import InteractiveLink from "@modules/common/components/interactive-link"

const EmptyCartMessage = () => {
  return (
    <section
      className="flex min-h-[60vh] w-full flex-col items-center justify-center bg-[#08090b] px-5 py-24 text-center text-white sm:px-8"
      data-testid="empty-cart-message"
    >
      <div className="w-full max-w-xl">
        <p className="mb-6 text-[10px] font-medium uppercase tracking-[0.25em] text-white/35">
          FORSTEK / YOUR CART
        </p>

        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
          Nothing here. Yet.
        </h1>

        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-white/45 sm:text-base">
          Your next favourite might be waiting. Explore the collection and find
          something worth adding.
        </p>

        <div className="mt-9 flex justify-center">
          <InteractiveLink href="/store">
            Explore the collection
          </InteractiveLink>
        </div>

        <p className="mt-12 border-t border-white/[0.08] pt-5 text-[10px] uppercase tracking-[0.16em] text-white/25">
          FORSTEK — Find your next favourite
        </p>
      </div>
    </section>
  )
}

export default EmptyCartMessage
