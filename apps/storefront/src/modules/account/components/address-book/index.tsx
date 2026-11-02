import React from "react"

import AddAddress from "../address-card/add-address"
import EditAddress from "../address-card/edit-address-modal"
import { HttpTypes } from "@medusajs/types"

type AddressBookProps = {
  customer: HttpTypes.StoreCustomer
  region: HttpTypes.StoreRegion
}

const AddressBook: React.FC<AddressBookProps> = ({ customer, region }) => {
  const { addresses = [] } = customer

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-2 border-b border-[#292929] pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#777777]">
            Your account
          </span>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#eeeeee]">
            Saved addresses
          </h2>
          <p className="mt-1 text-sm text-[#888888]">
            Manage the addresses used for your orders.
          </p>
        </div>

        <span className="text-xs text-[#777777]">
          {addresses.length} {addresses.length === 1 ? "address" : "addresses"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <AddAddress region={region} addresses={addresses} />

        {addresses.map((address) => (
          <EditAddress
            region={region}
            address={address}
            key={address.id}
          />
        ))}
      </div>

      {addresses.length === 0 && (
        <p className="mt-4 text-xs text-[#777777]">
          You haven't saved an address yet. Add one to make future orders easier.
        </p>
      )}
    </div>
  )
}

export default AddressBook