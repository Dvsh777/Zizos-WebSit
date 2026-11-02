"use client"

import { ArrowRightOnRectangle } from "@medusajs/icons"
import { clx } from "@modules/common/components/ui"
import { useParams, usePathname } from "next/navigation"

import { signout } from "@lib/data/customer"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import MapPin from "@modules/common/icons/map-pin"
import Package from "@modules/common/icons/package"
import User from "@modules/common/icons/user"

const AccountNav = ({
  customer,
}: {
  customer: HttpTypes.StoreCustomer | null
}) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }

  const handleLogout = async () => {
    await signout(countryCode)
  }

  const navItems = [
    {
      label: "Overview",
      href: "/account",
      icon: <User size={18} />,
      testId: "overview-link",
    },
    {
      label: "Profile",
      href: "/account/profile",
      icon: <User size={18} />,
      testId: "profile-link",
    },
    {
      label: "Addresses",
      href: "/account/addresses",
      icon: <MapPin size={18} />,
      testId: "addresses-link",
    },
    {
      label: "Orders",
      href: "/account/orders",
      icon: <Package size={18} />,
      testId: "orders-link",
    },
  ]

  const isAccountRoot = route === `/${countryCode}/account`

  return (
    <div className="w-full">
      {/* Mobile navigation */}
      <div className="small:hidden" data-testid="mobile-account-nav">
        {!isAccountRoot ? (
          <LocalizedClientLink
            href="/account"
            className="mb-5 inline-flex items-center gap-2 border border-[#303030] px-3 py-2 text-xs text-[#aaaaaa] transition-colors hover:border-[#666666] hover:text-white"
            data-testid="account-main-link"
          >
            <ChevronDown className="rotate-90" />
            Back to account
          </LocalizedClientLink>
        ) : (
          <div className="mb-5 border-b border-[#292929] pb-5">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#777777]">
              FORSTEK / ACCOUNT
            </span>
            <h2 className="mt-2 text-xl font-semibold text-[#eeeeee]">
              Hello{customer?.first_name ? `, ${customer.first_name}` : ""}
            </h2>
            <p className="mt-1 text-xs text-[#777777]">
              Manage your account and orders.
            </p>
          </div>
        )}

        <nav aria-label="Account navigation">
          <ul className="flex flex-col border-y border-[#292929]">
            {navItems.map((item) => {
              const active = route.split(countryCode)[1] === item.href

              return (
                <li key={item.href}>
                  <LocalizedClientLink
                    href={item.href}
                    className={clx(
                      "flex min-h-[52px] items-center justify-between border-b border-[#292929] px-3 text-sm transition-colors last:border-b-0",
                      active
                        ? "bg-[#171717] text-white"
                        : "text-[#999999] hover:bg-[#151515] hover:text-white"
                    )}
                    data-testid={item.testId}
                  >
                    <span className="flex items-center gap-3">
                      <span className={active ? "text-white" : "text-[#777777]"}>
                        {item.icon}
                      </span>
                      {item.label}
                    </span>
                    <ChevronDown className="-rotate-90 text-[#666666]" />
                  </LocalizedClientLink>
                </li>
              )
            })}

            <li>
              <button
                type="button"
                className="flex min-h-[52px] w-full items-center justify-between px-3 text-sm text-[#999999] transition-colors hover:bg-[#151515] hover:text-rose-400"
                onClick={handleLogout}
                data-testid="logout-button"
              >
                <span className="flex items-center gap-3">
                  <ArrowRightOnRectangle />
                  Log out
                </span>
                <ChevronDown className="-rotate-90 text-[#666666]" />
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden small:block" data-testid="account-nav">
        <div className="sticky top-8">
          <div className="mb-6 border-b border-[#292929] pb-5">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#777777]">
              FORSTEK
            </span>
            <h3 className="mt-2 text-lg font-semibold tracking-tight text-[#eeeeee]">
              My account
            </h3>
            <p className="mt-1 text-xs text-[#777777]">
              {customer?.first_name
                ? `Welcome back, ${customer.first_name}`
                : "Manage your account"}
            </p>
          </div>

          <nav aria-label="Account navigation">
            <span className="mb-3 block text-[9px] font-medium uppercase tracking-[0.18em] text-[#666666]">
              Account menu
            </span>

            <ul className="flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <AccountNavLink
                    href={item.href}
                    route={route!}
                    data-testid={item.testId}
                    icon={item.icon}
                  >
                    {item.label}
                  </AccountNavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-7 border-t border-[#292929] pt-4">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-3 py-3 text-xs text-[#777777] transition-colors hover:text-rose-400"
              data-testid="logout-button"
            >
              <ArrowRightOnRectangle />
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

type AccountNavLinkProps = {
  href: string
  route: string
  children: React.ReactNode
  icon?: React.ReactNode
  "data-testid"?: string
}

const AccountNavLink = ({
  href,
  route,
  children,
  icon,
  "data-testid": dataTestId,
}: AccountNavLinkProps) => {
  const { countryCode }: { countryCode: string } = useParams()

  const active = route.split(countryCode)[1] === href

  return (
    <LocalizedClientLink
      href={href}
      className={clx(
        "flex min-h-[44px] items-center gap-3 border-l-2 px-3 text-sm transition-colors",
        active
          ? "border-white bg-[#171717] font-medium text-white"
          : "border-transparent text-[#888888] hover:bg-[#151515] hover:text-white"
      )}
      data-testid={dataTestId}
    >
      <span className={active ? "text-white" : "text-[#777777]"}>
        {icon}
      </span>
      {children}
    </LocalizedClientLink>
  )
}

export default AccountNav