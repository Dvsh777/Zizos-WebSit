
import React from "react"

import UnderlineLink from "@modules/common/components/interactive-link"
import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  // Login and registration: full-width centered layout.
  if (!customer) {
    return (
      <div
        className="flex min-h-screen w-full items-center justify-center bg-[#08090b] text-white"
        data-testid="account-page"
      >
        <main className="flex w-full min-w-0 items-center justify-center">
          {children}
        </main>
      </div>
    )
  }

  // Logged-in customer dashboard.
  return (
    <div
      className="min-h-screen w-full bg-[#08090b] text-white"
      data-testid="account-page"
    >
      <div className="mx-auto w-full max-w-[2200px] px-5 py-8 sm:px-8 sm:py-12 lg:px-12 xl:px-16 2xl:px-20">
        <div className="grid w-full min-w-0 grid-cols-1 gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[280px_minmax(0,1fr)] xl:gap-16 2xl:grid-cols-[300px_minmax(0,1fr)] 2xl:gap-20">
          <aside className="min-w-0 w-full">
            <AccountNav customer={customer} />
          </aside>

          <main className="min-w-0 w-full">
            {children}
          </main>
        </div>

        <footer className="mt-14 border-t border-white/10 pt-7 sm:mt-20 sm:pt-9">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
                FORSTEK / SUPPORT
              </p>

              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-white">
                Need assistance?
              </h3>

              <p className="text-sm leading-6 text-white/45">
                Have a question about your account or an order? Our customer
                service team is here to help.
              </p>
            </div>

            <div className="sm:shrink-0">
              <UnderlineLink href="/customer-service">
                Customer Service
              </UnderlineLink>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-2 border-t border-white/[0.06] pt-5 text-[10px] uppercase tracking-[0.12em] text-white/30 sm:flex-row sm:items-center sm:justify-between">
            <span>FORSTEK</span>
            <span>Account & Customer Support</span>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default AccountLayout
