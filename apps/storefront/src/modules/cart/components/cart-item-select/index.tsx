
"use client"

import { IconBadge, clx } from "@modules/common/components/ui"
import {
  SelectHTMLAttributes,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"

import ChevronDown from "@modules/common/icons/chevron-down"

type NativeSelectProps = {
  placeholder?: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "size">

const CartItemSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ placeholder = "Select...", className, children, ...props }, ref) => {
    const innerRef = useRef<HTMLSelectElement>(null)
    const [isPlaceholder, setIsPlaceholder] = useState(false)

    useImperativeHandle(ref, () => innerRef.current as HTMLSelectElement)

    useEffect(() => {
      const select = innerRef.current

      if (!select) return

      const updatePlaceholder = () => {
        setIsPlaceholder(select.value === "")
      }

      updatePlaceholder()
      select.addEventListener("change", updatePlaceholder)

      return () => {
        select.removeEventListener("change", updatePlaceholder)
      }
    }, [])

    return (
      <div className="w-full">
        <IconBadge
          onFocus={() => innerRef.current?.focus()}
          onBlur={() => innerRef.current?.blur()}
          className={clx(
            "group relative flex h-10 items-center rounded-none border border-white/15 bg-[#111214] text-white transition-colors hover:border-white/35 focus-within:border-white/50",
            className,
            {
              "text-white/40": isPlaceholder,
            }
          )}
        >
          <select
            ref={innerRef}
            {...props}
            className="h-full w-full cursor-pointer appearance-none rounded-none border-0 bg-transparent py-0 pl-3 pr-8 text-xs font-medium text-white outline-none focus:ring-0"
          >
            <option disabled value="" className="bg-[#111214] text-white">
              {placeholder}
            </option>
            {children}
          </select>

          <span className="pointer-events-none absolute right-2 flex items-center text-white/40 transition-colors group-hover:text-white">
            <ChevronDown />
          </span>
        </IconBadge>
      </div>
    )
  }
)

CartItemSelect.displayName = "CartItemSelect"

export default CartItemSelect
