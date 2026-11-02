
"use client"

import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { confirmEmailVerification } from "@lib/data/customer"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type VerificationState = "verifying" | "success" | "error"

const VerifyAccount = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [state, setState] = useState<VerificationState>("verifying")
  const confirmed = useRef(false)

  useEffect(() => {
    if (confirmed.current) return
    confirmed.current = true

    if (!token) {
      setState("error")
      return
    }

    confirmEmailVerification(token)
      .then(({ success }) => setState(success ? "success" : "error"))
      .catch(() => setState("error"))
  }, [token])

  return (
    <div
      className="w-full max-w-md mx-auto flex flex-col items-center text-center px-6 py-10"
      data-testid="verify-account-page"
    >
      <span className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-5">
        FORSTEK / ACCOUNT
      </span>

      <div className="w-14 h-14 border border-white/15 flex items-center justify-center mb-6">
        {state === "verifying" && (
          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        )}

        {state === "success" && (
          <span className="text-2xl text-emerald-400">✓</span>
        )}

        {state === "error" && (
          <span className="text-2xl text-red-400">!</span>
        )}
      </div>

      <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white mb-3">
        {state === "verifying"
          ? "Verifying your email"
          : state === "success"
            ? "Email verified"
            : "Verification failed"}
      </h1>

      <p
        className="text-sm leading-6 text-white/50 max-w-sm"
        aria-live="polite"
      >
        {state === "verifying" &&
          "Please wait while we confirm your email address."}

        {state === "success" &&
          "Your email address has been verified. You can now sign in to your account."}

        {state === "error" &&
          "This verification link is invalid or has expired. You can sign in to request a new verification email."}
      </p>

      {state !== "verifying" && (
        <LocalizedClientLink
          href="/account"
          className="mt-8 w-full sm:w-auto min-w-48 px-8 py-3 bg-white text-black text-sm font-semibold text-center hover:bg-white/85 transition-colors"
        >
          Go to sign in
        </LocalizedClientLink>
      )}
    </div>
  )
}

export default VerifyAccount
