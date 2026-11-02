
"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import useToggleState from "@lib/hooks/use-toggle-state"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"
import { Fragment } from "react"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import { Locale } from "@lib/data/locales"

const SideMenuItems = {
  Home: "/",
  Store: "/store",
  Account: "/account",
  Cart: "/cart",
}

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

const SideMenu = ({
  regions,
  locales,
  currentLocale,
}: SideMenuProps) => {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()

  return (
    <div className="h-full">
      <div className="flex h-full items-center">
        <Popover className="flex h-full">
          {({ open, close }) => (
            <>
              {/* Menu trigger */}
              <Popover.Button
                data-testid="nav-menu-button"
                className="group flex h-full items-center gap-3 text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400 transition-colors hover:text-white focus:outline-none"
              >
                <span className="flex flex-col gap-[5px]">
                  <span className="h-px w-5 bg-current transition-all duration-300 group-hover:w-7" />
                  <span className="h-px w-3 bg-current transition-all duration-300 group-hover:w-5" />
                </span>
                Menu
              </Popover.Button>

              {/* Background overlay */}
              {open && (
                <div
                  className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
                  onClick={close}
                  data-testid="side-menu-backdrop"
                  aria-hidden="true"
                />
              )}

              {/* Navigation panel */}
              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-300"
                enterFrom="opacity-0 -translate-x-4"
                enterTo="opacity-100 translate-x-0"
                leave="transition ease-in duration-200"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 -translate-x-4"
              >
                <PopoverPanel
                  data-testid="nav-menu-popup"
                  className="fixed inset-y-0 left-0 z-[61] m-0 flex h-dvh max-h-dvh w-[min(420px,88vw)] flex-col justify-between overflow-y-auto border-r border-white/[0.10] bg-[#09090b] p-7 text-white shadow-[20px_0_80px_rgba(0,0,0,0.65)] sm:p-10"
                >

                  {/* Top section */}
                  <div>
                    <div className="flex items-center justify-between border-b border-white/[0.10] pb-7">

                      <LocalizedClientLink
                        href="/"
                        onClick={close}
                        className="text-sm font-semibold tracking-[0.22em] text-white"
                      >
                        FORSTEK
                      </LocalizedClientLink>

                      <button
                        data-testid="close-menu-button"
                        onClick={close}
                        aria-label="Close menu"
                        className="flex h-10 w-10 items-center justify-center border border-white/[0.12] text-zinc-400 transition-all hover:border-white hover:bg-white hover:text-black"
                      >
                        <XMark className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Navigation links */}
                    <div className="mb-5 mt-12">
                      <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                        Navigation
                      </span>
                    </div>

                    <ul className="flex flex-col">
                      {Object.entries(SideMenuItems).map(
                        ([name, href], index) => (
                          <li key={name}>
                            <LocalizedClientLink
                              href={href}
                              onClick={close}
                              data-testid={`${name.toLowerCase()}-link`}
                              className="group flex items-center justify-between border-b border-white/[0.08] py-5 transition-colors hover:border-white/25"
                            >
                              <div className="flex items-center gap-5">
                                <span className="font-mono text-[10px] text-zinc-600 transition-colors group-hover:text-white">
                                  0{index + 1}
                                </span>

                                <span className="text-[2rem] font-medium leading-none tracking-[-0.045em] text-zinc-400 transition-all duration-300 group-hover:translate-x-2 group-hover:text-white sm:text-[2.5rem]">
                                  {name}
                                </span>
                              </div>

                              <ArrowRightMini className="h-5 w-5 text-zinc-600 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 group-hover:text-white" />
                            </LocalizedClientLink>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  {/* Bottom section */}
                  <div className="mt-16">

                    <div className="mb-7 border-t border-white/[0.10] pt-7">
                      <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                        Preferences
                      </span>
                    </div>

                    {/* Language */}
                    {!!locales?.length && (
                      <div
                        className="mb-6 flex items-center justify-between text-sm text-zinc-400 transition-colors hover:text-white"
                        onMouseEnter={languageToggleState.open}
                        onMouseLeave={languageToggleState.close}
                      >
                        <LanguageSelect
                          toggleState={languageToggleState}
                          locales={locales}
                          currentLocale={currentLocale}
                        />

                        <ArrowRightMini
                          className={clx(
                            "h-4 w-4 transition-transform duration-200",
                            languageToggleState.state && "-rotate-90"
                          )}
                        />
                      </div>
                    )}

                    {/* Country */}
                    <div
                      className="flex items-center justify-between text-sm text-zinc-400 transition-colors hover:text-white"
                      onMouseEnter={countryToggleState.open}
                      onMouseLeave={countryToggleState.close}
                    >
                      {regions && (
                        <CountrySelect
                          toggleState={countryToggleState}
                          regions={regions}
                        />
                      )}

                      <ArrowRightMini
                        className={clx(
                          "h-4 w-4 transition-transform duration-200",
                          countryToggleState.state && "-rotate-90"
                        )}
                      />
                    </div>

                    {/* Footer */}
                    <div className="mt-10 flex items-center justify-between border-t border-white/[0.10] pt-6">
                      <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-zinc-600">
                        © {new Date().getFullYear()} FORSTEK
                      </span>

                      <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-zinc-600">
                        Tunisia
                      </span>
                    </div>

                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
