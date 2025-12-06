import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  orderBy,
  Timestamp,
  type DocumentData,
  type QueryDocumentSnapshot
} from "firebase/firestore"
import { db } from "./firebase"
import type { DamageReport } from "./store"

// Convert Firestore document to DamageReport
const docToDamageReport = (doc: QueryDocumentSnapshot<DocumentData>): DamageReport => {
  const data = doc.data()
  return {
    id: doc.id,
    category: data.category || "",
    timestamp: data.timestamp?.toDate() || new Date(),
    location: data.location || "",
    lat: data.lat !== undefined && data.lat !== null ? data.lat : undefined,
    lon: data.lon !== undefined && data.lon !== null ? data.lon : undefined,
    severity: data.severity || "unknown",
    status: data.status || "pending",
    verified: data.verified || false,
    verifiedAt: data.verifiedAt?.toDate() || undefined,
    verifiedBy: data.verifiedBy || undefined,
    data: data.data || {},
    photoPaths: data.photoPaths || [],
  }
}

// Upload photos to local Images folder via API route
export const uploadDamageReportPhotos = async (
  files: FileList | null,
  reportId: string
): Promise<string[]> => {
  if (!files || files.length === 0) {
    return []
  }

  try {
    const formData = new FormData()
    formData.append("reportId", reportId)
    
    // Append all files to FormData
    for (let i = 0; i < files.length; i++) {
      formData.append("photos", files[i])
    }

    const response = await fetch("/api/damage-reports/upload-photos", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to upload photos")
    }

    const data = await response.json()
    // Normalize returned paths to use forward slashes
    const paths: string[] = (data.photoPaths || []).map((p: string) => p.replace(/\\/g, "/"))
    return paths
  } catch (error) {
    console.error("Error uploading photos:", error)
    throw error
  }
}

// Add a new damage report
export const addDamageReportToFirebase = async (
  report: Omit<DamageReport, "id" | "timestamp" | "status">,
  photos?: FileList | null
): Promise<string> => {
  try {
    // Deep-clean the data object to ensure it's Firestore-compatible
    const cleanValue = (value: unknown): unknown => {
      if (value === undefined) return undefined
      if (value === null) return null
      // FileList or File should not be stored in Firestore
      // Detect File/Blob by duck-typing where possible
      // @ts-ignore
      if (typeof (value as any)?.arrayBuffer === "function") {
        return undefined
      }
      // FileList: has length and item function
      // @ts-ignore
      if (value && typeof (value as any).length === "number" && typeof (value as any).item === "function") {
        return undefined
      }

      if (Array.isArray(value)) {
        const arr = (value as unknown[])
          .map((v) => cleanValue(v))
          .filter((v) => v !== undefined)
        return arr
      }

      if (typeof value === "object") {
        const obj = value as Record<string, unknown>
        const out: Record<string, unknown> = {}
        for (const [k, v] of Object.entries(obj)) {
          const cleaned = cleanValue(v)
          if (cleaned !== undefined) {
            out[k] = cleaned
          }
        }
        return out
      }

      return value
    }

    const cleanData = (cleanValue(report.data || {}) || {}) as Record<string, unknown>

    // First, create the document to get an ID
    const reportData = {
      category: report.category,
      timestamp: Timestamp.now(),
      location: report.location || "Location not specified",
      lat: report.lat !== undefined && report.lat !== null ? report.lat : null,
      lon: report.lon !== undefined && report.lon !== null ? report.lon : null,
      severity: report.severity || "unknown",
      status: "pending" as const,
      verified: false,
      verifiedAt: null,
      verifiedBy: null,
      data: cleanData, // All form fields including province, district, and category-specific fields
      photoPaths: [] as string[],
    }

    console.log("Saving damage report to Firebase:", {
      category: reportData.category,
      location: reportData.location,
      dataKeys: Object.keys(reportData.data),
      hasPhotos: photos && photos.length > 0,
    })

    const docRef = await addDoc(collection(db, "damageReports"), reportData)
    const reportId = docRef.id

    console.log(`Created damage report with ID: ${reportId}`)

    // Upload photos if provided
    if (photos && photos.length > 0) {
      try {
        console.log(`Uploading ${photos.length} photo(s) for report ${reportId}`)
        const photoPaths = await uploadDamageReportPhotos(photos, reportId)
        
        console.log(`Successfully uploaded ${photoPaths.length} photo(s)`)
        
        // Update the document with photo paths
        await updateDoc(doc(db, "damageReports", reportId), {
          photoPaths: photoPaths,
        })
        
        console.log(`Updated report ${reportId} with photo paths`)
      } catch (photoError) {
        console.error("Error uploading photos:", photoError)
        // Continue even if photo upload fails - report is still saved
      }
    }

    return reportId
  } catch (error) {
    console.error("Error adding damage report:", error)
    throw error
  }
}

// Get all damage reports
export const getDamageReportsFromFirebase = async (): Promise<DamageReport[]> => {
  try {
    const q = query(collection(db, "damageReports"), orderBy("timestamp", "desc"))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(docToDamageReport)
  } catch (error) {
    console.error("Error getting damage reports:", error)
    throw error
  }
}

// Update damage report status
export const updateDamageReportStatus = async (
  id: string,
  status: DamageReport["status"]
): Promise<void> => {
  try {
    await updateDoc(doc(db, "damageReports", id), {
      status,
    })
  } catch (error) {
    console.error("Error updating damage report status:", error)
    throw error
  }
}

// Verify damage report
export const verifyDamageReport = async (
  id: string,
  verifiedBy: string
): Promise<void> => {
  try {
    await updateDoc(doc(db, "damageReports", id), {
      verified: true,
      verifiedAt: Timestamp.now(),
      verifiedBy,
    })
  } catch (error) {
    console.error("Error verifying damage report:", error)
    throw error
  }
}

