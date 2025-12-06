"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import {
  Home,
  Church,
  Store,
  Car,
  GraduationCap,
  Route,
  Zap,
  Droplets,
  Stethoscope,
  Wifi,
  MapPin,
  Clock,
  AlertTriangle,
  FileText,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react"
import type { DamageReport } from "@/lib/store"
import MapComponent from "@/components/map-component"

const categoryIcons: Record<string, React.ElementType> = {
  houses: Home,
  worship: Church,
  shops: Store,
  vehicles: Car,
  schools: GraduationCap,
  roads: Route,
  electricity: Zap,
  water: Droplets,
  hospitals: Stethoscope,
  telecom: Wifi,
}

const categoryLabels: Record<string, string> = {
  houses: "Houses / Residential",
  worship: "Worshipping Places",
  shops: "Shops & Commercial",
  vehicles: "Vehicles",
  schools: "Schools & Institutes",
  roads: "Roads & Railways",
  electricity: "Electricity & Power",
  water: "Water & Pipelines",
  hospitals: "Hospitals & Clinics",
  telecom: "Telecommunications",
}

const severityColors: Record<string, string> = {
  minor: "bg-green-100 text-green-800",
  moderate: "bg-yellow-100 text-yellow-800",
  major: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
  destroyed: "bg-red-100 text-red-800",
  Minor: "bg-green-100 text-green-800",
  Moderate: "bg-yellow-100 text-yellow-800",
  Major: "bg-orange-100 text-orange-800",
  Critical: "bg-red-100 text-red-800",
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  reviewed: "bg-blue-100 text-blue-800",
  assigned: "bg-purple-100 text-purple-800",
  resolved: "bg-green-100 text-green-800",
}

interface ReportDetailDialogProps {
  report: DamageReport | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Helper to format field labels
function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .replace(/_/g, " ")
}

// Helper to detect mobile device
function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         (window.matchMedia && window.matchMedia("(max-width: 768px)").matches)
}

// Helper to open Google Maps with exact coordinates
function openGoogleMaps(lat: number, lng: number) {
  // Format coordinates with high precision (6 decimal places = ~10cm accuracy)
  const formattedLat = lat.toFixed(6)
  const formattedLng = lng.toFixed(6)
  
  // Universal Google Maps URL that opens app on mobile if installed, web otherwise
  // Using the @ format ensures exact coordinates are used
  const mapsUrl = `https://www.google.com/maps/@${formattedLat},${formattedLng},15z`
  
  // Alternative URL format that also works well (search with exact coordinates)
  const searchUrl = `https://www.google.com/maps/search/?api=1&query=${formattedLat},${formattedLng}`
  
  if (isMobileDevice()) {
    const userAgent = typeof window !== "undefined" ? navigator.userAgent : ""
    
    if (/iPhone|iPad|iPod/i.test(userAgent)) {
      // iOS - try Google Maps app with exact coordinates
      // Using ll parameter for exact lat/lng positioning
      const googleMapsAppUrl = `comgooglemaps://?ll=${formattedLat},${formattedLng}&q=${formattedLat},${formattedLng}&zoom=15`
      
      // Try to open app first
      const iframe = document.createElement("iframe")
      iframe.style.display = "none"
      iframe.style.width = "0"
      iframe.style.height = "0"
      iframe.src = googleMapsAppUrl
      document.body.appendChild(iframe)
      
      // Remove iframe after attempt
      setTimeout(() => {
        if (iframe.parentNode) {
          document.body.removeChild(iframe)
        }
      }, 1000)
      
      // Fallback to web with exact coordinates
      setTimeout(() => {
        window.open(searchUrl, "_blank")
      }, 500)
    } else if (/Android/i.test(userAgent)) {
      // Android - use Google Maps intent URL (opens app if installed)
      // This format ensures exact coordinates are preserved
      const intentUrl = `https://www.google.com/maps/search/?api=1&query=${formattedLat},${formattedLng}`
      
      // Try opening in app first
      window.location.href = intentUrl
      
      // Fallback to web if app doesn't open
      setTimeout(() => {
        window.open(searchUrl, "_blank")
      }, 1500)
    } else {
      // Other mobile devices - use exact coordinate URL
      window.open(searchUrl, "_blank")
    }
  } else {
    // Desktop - open with exact coordinates
    window.open(searchUrl, "_blank")
  }
}

