import * as React from "react"
import { cn } from "../../lib/utils"

const GradientBackground = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "fixed inset-0 -z-10 bg-background transition-all duration-500",
      "bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(27,20,100,0.15),rgba(255,255,255,0))]",
      className
    )}
    {...props}
  />
))
GradientBackground.displayName = "GradientBackground"

export { GradientBackground }