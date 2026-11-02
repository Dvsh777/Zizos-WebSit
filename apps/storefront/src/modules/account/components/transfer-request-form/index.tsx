
"use client"

import { createTransferRequest } from "@lib/data/orders"
import { CheckCircleMiniSolid, XCircleSolid } from "@medusajs/icons"
import { IconButton } from "@modules/common/components/ui"
import { useActionState, useEffect, useState } from "react"
import { SubmitButton } from "@modules/checkout/components/submit-button"

export default function TransferRequestForm() {
  const [showSuccess, setShowSuccess] = useState(false)

  const [state, formAction] = useActionState(createTransferRequest, {
    success: false,
    error: null,
    order: null,
  })

  useEffect(() => {
    if (state.success && state.order) {
      setShowSuccess(true)
    }
  }, [state.success, state.order])

  return (
    <section className="w-full border border-white/10 bg-[#0d0e10] p-5 sm:p-6">
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/35 mb-2">
            ACCOUNT / ORDERS
          </p>

          <h3 className="text-base font-semibold text-white">
            Order transfers
          </h3>

          <p className="text-sm leading-6 text-white/45 mt-2">
            Can't find an order associated with your account? Request to
            connect an existing order using its order ID.
          </p>
        </div>

        <form action={formAction} className="flex flex-col sm:flex-row gap-3">
          <input
            name="order_id"
            type="text"
            placeholder="Enter your order ID"
            required
            className="min-w-0 flex-1 h-11 px-4 bg-[#17181b] border border-white/10 text-white text-sm placeholder:text-white/30 outline-none focus:border-white/40 transition-colors"
          />

          <SubmitButton
            variant="secondary"
            className="!w-full sm:!w-auto !h-11 !px-6 !bg-white !text-black hover:!bg-white/85 !border-0 !rounded-none !text-sm !font-semibold"
          >
            Request transfer
          </SubmitButton>
        </form>

        {!state.success && state.error && (
          <p className="text-sm text-red-400" role="alert">
            {state.error}
          </p>
        )}

        {showSuccess && (
          <div className="flex items-start justify-between gap-4 p-4 border border-emerald-500/20 bg-emerald-500/5">
            <div className="flex gap-3 items-start">
              <CheckCircleMiniSolid className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />

              <div className="min-w-0">
                <p className="text-sm font-medium text-white">
                  Transfer request submitted
                </p>

                <p className="text-xs leading-5 text-white/45 mt-1">
                  Order {state.order?.id} — confirmation sent to{" "}
                  {state.order?.email}
                </p>
              </div>
            </div>

            <IconButton
              className="!h-fit !text-white/50 hover:!text-white"
              onClick={() => setShowSuccess(false)}
              aria-label="Dismiss success message"
            >
              <XCircleSolid className="w-4 h-4" />
            </IconButton>
          </div>
        )}
      </div>
    </section>
  )
}
