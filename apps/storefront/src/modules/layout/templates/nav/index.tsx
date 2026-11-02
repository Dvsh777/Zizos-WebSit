
import { Suspense } from "react"

import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import Search from "@modules/layout/components/search"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  const controlClass =
    "flex h-9 shrink-0 items-center justify-center border border-white/[0.08] bg-white/[0.025] px-3 font-sans text-[11px] font-normal tracking-normal text-zinc-400 transition-all duration-300 hover:border-white/[0.17] hover:bg-white/[0.055] hover:text-white"

  return (
    <div className="sticky top-0 z-50 w-full">
      <header className="relative isolate w-full border-b border-white/[0.09] bg-[#090a0c]/95 text-white shadow-[0_8px_32px_rgba(0,0,0,0.22)] backdrop-blur-2xl">
        {/* Ambient glass lighting */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_-100%,rgba(255,255,255,0.10),transparent_70%)]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />

        <nav className="relative mx-auto grid h-[68px] w-full max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center px-4 font-sans sm:px-6 lg:px-8">
          {/* Left: Menu */}
          <div className="flex min-w-0 items-center justify-start">
            <SideMenu
              regions={regions}
              locales={locales}
              currentLocale={currentLocale}
            />
          </div>

          {/* Center: Brand */}
          <div className="flex items-center justify-center">
            <LocalizedClientLink
              href="/"
              className="group relative flex items-center justify-center px-4 py-2"
              data-testid="nav-store-link"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 border border-white/[0.07] bg-white/[0.025] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <span className="relative whitespace-nowrap text-[13px] font-semibold tracking-[0.24em] text-white transition-opacity duration-300 group-hover:opacity-70">
                FORSTEK
              </span>
            </LocalizedClientLink>
          </div>

          {/* Right: Actions */}
          <div className="flex min-w-0 items-center justify-end gap-2">
            {/* Search */}
            <Search />

            {/* Account */}
            <div className="hidden h-9 items-center small:flex">
              <LocalizedClientLink
                className={controlClass}
                href="/account"
                data-testid="nav-account-link"
              >
                Account
              </LocalizedClientLink>
            </div>

            {/* Cart */}
            <Suspense
              fallback={
                <LocalizedClientLink
                  className={controlClass}
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>

        {/* Bottom glass edge */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
        />
      </header>
    </div>
  )
}
