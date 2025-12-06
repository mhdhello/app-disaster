import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const reportId = formData.get("reportId") as string
    const files = formData.getAll("photos") as File[]

    if (!reportId) {
      return NextResponse.json({ error: "Report ID is required" }, { status: 400 })
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    // Ensure base Images folder exists (project root)
    const baseImagesDir = join(process.cwd(), "Images")
    if (!existsSync(baseImagesDir)) {
      await mkdir(baseImagesDir, { recursive: true })
      console.log(`Created base Images directory: ${baseImagesDir}`)
    }

    // Create the report-specific directory: Images/{reportId}
    const reportImagesDir = join(baseImagesDir, reportId)
    if (!existsSync(reportImagesDir)) {
      await mkdir(reportImagesDir, { recursive: true })
      console.log(`Created report directory: ${reportImagesDir}`)
    }

    const photoPaths: string[] = []
    const usedFileNames = new Set<string>()

    // Save each file to the report's folder
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      // Sanitize filename to ensure it's safe for filesystem
      const rawName = file.name || "image"
      const fileExtension = rawName.split('.').pop()?.toLowerCase() || 'jpg'
      const nameWithoutExt = rawName.replace(/\.[^/.]+$/, '')
      let sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9\s\-_\.]/g, '_').trim() || 'image'

      // ensure we don't create duplicate filenames in the same upload
      let fileName = `${sanitizedName}.${fileExtension}`
      let counter = 1
      while (usedFileNames.has(fileName)) {
        fileName = `${sanitizedName}_${counter}.${fileExtension}`
        counter++
      }
      usedFileNames.add(fileName)

      const filePath = join(reportImagesDir, fileName)

      // Convert File to Buffer and write to disk
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      await writeFile(filePath, buffer)
      console.log(`Saved image: ${filePath}`)

      // Store relative path from project root (for database storage) using forward slashes
      const relativePath = `Images/${reportId}/${fileName}`
      photoPaths.push(relativePath.replace(/\\/g, "/"))
    }

    console.log(`Successfully uploaded ${photoPaths.length} images for report ${reportId}`)
    return NextResponse.json({ 
      success: true,
      photoPaths,
      message: `Successfully saved ${photoPaths.length} image(s) to Images/${reportId}/`
    })
  } catch (error: any) {
    console.error("Error uploading photos:", error)
    return NextResponse.json(
      { 
        error: error.message || "Failed to upload photos",
        details: error.stack
      },
      { status: 500 }
    )
  }
}

