
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  if (!customer) return 0

  let count = 0

  if (customer.email) count++
  if (customer.first_name && customer.last_name) count++
  if (customer.phone) count++

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )

  if (billingAddress) count++

  return (count / 4) * 100
}

const Overview = ({ customer, orders }: OverviewProps) => {
  const completion = getProfileCompletion(customer)
  const addressCount = customer?.addresses?.length || 0

  return (
    <div
      className="w-full min-w-0 text-white"
      data-testid="overview-page-wrapper"
    >
      {/* Header */}
      <header className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-white/35">
            FORSTEK / ACCOUNT
          </p>

          <h1
            className="text-3xl font-semibold tracking-tight sm:text-4xl xl:text-5xl"
            data-testid="welcome-message"
            data-value={customer?.first_name}
          >
            Hello{customer?.first_name ? `, ${customer.first_name}` : ""}
          </h1>

          <p className="mt-3 break-all text-sm text-white/45">
            Signed in as{" "}
            <span
              className="text-white/75"
              data-testid="customer-email"
              data-value={customer?.email}
            >
              {customer?.email}
            </span>
          </p>
        </div>

        <LocalizedClientLink
          href="/account/profile"
          className="inline-flex w-full items-center justify-center border border-white/20 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:border-white hover:bg-white hover:text-black sm:w-auto"
        >
          Edit profile
        </LocalizedClientLink>
      </header>

      {/* Dashboard statistics */}
      <section className="grid grid-cols-1 gap-4 py-8 sm:grid-cols-2 xl:gap-6">
        <div className="border border-white/10 bg-[#0d0e10] p-5 sm:p-7 xl:p-8">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
              Profile completion
            </p>
            <span className="text-xs text-white/35">01 / 02</span>
          </div>

          <div className="mt-8 flex items-end gap-3">
            <span
              className="text-4xl font-semibold tracking-tight sm:text-5xl xl:text-6xl"
              data-testid="customer-profile-completion"
              data-value={completion}
            >
              {completion}%
            </span>
            <span className="mb-2 text-xs text-white/40">Complete</span>
          </div>

          <div className="mt-6 h-1 bg-white/10">
            <div
              className="h-full bg-white transition-all"
              style={{ width: `${completion}%` }}
            />
          </div>

          <p className="mt-4 text-xs text-white/35">
            Complete your profile to keep your account information up to date.
          </p>
        </div>

        <div className="border border-white/10 bg-[#0d0e10] p-5 sm:p-7 xl:p-8">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
              Saved addresses
            </p>
            <span className="text-xs text-white/35">02 / 02</span>
          </div>

          <div className="mt-8 flex items-end gap-3">
            <span
              className="text-4xl font-semibold tracking-tight sm:text-5xl xl:text-6xl"
              data-testid="addresses-count"
              data-value={addressCount}
            >
              {addressCount}
            </span>
            <span className="mb-2 text-xs text-white/40">
              {addressCount === 1 ? "Address" : "Addresses"}
            </span>
          </div>

          <p className="mt-6 text-xs text-white/35">
            Your saved delivery and billing addresses.
          </p>

          <LocalizedClientLink
            href="/account/addresses"
            className="mt-4 inline-flex text-xs uppercase tracking-wider text-white/70 underline underline-offset-4 transition-colors hover:text-white"
          >
            Manage addresses
          </LocalizedClientLink>
        </div>
      </section>

      {/* Recent orders */}
      <section className="pt-3">
        <div className="mb-6 flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-white/35">
              YOUR ACTIVITY
            </p>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Recent orders
            </h2>
          </div>

          <span className="text-xs text-white/35">
            {orders?.length || 0} total orders
          </span>
        </div>

        {orders && orders.length > 0 ? (
          <ul className="flex flex-col gap-3" data-testid="orders-wrapper">
            {orders.slice(0, 5).map((order) => (
              <li
                key={order.id}
                data-testid="order-wrapper"
                data-value={order.id}
              >
                <LocalizedClientLink
                  href={`/account/orders/details/${order.id}`}
                  className="group block border border-white/10 bg-[#0d0e10] p-5 transition-colors hover:border-white/30 sm:p-6 xl:p-7"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="mb-2 text-[10px] uppercase tracking-wider text-white/35">
                        Order number
                      </p>
                      <p
                        className="text-base font-semibold text-white"
                        data-testid="order-id"
                        data-value={order.display_id}
                      >
                        #{order.display_id}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-6 sm:justify-end">
                      <div className="sm:text-right">
                        <p className="mb-2 text-[10px] uppercase tracking-wider text-white/35">
                          Total
                        </p>
                        <p
                          className="text-base font-semibold text-white"
                          data-testid="order-amount"
                        >
                          {convertToLocale({
                            amount: order.total,
                            currency_code: order.currency_code,
                          })}
                        </p>
                      </div>

                      <ChevronDown className="-rotate-90 text-white/40 transition-colors group-hover:text-white" />
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                    <span className="text-xs text-white/40">
                      Date placed
                    </span>
                    <span
                      className="text-xs text-white/65"
                      data-testid="order-created-date"
                    >
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </LocalizedClientLink>
              </li>
            ))}
          </ul>
        ) : (
          <div
            className="border border-white/10 bg-[#0d0e10] px-5 py-14 text-center sm:py-20"
            data-testid="no-orders-message"
          >
            <p className="text-base text-white/75">No orders yet.</p>
            <p className="mt-2 text-sm text-white/35">
              Your orders will appear here once you place one.
            </p>

            <LocalizedClientLink
              href="/store"
              className="mt-6 inline-block border border-white/20 px-6 py-3 text-xs uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black"
            >
              Explore the store
            </LocalizedClientLink>
          </div>
        )}
      </section>
    </div>
  )
}

export default Overview
