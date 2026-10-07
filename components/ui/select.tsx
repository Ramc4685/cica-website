import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { fieldSurface } from "@/components/ui/field-styles"

/** Native <select> in the CICA field style, so it works and posts without JavaScript. */
const Select = React.forwardRef<HTMLSelectElement, React.ComponentProps<"select">>(
  ({ className, children, ...props }, ref) => (
    <div className="relative">
      <select className={cn(fieldSurface, "h-[52px] cursor-pointer appearance-none py-2 pr-12", className)} ref={ref} {...props}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-green" aria-hidden="true" />
    </div>
  ),
)
Select.displayName = "Select"

export { Select }
