import { NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  try {
    // Handle both sync and async params (Next.js 15+ uses async params)
    const resolvedParams = await Promise.resolve(params)
    // Reconstruct the path from the array
    const imagePath = resolvedParams.path.join("/")
    
    // Security: Only allow paths that start with Images/
    if (!imagePath.startsWith("Images/")) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 })
    }

    // Construct full file path
    const fullPath = join(process.cwd(), imagePath)

    // Check if file exists
    if (!existsSync(fullPath)) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 })
    }

    // Read the file
    const fileBuffer = await readFile(fullPath)

    // Determine content type from file extension
    const ext = imagePath.split(".").pop()?.toLowerCase()
    const contentType = 
      ext === "jpg" || ext === "jpeg" ? "image/jpeg" :
      ext === "png" ? "image/png" :
      ext === "gif" ? "image/gif" :
      ext === "webp" ? "image/webp" :
      "image/jpeg"

    // Return the image with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error: any) {
    console.error("Error serving image:", error)
    return NextResponse.json(
      { error: error.message || "Failed to serve image" },
      { status: 500 }
    )
  }
}

