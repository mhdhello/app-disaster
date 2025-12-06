"use client"

import { useEffect } from "react"
import { db } from "@/lib/firebase"

// This component ensures Firebase is initialized on the client side
export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Firebase is initialized when db is imported
    // This component just ensures it's loaded on the client
    if (typeof window !== "undefined" && db) {
      console.log("Firebase initialized")
    }
  }, [])

  return <>{children}</>
}
