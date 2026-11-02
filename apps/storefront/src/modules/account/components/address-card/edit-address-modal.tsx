"use client"

import {
  deleteCustomerAddress,
  updateCustomerAddress,
} from "@lib/data/customer"
import useToggleState from "@lib/hooks/use-toggle-state"
import { PencilSquare as Edit, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import CountrySelect from "@modules/checkout/components/country-select"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import Modal from "@modules/common/components/modal"
import { Button, Heading, Text, clx } from "@modules/common/components/ui"
import Spinner from "@modules/common/icons/spinner"
import React, { useActionState, useEffect, useState } from "react"

type EditAddressProps = {
  region: HttpTypes.StoreRegion
  address: HttpTypes.StoreCustomerAddress
  isActive?: boolean
}

const EditAddress: React.FC<EditAddressProps> = ({
  region,
  address,
  isActive = false,
}) => {
  const [removing, setRemoving] = useState(false)
  const [successState, setSuccessState] = useState(false)
  const { state, open, close: closeModal } = useToggleState(false)

  const [formState, formAction] = useActionState(updateCustomerAddress, {
    success: false,
    error: null,
  } as { success: boolean; error: string | null })

  const close = () => {
    setSuccessState(false)
    closeModal()
  }

  useEffect(() => {
    if (successState) {
      close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successState])

  useEffect(() => {
    if (formState.success) {
      setSuccessState(true)
    }
  }, [formState])

  const removeAddress = async () => {
    setRemoving(true)

    try {
      await deleteCustomerAddress(address.id)
    } finally {
      setRemoving(false)
    }
  }

  return (
    <>
      <div
        className={clx(
          "group flex min-h-[220px] h-full w-full flex-col justify-between border bg-[#111111] p-5 transition-colors duration-200",
          isActive
            ? "border-[#aaaaaa]"
            : "border-[#303030] hover:border-[#555555]"
        )}
        data-testid="address-container"
      >
        <div className="flex flex-col">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.2em] text-[#777777]">
                Saved address
              </span>

              <Heading
                className="text-left text-base font-semibold text-[#eeeeee]"
                data-testid="address-name"
              >
                {address.first_name} {address.last_name}
              </Heading>
            </div>

            {isActive && (
              <span className="shrink-0 border border-[#454545] px-2 py-1 text-[9px] font-medium uppercase tracking-[0.12em] text-[#cccccc]">
                Active
              </span>
            )}
          </div>

          {address.company && (
            <Text
              className="mb-1 text-xs text-[#aaaaaa]"
              data-testid="address-company"
            >
              {address.company}
            </Text>
          )}

          <Text className="flex flex-col text-left text-sm leading-6 text-[#999999]">
            <span data-testid="address-address">
              {address.address_1}
              {address.address_2 && <span>, {address.address_2}</span>}
            </span>

            <span data-testid="address-postal-city">
              {address.postal_code}, {address.city}
            </span>

            <span data-testid="address-province-country">
              {address.province && `${address.province}, `}
              {address.country_code?.toUpperCase()}
            </span>
          </Text>

          {address.phone && (
            <span className="mt-2 text-xs text-[#777777]">
              {address.phone}
            </span>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-[#292929] pt-4">
          <button
            type="button"
            className="flex items-center gap-2 text-xs font-medium text-[#aaaaaa] transition-colors hover:text-white"
            onClick={open}
            data-testid="address-edit-button"
          >
            <Edit className="h-4 w-4" />
            Edit address
          </button>

          <button
            type="button"
            className="flex items-center gap-2 text-xs font-medium text-[#777777] transition-colors hover:text-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={removeAddress}
            disabled={removing}
            data-testid="address-delete-button"
          >
            {removing ? (
              <Spinner />
            ) : (
              <Trash className="h-4 w-4" />
            )}
            {removing ? "Removing..." : "Remove"}
          </button>
        </div>
      </div>

      <Modal isOpen={state} close={close} data-testid="edit-address-modal">
        <Modal.Title>
          <div className="mb-2">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#888888]">
              Address book
            </span>

            <Heading className="mt-1 text-[#eeeeee]">
              Edit address
            </Heading>
          </div>
        </Modal.Title>

        <form action={formAction}>
          <input type="hidden" name="addressId" value={address.id} />

          <Modal.Body>
            <div className="grid grid-cols-1 gap-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input
                  label="First name"
                  name="first_name"
                  required
                  autoComplete="given-name"
                  defaultValue={address.first_name || undefined}
                  data-testid="first-name-input"
                />

                <Input
                  label="Last name"
                  name="last_name"
                  required
                  autoComplete="family-name"
                  defaultValue={address.last_name || undefined}
                  data-testid="last-name-input"
                />
              </div>

              <Input
                label="Company"
                name="company"
                autoComplete="organization"
                defaultValue={address.company || undefined}
                data-testid="company-input"
              />

              <Input
                label="Address"
                name="address_1"
                required
                autoComplete="address-line1"
                defaultValue={address.address_1 || undefined}
                data-testid="address-1-input"
              />

              <Input
                label="Apartment, suite, etc."
                name="address_2"
                autoComplete="address-line2"
                defaultValue={address.address_2 || undefined}
                data-testid="address-2-input"
              />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[140px_1fr]">
                <Input
                  label="Postal code"
                  name="postal_code"
                  required
                  autoComplete="postal-code"
                  defaultValue={address.postal_code || undefined}
                  data-testid="postal-code-input"
                />

                <Input
                  label="City"
                  name="city"
                  required
                  autoComplete="locality"
                  defaultValue={address.city || undefined}
                  data-testid="city-input"
                />
              </div>

              <Input
                label="Province / State"
                name="province"
                autoComplete="address-level1"
                defaultValue={address.province || undefined}
                data-testid="state-input"
              />

              <CountrySelect
                name="country_code"
                region={region}
                required
                autoComplete="country"
                defaultValue={address.country_code || undefined}
                data-testid="country-select"
              />

              <Input
                label="Phone"
                name="phone"
                autoComplete="tel"
                defaultValue={address.phone || undefined}
                data-testid="phone-input"
              />
            </div>

            {formState.error && (
              <div className="mt-3 border border-rose-900/50 bg-rose-950/20 px-3 py-2 text-sm text-rose-400">
                {formState.error}
              </div>
            )}
          </Modal.Body>

          <Modal.Footer>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="reset"
                variant="secondary"
                onClick={close}
                className="h-10 w-full border border-[#383838] bg-transparent text-[#cccccc] hover:bg-[#222222] sm:w-auto"
                data-testid="cancel-button"
              >
                Cancel
              </Button>

              <SubmitButton
                data-testid="save-button"
                className="h-10 w-full sm:w-auto"
              >
                Save changes
              </SubmitButton>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}

export default EditAddress