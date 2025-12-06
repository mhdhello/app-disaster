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
const ADMIN_EMAIL = "adminmaster@floodrelief.lk" // Dummy email

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

    // Create user in Firebase Auth
    let firebaseUser
    try {
      firebaseUser = await adminAuth.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        displayName: ADMIN_NAME,
        emailVerified: false,
        disabled: false,
      })
    } catch (authError: any) {
      // If user already exists in Auth, try to get it
      if (authError.code === "auth/email-already-exists") {
        try {
          const existingUsers = await adminAuth.getUsersByEmail(ADMIN_EMAIL)
          if (existingUsers.users.length > 0) {
            firebaseUser = existingUsers.users[0]
          } else {
            throw authError
          }
        } catch (getError) {
          console.error("Firebase Auth error:", authError)
          return NextResponse.json(
            { error: `Failed to create auth user: ${authError.message}` },
            { status: 400 }
          )
        }
      } else {
        console.error("Firebase Auth error:", authError)
        return NextResponse.json(
          { error: `Failed to create auth user: ${authError.message}` },
          { status: 400 }
        )
      }
    }

    // Store user data in Firestore with hashed password
    const userData = {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      passwordHash: hashedPassword, // Store bcrypt hash
      role: "admin",
      active: true,
      firebaseUid: firebaseUser.uid,
      createdAt: FieldValue.serverTimestamp(),
    }

    const docRef = await adminDb.collection("adminUsers").add(userData)

    return NextResponse.json({
      success: true,
      message: "Default admin user created successfully",
      user: {
        id: docRef.id,
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        firebaseUid: firebaseUser.uid,
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
