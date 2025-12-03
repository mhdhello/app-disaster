import { create } from "zustand"

interface AdminState {
  isAuthenticated: boolean
  isChecking: boolean
  login: (password: string) => boolean
  logout: () => void
  checkAuth: () => void
}

const ADMIN_PASSWORD = "riseagain0976%" // Dummy password
const AUTH_KEY = "admin-auth"

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

export const useAdminStore = create<AdminState>((set, get) => ({
  // Initialize with localStorage value on client side
  isAuthenticated: typeof window !== "undefined" ? getStoredAuth() : false,
  isChecking: false,
  login: (password: string) => {
    if (password === ADMIN_PASSWORD) {
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(AUTH_KEY, "true")
        } catch {
          // localStorage not available
        }
      }
      set({ isAuthenticated: true })
      return true
    }
    return false
  },
  logout: () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(AUTH_KEY)
      } catch {
        // localStorage not available
      }
    }
    set({ isAuthenticated: false })
  },
  checkAuth: () => {
    // Only check on client side
    if (typeof window !== "undefined") {
      const authStatus = getStoredAuth()
      set({ isAuthenticated: authStatus, isChecking: false })
    }
  },
}))

