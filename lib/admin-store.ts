import { create } from "zustand"

interface AdminState {
  isAuthenticated: boolean
  isChecking: boolean
  currentUser: { id: string; name: string; email: string; role: string } | null
  login: (name: string, password: string) => Promise<boolean>
  logout: () => void
  checkAuth: () => void
}

const ADMIN_PASSWORD = "riseagain0976%" // Keep this password constant
const ADMIN_NAME = "AdminMaster" // Dummy admin name
const AUTH_KEY = "admin-auth"
const USER_KEY = "admin-user"

// Check localStorage on initialization - only on client
const getStoredAuth = (): boolean => {
  if (typeof window === "undefined") return false
  try {
    const stored = localStorage.getItem(AUTH_KEY)
    return stored === "true"
  } catch {
    return false
  }
}

const getStoredUser = () => {
  if (typeof window === "undefined") return null
  try {
    const stored = localStorage.getItem(USER_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export const useAdminStore = create<AdminState>((set, get) => ({
  // Initialize with localStorage value on client side
  isAuthenticated: typeof window !== "undefined" ? getStoredAuth() : false,
  isChecking: false,
  currentUser: typeof window !== "undefined" ? getStoredUser() : null,
  login: async (name: string, password: string) => {
    try {
      // Call API to verify credentials
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, password }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(AUTH_KEY, "true")
            localStorage.setItem(USER_KEY, JSON.stringify(result.user))
          } catch {
            // localStorage not available
          }
        }
        set({ isAuthenticated: true, currentUser: result.user })
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  },
  logout: () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(AUTH_KEY)
        localStorage.removeItem(USER_KEY)
      } catch {
        // localStorage not available
      }
    }
    set({ isAuthenticated: false, currentUser: null })
  },
  checkAuth: () => {
    // Only check on client side
    if (typeof window !== "undefined") {
      const authStatus = getStoredAuth()
      const user = getStoredUser()
      set({ isAuthenticated: authStatus, currentUser: user, isChecking: false })
    }
  },
}))

