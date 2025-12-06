import { NextRequest, NextResponse } from "next/server"
import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore, FieldValue } from "firebase-admin/firestore"
import bcrypt from "bcryptjs"

// Initialize Firebase Admin
if (!getApps().length) {
  try {
    // Try to initialize with service account from environment variables
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      : null

    if (serviceAccount) {
      initializeApp({
        credential: cert(serviceAccount),
      })
    } else {
      // Fallback: initialize with default credentials (for local development)
      // This requires GOOGLE_APPLICATION_CREDENTIALS environment variable
      initializeApp()
    }
  } catch (error) {
    console.error("Firebase Admin initialization error:", error)
    // Continue anyway - will fail when trying to use auth
  }
}

const adminAuth = getAuth()
const adminDb = getFirestore()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, role, active } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    // Hash password with bcrypt
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user in Firebase Auth
    let firebaseUser
    try {
      firebaseUser = await adminAuth.createUser({
        email,
        password,
        displayName: name,
        emailVerified: false,
        disabled: !active,
      })
    } catch (authError: any) {
      console.error("Firebase Auth error:", authError)
      return NextResponse.json(
        { error: `Failed to create auth user: ${authError.message}` },
        { status: 400 }
      )
    }

    // Store user data in Firestore with hashed password
    const userData = {
      name,
      email,
      passwordHash: hashedPassword, // Store bcrypt hash
      role: role || "viewer",
      active: active !== undefined ? active : true,
      firebaseUid: firebaseUser.uid,
      createdAt: FieldValue.serverTimestamp(),
    }

    const docRef = await adminDb.collection("adminUsers").add(userData)

    return NextResponse.json({
      success: true,
      userId: docRef.id,
      firebaseUid: firebaseUser.uid,
    })
  } catch (error: any) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create user" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, email, password, role, active, firebaseUid } = body

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const updates: any = {}

    // Update Firestore document
    if (name !== undefined) updates.name = name
    if (email !== undefined) updates.email = email
    if (role !== undefined) updates.role = role
    if (active !== undefined) updates.active = active

    // Hash password if provided
    if (password) {
      const saltRounds = 10
      updates.passwordHash = await bcrypt.hash(password, saltRounds)
    }

    // Update Firebase Auth user if firebaseUid is provided
    if (firebaseUid) {
      const authUpdates: any = {}
      if (name !== undefined) authUpdates.displayName = name
      if (email !== undefined) authUpdates.email = email
      if (active !== undefined) authUpdates.disabled = !active
      if (password) authUpdates.password = password

      if (Object.keys(authUpdates).length > 0) {
        try {
          await adminAuth.updateUser(firebaseUid, authUpdates)
        } catch (authError: any) {
          console.error("Firebase Auth update error:", authError)
          return NextResponse.json(
            { error: `Failed to update auth user: ${authError.message}` },
            { status: 400 }
          )
        }
      }
    }

    // Update Firestore document
    if (Object.keys(updates).length > 0) {
      await adminDb.collection("adminUsers").doc(id).update(updates)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update user" },
      { status: 500 }
    )
  }
}
