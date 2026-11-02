
"use client"

import { useState } from "react"

import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState(LOGIN_VIEW.SIGN_IN)

  const isSignIn = currentView === LOGIN_VIEW.SIGN_IN

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#08090b] px-5 py-12 text-white sm:px-8 sm:py-16">
      <main className="w-full max-w-[460px]">
        <div className="mb-9 border-b border-white/10 pb-8 sm:mb-10">
          <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.25em] text-white/40">
            FORSTEK / ACCOUNT
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {isSignIn ? "Welcome back." : "Create your account."}
          </h1>

          <p className="mt-3 max-w-sm text-sm leading-6 text-white/45">
            {isSignIn
              ? "Sign in to access your account and keep track of your orders."
              : "Create an account to manage your orders and personal details."}
          </p>
        </div>

        {isSignIn ? (
          <Login setCurrentView={setCurrentView} />
        ) : (
          <Register setCurrentView={setCurrentView} />
        )}

        <div className="mt-10 border-t border-white/[0.07] pt-5">
          <p className="text-[10px] uppercase tracking-[0.15em] text-white/30">
            FORSTEK — Customer Account
          </p>
        </div>
      </main>
    </div>
  )
}

export default LoginTemplate