// Helper to render field value
function renderValue(value: unknown): React.ReactNode {
  if (value === null || value === undefined || value === "") {
    return <span className="text-muted-foreground italic">Not provided</span>
  }
  if (typeof value === "boolean") {
    return value ? "Yes" : "No"
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-muted-foreground italic">None selected</span>
    return (
      <div className="flex flex-wrap gap-1">
        {value.map((item, i) => (
          <Badge key={i} variant="secondary" className="text-xs">
            {String(item)}
          </Badge>
        ))}
      </div>
    )
  }
  if (typeof value === "object") {
    // Handle location data object
    if ("lat" in value && "lng" in value) {
      const loc = value as { lat: number; lng: number; address?: string }
      return (
        <div className="space-y-1">
          {loc.address && <p>{loc.address}</p>}
          <p className="text-xs text-muted-foreground">
            Coordinates: {loc.lat.toFixed(6)}, {loc.lng.toFixed(6)}
          </p>
        </div>
      )
    }
    return <pre className="text-xs bg-muted p-2 rounded overflow-auto">{JSON.stringify(value, null, 2)}</pre>
  }
  return String(value)
}

export function ReportDetailDialog({ report, open, onOpenChange }: ReportDetailDialogProps) {
  if (!report) return null

  const Icon = categoryIcons[report.category] || AlertTriangle
  const categoryLabel = categoryLabels[report.category] || report.category

  // Get location data from report
  const locationData = (report.data?.locationData as { lat: number; lng: number; address?: string }) || 
                       ((report.lat !== undefined && report.lat !== null && report.lon !== undefined && report.lon !== null) 
                         ? { lat: report.lat, lng: report.lon, address: report.location } 
                         : undefined)

  // Filter out internal fields from display
  const displayData = Object.entries(report.data || {}).filter(([key]) => !["locationData"].includes(key))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">{categoryLabel} Damage Report</DialogTitle>
              <p className="text-sm text-muted-foreground">Case ID: {report.id}</p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] pr-4">
          <div className="space-y-6">
            {/* Status Section */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <Badge className={statusColors[report.status]}>{report.status}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Severity:</span>
                <Badge className={severityColors[report.severity] || "bg-gray-100 text-gray-800"}>
                  {report.severity}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Location Map */}
            {locationData && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4" />
                    Location on Map
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openGoogleMaps(locationData.lat, locationData.lng)}
                    className="gap-2"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open in Google Maps
                  </Button>
                </div>
                <div className="rounded-lg border border-border overflow-hidden">
                  <MapComponent
                    center={[locationData.lat, locationData.lng]}
                    zoom={15}
                    marker={[locationData.lat, locationData.lng]}
                    height="300px"
                  />
                </div>
                <div className="text-sm">
                  <p className="text-foreground font-medium">{report.location}</p>
                  <p className="text-xs text-muted-foreground">
                    GPS: {locationData.lat.toFixed(6)}, {locationData.lng.toFixed(6)}
                  </p>
                </div>
              </div>
            )}

            <Separator />

            {/* Photos Section */}
            {report.photoPaths && report.photoPaths.length > 0 && (
              <>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <ImageIcon className="h-4 w-4" />
                    Damage Photos ({report.photoPaths.length})
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {report.photoPaths.map((photoPath, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-lg overflow-hidden border border-border bg-muted group cursor-pointer"
                        onClick={() => {
                          // Open image in new tab for full view
                          window.open(`/api/images/${photoPath}`, "_blank")
                        }}
                      >
                        <img
                          src={`/api/images/${photoPath}`}
                          alt={`Damage photo ${idx + 1}`}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                          onError={(e) => {
                            // Show placeholder on error
                            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImage not found%3C/text%3E%3C/svg%3E"
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Time */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Clock className="h-4 w-4" />
                Reported On
              </div>
              <p className="text-foreground">{new Date(report.timestamp).toLocaleString()}</p>
            </div>

            <Separator />

            {/* All Form Data */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <FileText className="h-4 w-4" />
                Report Details
              </div>

              <div className="grid gap-4">
                {displayData.map(([key, value]) => (
                  <div key={key} className="grid gap-1">
                    <label className="text-sm font-medium text-muted-foreground">{formatLabel(key)}</label>
                    <div className="text-foreground">{renderValue(value)}</div>
                  </div>
                ))}
              </div>

              {displayData.length === 0 && (
                <p className="text-muted-foreground italic">No additional details provided</p>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
