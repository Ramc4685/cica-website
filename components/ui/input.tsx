import * as React from "react"

import { cn } from "@/lib/utils"
import { fieldSurface } from "@/components/ui/field-styles"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input type={type} className={cn(fieldSurface, "h-[52px] py-2", className)} ref={ref} {...props} />
  ),
)
Input.displayName = "Input"

export { Input }
