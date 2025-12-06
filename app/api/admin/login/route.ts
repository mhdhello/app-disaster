import { NextRequest, NextResponse } from "next/server"
import { getFirestore } from "firebase-admin/firestore"
import bcrypt from "bcryptjs"
import { initializeApp, getApps, cert } from "firebase-admin/app"

// Initialize Firebase Admin
if (!getApps().length) {
  try {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      : null

    if (serviceAccount) {
      initializeApp({
        credential: cert(serviceAccount),
      })
    } else {
      initializeApp()
    }
  } catch (error) {
    console.error("Firebase Admin initialization error:", error)
  }
}

const adminDb = getFirestore()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, password } = body

    if (!name || !password) {
      return NextResponse.json(
        { error: "Name and password are required" },
        { status: 400 }
      )
    }

    // Find user by name in Firestore
    const usersRef = adminDb.collection("adminUsers")
    const snapshot = await usersRef.where("name", "==", name).limit(1).get()

    if (snapshot.empty) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    const userDoc = snapshot.docs[0]
    const userData = userDoc.data()

    // Check if user is active
    if (!userData.active) {
      return NextResponse.json(
        { error: "Account is inactive" },
        { status: 401 }
      )
    }

    // Verify password - check both bcrypt hash and plain text fallback for ADMIN_PASSWORD
    const ADMIN_PASSWORD = "riseagain0976%"
    let passwordValid = false

    if (userData.passwordHash) {
      // Verify against bcrypt hash
      passwordValid = await bcrypt.compare(password, userData.passwordHash)
    }

    // Fallback: if password matches ADMIN_PASSWORD directly (for backward compatibility)
    if (!passwordValid && password === ADMIN_PASSWORD) {
      passwordValid = true
    }

    if (!passwordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Update last login
    await userDoc.ref.update({
      lastLogin: new Date(),
    })

    return NextResponse.json({
      success: true,
      user: {
        id: userDoc.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      },
    })
  } catch (error: any) {
    console.error("Error during login:", error)
    return NextResponse.json(
      { error: error.message || "Login failed" },
      { status: 500 }
    )
  }
}
