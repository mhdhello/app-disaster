"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FileWarning, Heart, Map, Menu, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/report-damage", label: "Report Flood Damage", icon: FileWarning },
  { href: "/offer-help", label: "Offer Help & Donations", icon: Heart },
  { href: "/maps", label: "Maps", icon: Map },
  { href: "/admin", label: "Admin", icon: Shield },
]

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-lg overflow-hidden">
              <Image
                src="/Logo.png"
                alt="Sri Lanka Flood Relief Logo"
                fill
                className="object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-foreground">Rebuild Sri Lanka</h1>
              <p className="text-xs text-muted-foreground">Emergency Response Portal</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href === "/admin" && pathname?.startsWith("/admin"))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            {/* Emergency badge - hidden on small screens */}
            <div className="hidden md:flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive"></span>
              </span>
              <span className="text-xs font-medium text-destructive">Emergency Active</span>
            </div>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="text-foreground">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-card border-border p-0">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  {/* Mobile menu header */}
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-lg overflow-hidden">
                        <Image
                          src="/Logo.png"
                          alt="Sri Lanka Flood Relief Logo"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-foreground">SL Flood Relief</h2>
                        <p className="text-xs text-muted-foreground">Emergency Portal</p>
                      </div>
                    </div>
                  </div>

                  {/* Emergency badge for mobile */}
                  <div className="mx-4 mt-4 flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-2 justify-center">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive"></span>
                    </span>
                    <span className="text-xs font-medium text-destructive">Emergency Active</span>
                  </div>

                  {/* Mobile navigation links */}
                  <nav className="flex flex-col gap-1 p-4 flex-1">
                    {navItems.map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href || (item.href === "/admin" && pathname?.startsWith("/admin"))
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-colors",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </Link>
                      )
                    })}
                  </nav>

                  {/* Mobile menu footer */}
                  <div className="p-4 border-t border-border">
                    <p className="text-xs text-center text-muted-foreground">Sri Lanka Flood Relief Emergency Portal</p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
