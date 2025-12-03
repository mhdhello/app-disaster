"use client"

import { useEffect, useMemo } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAdminStore } from "@/lib/admin-store"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import {
  LayoutDashboard,
  FileWarning,
  Heart,
  Users,
  Shield,
  LogOut,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const adminMenuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Damage Reports",
    url: "/admin/reports",
    icon: FileWarning,
  },
  {
    title: "Donor Offers",
    url: "/admin/offers",
    icon: Heart,
  },
  {
    title: "User Management",
    url: "/admin/users",
    icon: Users,
  },
]

// Separate component for sidebar nav items to handle mobile closing
function SidebarNavItem({
  href,
  isActive,
  icon: Icon,
  title,
}: {
  href: string
  isActive: boolean
  icon: React.ElementType
  title: string
}) {
  const { setOpenMobile, isMobile } = useSidebar()
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    // Close mobile sidebar when link is clicked
    if (isMobile) {
      setOpenMobile(false)
    }
    // Use router.push for faster navigation
    e.preventDefault()
    router.push(href)
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className={cn(
          "w-full justify-start",
          isActive && "bg-primary text-primary-foreground"
        )}
      >
        <a href={href} onClick={handleClick}>
          <Icon className="h-4 w-4 shrink-0" />
          <span className="truncate">{title}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated)
  const logout = useAdminStore((state) => state.logout)
  const checkAuth = useAdminStore((state) => state.checkAuth)

  // Don't apply layout to login page - memoize to prevent dependency changes
  const isLoginPage = useMemo(() => pathname === "/admin/login", [pathname])

  useEffect(() => {
    // Check auth on mount - this will read from localStorage
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // If authenticated and on login page, redirect to dashboard
    if (isLoginPage && isAuthenticated) {
      router.push("/admin")
      return
    }
    
    // Redirect to login if not authenticated (only on client, and not already on login page)
    if (!isLoginPage && !isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, router, isLoginPage])

  // If on login page, render children without layout
  if (isLoginPage) {
    return <>{children}</>
  }

  // If not authenticated and not on login page, show nothing (will redirect)
  if (!isAuthenticated) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-border">
            <div className="flex items-center gap-2 px-3 sm:px-4 py-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h2 className="font-semibold text-sm sm:text-base text-foreground truncate">Admin Panel</h2>
                <p className="text-xs text-muted-foreground truncate">Flood Relief</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminMenuItems.map((item) => {
                    const Icon = item.icon
                    // Check if current pathname matches the route (exact match or starts with for nested routes)
                    const isActive = pathname === item.url || (item.url !== "/admin" && pathname?.startsWith(item.url))
                    return (
                      <SidebarNavItem key={item.url} href={item.url} isActive={isActive} icon={Icon} title={item.title} />
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-border p-4">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full justify-start gap-2 border-border text-foreground hover:bg-secondary"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex-1 min-w-0 overflow-hidden">
          <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 px-4">
            <SidebarTrigger />
            <div className="flex-1" />
          </header>
          <main className="flex-1 overflow-auto p-4 sm:p-6 w-full max-w-full">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

