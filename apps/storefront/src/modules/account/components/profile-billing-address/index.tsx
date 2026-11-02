
"use client"

import React, { useActionState, useEffect, useMemo } from "react"

import Input from "@modules/common/components/input"
import NativeSelect from "@modules/common/components/native-select"

import { addCustomerAddress, updateCustomerAddress } from "@lib/data/customer"
import { HttpTypes } from "@medusajs/types"
import AccountInfo from "../account-info"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
  regions: HttpTypes.StoreRegion[]
}

const ProfileBillingAddress: React.FC<MyInformationProps> = ({
  customer,
  regions,
}) => {
  const regionOptions = useMemo(() => {
    return (
      regions
        ?.flatMap((region) =>
          region.countries?.map((country) => ({
            value: country.iso_2,
            label: country.display_name,
          })) || []
        ) || []
    )
  }, [regions])

  const [successState, setSuccessState] = React.useState(false)

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )

  const initialState: Record<string, unknown> = {
    isDefaultBilling: true,
    isDefaultShipping: false,
    error: false,
    success: false,
  }

  if (billingAddress) {
    initialState.addressId = billingAddress.id
  }

  const [state, formAction] = useActionState(
    billingAddress ? updateCustomerAddress : addCustomerAddress,
    initialState
  )

  const clearState = () => setSuccessState(false)

  useEffect(() => {
    setSuccessState(!!state.success)
  }, [state])

  const currentInfo = useMemo(() => {
    if (!billingAddress) {
      return "No billing address"
    }

    const country =
      regionOptions.find(
        (country) => country.value === billingAddress.country_code
      )?.label || billingAddress.country_code?.toUpperCase()

    return (
      <div className="flex flex-col gap-1 text-sm font-medium" data-testid="current-info">
        <span>
          {billingAddress.first_name} {billingAddress.last_name}
        </span>
        {billingAddress.company && <span>{billingAddress.company}</span>}
        <span>
          {billingAddress.address_1}
          {billingAddress.address_2 ? `, ${billingAddress.address_2}` : ""}
        </span>
        <span>
          {billingAddress.postal_code}, {billingAddress.city}
        </span>
        <span>{country}</span>
      </div>
    )
  }, [billingAddress, regionOptions])

  return (
    <form
      action={formAction}
      onReset={clearState}
      className="w-full min-w-0"
    >
      <input
        type="hidden"
        name="addressId"
        value={billingAddress?.id || ""}
      />

      <AccountInfo
        label="Billing address"
        currentInfo={currentInfo}
        isSuccess={successState}
        isError={!!state.error}
        errorMessage={
          typeof state.error === "string" ? state.error : undefined
        }
        clearState={clearState}
        data-testid="account-billing-address-editor"
      >
        <div className="flex flex-col gap-4 w-full min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First name"
              name="first_name"
              defaultValue={billingAddress?.first_name || undefined}
              required
              autoComplete="given-name"
              data-testid="billing-first-name-input"
            />

            <Input
              label="Last name"
              name="last_name"
              defaultValue={billingAddress?.last_name || undefined}
              required
              autoComplete="family-name"
              data-testid="billing-last-name-input"
            />
          </div>

          <Input
            label="Company"
            name="company"
            defaultValue={billingAddress?.company || undefined}
            data-testid="billing-company-input"
          />

          <Input
            label="Phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            defaultValue={billingAddress?.phone ?? customer.phone ?? ""}
            data-testid="billing-phone-input"
          />

          <Input
            label="Address"
            name="address_1"
            defaultValue={billingAddress?.address_1 || undefined}
            required
            autoComplete="address-line1"
            data-testid="billing-address-1-input"
          />

          <Input
            label="Apartment, suite, etc."
            name="address_2"
            defaultValue={billingAddress?.address_2 || undefined}
            autoComplete="address-line2"
            data-testid="billing-address-2-input"
          />

          <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,140px)_minmax(0,1fr)] gap-4">
            <Input
              label="Postal code"
              name="postal_code"
              defaultValue={billingAddress?.postal_code || undefined}
              required
              autoComplete="postal-code"
              data-testid="billing-postcal-code-input"
            />

            <Input
              label="City"
              name="city"
              defaultValue={billingAddress?.city || undefined}
              required
              autoComplete="address-level2"
              data-testid="billing-city-input"
            />
          </div>

          <Input
            label="Province"
            name="province"
            defaultValue={billingAddress?.province || undefined}
            autoComplete="address-level1"
            data-testid="billing-province-input"
          />

          <div className="flex flex-col gap-2">
            <label
              htmlFor="billing-country-code"
              className="text-xs font-medium text-white/65"
            >
              Country <span className="text-white/35">*</span>
            </label>

            <NativeSelect
              name="country_code"
              defaultValue={billingAddress?.country_code || ""}
              required
              data-testid="billing-country-code-select"
            >
              <option value="">Select a country</option>
              {regionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </NativeSelect>
          </div>
        </div>
      </AccountInfo>
    </form>
  )
}

export default ProfileBillingAddress
