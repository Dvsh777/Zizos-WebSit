
"use client"

import { Dialog, Transition } from "@headlessui/react"
import { XMark } from "@medusajs/icons"
import React, { Fragment } from "react"

type SearchDrawerProps = {
  isOpen: boolean
  close: () => void
  children: React.ReactNode
}

const SearchDrawer = ({ isOpen, close, children }: SearchDrawerProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[75]" onClose={close}>
        {/* Dark overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-4 sm:pl-10">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-200"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel
                className="pointer-events-auto flex h-full w-screen max-w-md flex-col border-l border-white/[0.10] bg-[#09090b] text-white shadow-[-30px_0_100px_rgba(0,0,0,0.5)]"
                data-testid="search-drawer"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/[0.09] px-6 py-6">
                  <div>
                    <Dialog.Title className="text-sm font-semibold tracking-wide text-white">
                      Search
                    </Dialog.Title>
                    <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-600">
                      Discover FORSTEK
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={close}
                    aria-label="Close search"
                    className="flex h-9 w-9 items-center justify-center border border-white/[0.10] text-zinc-400 transition-all hover:border-white/40 hover:bg-white hover:text-black"
                    data-testid="close-search-drawer"
                  >
                    <XMark />
                  </button>
                </div>

                {/* Search content */}
                <div className="flex min-h-0 flex-1 flex-col">
                  {children}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-white/[0.08] px-6 py-4">
                  <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-zinc-600">
                    FORSTEK / SEARCH
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-zinc-700">
                    Tunisia
                  </span>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default SearchDrawer
