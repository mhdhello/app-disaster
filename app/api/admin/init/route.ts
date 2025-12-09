import { NextRequest, NextResponse } from "next/server"
import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore, FieldValue } from "firebase-admin/firestore"
import bcrypt from "bcryptjs"

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

const adminAuth = getAuth()
const adminDb = getFirestore()

const ADMIN_PASSWORD = "riseagain0976%" // Keep this password constant
const ADMIN_NAME = "AdminMaster" // Dummy admin name

export async function POST(request: NextRequest) {
  try {
    // Check if admin user already exists
    const usersRef = adminDb.collection("adminUsers")
    const snapshot = await usersRef.where("name", "==", ADMIN_NAME).limit(1).get()

    if (!snapshot.empty) {
      return NextResponse.json({
        success: true,
        message: "Admin user already exists",
        user: {
          id: snapshot.docs[0].id,
          name: ADMIN_NAME,
        },
      })
    }

    // Hash password with bcrypt
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, saltRounds)

    // Store user data in Firestore with bcrypt hash only.
    // We avoid creating a Firebase Auth user here so the login endpoint
    // can authenticate against the Firestore-stored hash consistently.
    const userData = {
      name: ADMIN_NAME,
      // No public email required for this default admin record
      passwordHash: hashedPassword, // Store bcrypt hash
      role: "admin",
      active: true,
      firebaseUid: null,
      createdAt: FieldValue.serverTimestamp(),
    }

    const docRef = await adminDb.collection("adminUsers").add(userData)

    return NextResponse.json({
      success: true,
      message: "Default admin user created successfully (stored in Firestore)",
      user: {
        id: docRef.id,
        name: ADMIN_NAME,
        firebaseUid: null,
      },
    })
  } catch (error: any) {
    console.error("Error initializing admin user:", error)
    return NextResponse.json(
      { error: error.message || "Failed to initialize admin user" },
      { status: 500 }
    )
  }
}

// GET endpoint to check if admin user exists
export async function GET() {
  try {
    const usersRef = adminDb.collection("adminUsers")
    const snapshot = await usersRef.where("name", "==", ADMIN_NAME).limit(1).get()

    if (snapshot.empty) {
      return NextResponse.json({
        exists: false,
        message: "Admin user does not exist",
      })
    }

    const userDoc = snapshot.docs[0]
    const userData = userDoc.data()

    return NextResponse.json({
      exists: true,
      user: {
        id: userDoc.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        active: userData.active,
      },
    })
  } catch (error: any) {
    console.error("Error checking admin user:", error)
    return NextResponse.json(
      { error: error.message || "Failed to check admin user" },
      { status: 500 }
    )
  }
}
