import * as React from "react"
import { cn } from "../../lib/utils"

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  sticky?: boolean
}

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className, sticky = true, ...props }, ref) => (
    <header
      ref={ref}
      className={cn(
        "w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        sticky && "sticky top-0 z-50",
        className
      )}
      {...props}
    />
  )
)
Header.displayName = "Header"

const HeaderContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("content-width flex h-16 items-center", className)}
    {...props}
  />
))
HeaderContent.displayName = "HeaderContent"

const HeaderNav = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    className={cn("flex items-center gap-6 text-sm", className)}
    {...props}
  />
))
HeaderNav.displayName = "HeaderNav"

export { Header, HeaderContent, HeaderNav }