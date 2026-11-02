import React, { useEffect } from "react"
import { Disclosure } from "@headlessui/react"
import { Badge, Button, clx } from "@modules/common/components/ui"
import { useFormStatus } from "react-dom"

import useToggleState from "@lib/hooks/use-toggle-state"

type AccountInfoProps = {
  label: string
  currentInfo: string | React.ReactNode
  isSuccess?: boolean
  isError?: boolean
  errorMessage?: string
  clearState: () => void
  children?: React.ReactNode
  "data-testid"?: string
}

const AccountInfo = ({
  label,
  currentInfo,
  isSuccess,
  isError,
  clearState,
  errorMessage = "An error occurred, please try again",
  children,
  "data-testid": dataTestid,
}: AccountInfoProps) => {
  const { state, close, toggle } = useToggleState()
  const { pending } = useFormStatus()

  const handleToggle = () => {
    clearState()
    setTimeout(() => toggle(), 100)
  }

  useEffect(() => {
    if (isSuccess) {
      close()
    }
  }, [isSuccess, close])

  return (
    <section
      className="w-full border-b border-[#292929] py-5 sm:py-6"
      data-testid={dataTestid}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#777777]">
            {label}
          </span>

          <div className="min-w-0 text-sm font-medium text-[#eeeeee]">
            {typeof currentInfo === "string" ? (
              <span
                className="break-words"
                data-testid="current-info"
              >
                {currentInfo}
              </span>
            ) : (
              currentInfo
            )}
          </div>
        </div>

        <Button
          variant="secondary"
          className={clx(
            "h-9 w-full border border-[#383838] bg-transparent px-5 text-xs text-[#cccccc] transition-colors hover:border-[#777777] hover:bg-[#1b1b1b] hover:text-white sm:w-[110px]",
            {
              "border-[#777777] bg-[#1b1b1b] text-white": state,
            }
          )}
          onClick={handleToggle}
          type={state ? "reset" : "button"}
          data-testid="edit-button"
          data-active={state}
        >
          {state ? "Cancel" : "Edit"}
        </Button>
      </div>

      {/* Success message */}
      <Disclosure>
        <Disclosure.Panel
          static
          className={clx(
            "overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out",
            {
              "max-h-[1000px] opacity-100": isSuccess,
              "max-h-0 opacity-0": !isSuccess,
            }
          )}
          data-testid="success-message"
        >
          <div className="my-4 border border-emerald-900/50 bg-emerald-950/20 px-3 py-3 text-xs text-emerald-400">
            {label} updated successfully.
          </div>
        </Disclosure.Panel>
      </Disclosure>

      {/* Error message */}
      <Disclosure>
        <Disclosure.Panel
          static
          className={clx(
            "overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out",
            {
              "max-h-[1000px] opacity-100": isError,
              "max-h-0 opacity-0": !isError,
            }
          )}
          data-testid="error-message"
        >
          <div className="my-4 border border-rose-900/50 bg-rose-950/20 px-3 py-3 text-xs text-rose-400">
            {errorMessage}
          </div>
        </Disclosure.Panel>
      </Disclosure>

      {/* Editable form */}
      <Disclosure>
        <Disclosure.Panel
          static
          className={clx(
            "overflow-visible transition-[max-height,opacity] duration-300 ease-in-out",
            {
              "max-h-[1000px] opacity-100": state,
              "max-h-0 opacity-0": !state,
            }
          )}
        >
          <div className="flex flex-col gap-y-3 border-t border-[#292929] pt-5">
            <div>{children}</div>

            <div className="flex justify-stretch pt-2 sm:justify-end">
              <Button
                isLoading={pending}
                className="h-10 w-full border border-[#eeeeee] bg-[#eeeeee] text-xs font-semibold text-black transition-colors hover:bg-white sm:max-w-[160px]"
                type="submit"
                data-testid="save-button"
              >
                Save changes
              </Button>
            </div>
          </div>
        </Disclosure.Panel>
      </Disclosure>
    </section>
  )
}

export default AccountInfo