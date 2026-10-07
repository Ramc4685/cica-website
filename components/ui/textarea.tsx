import * as React from "react"

import { cn } from "@/lib/utils"
import { fieldSurface } from "@/components/ui/field-styles"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => (
    <textarea className={cn(fieldSurface, "min-h-[140px] py-3.5 leading-relaxed", className)} ref={ref} {...props} />
  ),
)
Textarea.displayName = "Textarea"

export { Textarea }
