
"use client"

import { useActionState } from "react"

import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)

  const fieldClass =
    "w-full h-12 px-4 bg-[#17181b] border border-white/10 text-white text-sm placeholder:text-white/30 outline-none focus:border-white/40 transition-colors"

  const labelClass =
    "block text-xs font-medium text-white/65 mb-2"

  return (
    <div
      className="w-full flex flex-col"
      data-testid="register-page"
    >
      <div className="mb-7">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/35 mb-3">
          FORSTEK / ACCOUNT
        </p>

        <h2 className="text-2xl font-semibold tracking-tight text-white">
          Create your account
        </h2>

        <p className="text-sm leading-6 text-white/45 mt-2">
          Register to manage your orders and account details.
        </p>
      </div>

      {message?.state === "verification_required" && (
        <div
          className="w-full mb-5 p-4 border border-emerald-500/20 bg-emerald-500/5 text-sm text-white/75 leading-6"
          data-testid="register-verification-message"
        >
          We sent a verification link to{" "}
          <strong className="text-white">{message.email}</strong>.
          Please check your inbox to verify your email, then sign in.
        </div>
      )}

      <form className="w-full flex flex-col gap-5" action={formAction}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="register-first-name">
              First name <span className="text-white/35">*</span>
            </label>
            <input
              id="register-first-name"
              className={fieldClass}
              name="first_name"
              placeholder="First name"
              required
              autoComplete="given-name"
              data-testid="first-name-input"
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="register-last-name">
              Last name <span className="text-white/35">*</span>
            </label>
            <input
              id="register-last-name"
              className={fieldClass}
              name="last_name"
              placeholder="Last name"
              required
              autoComplete="family-name"
              data-testid="last-name-input"
            />
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="register-email">
            Email <span className="text-white/35">*</span>
          </label>
          <input
            id="register-email"
            className={fieldClass}
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            autoComplete="email"
            data-testid="email-input"
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="register-phone">
            Phone
          </label>
          <input
            id="register-phone"
            className={fieldClass}
            name="phone"
            type="tel"
            placeholder="Your phone number"
            autoComplete="tel"
            data-testid="phone-input"
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="register-password">
            Password <span className="text-white/35">*</span>
          </label>
          <input
            id="register-password"
            className={fieldClass}
            name="password"
            type="password"
            placeholder="Create a password"
            required
            autoComplete="new-password"
            data-testid="password-input"
          />
        </div>

        <ErrorMessage
          error={message?.state === "error" ? message.error : null}
          data-testid="register-error"
        />

        <p className="text-xs leading-6 text-white/40">
          By creating an account, you agree to FORSTEK's{" "}
          <LocalizedClientLink
            href="/content/privacy-policy"
            className="text-white/75 underline underline-offset-4 hover:text-white"
          >
            Privacy Policy
          </LocalizedClientLink>{" "}
          and{" "}
          <LocalizedClientLink
            href="/content/terms-of-use"
            className="text-white/75 underline underline-offset-4 hover:text-white"
          >
            Terms of Use
          </LocalizedClientLink>
          .
        </p>

        <SubmitButton
          className="!w-full !h-12 !bg-white !text-black hover:!bg-white/85 !border-0 !rounded-none !text-sm !font-semibold transition-colors"
          data-testid="register-button"
        >
          Create account
        </SubmitButton>
      </form>

      <div className="mt-7 pt-6 border-t border-white/10 text-center">
        <span className="text-sm text-white/45">
          Already have an account?{" "}
        </span>

        <button
          type="button"
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="text-sm text-white font-medium underline underline-offset-4 hover:text-white/65 transition-colors"
        >
          Sign in
        </button>
      </div>
    </div>
  )
}

export default Register
