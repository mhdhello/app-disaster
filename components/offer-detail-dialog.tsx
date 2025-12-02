"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Pill,
  Brush,
  Users,
  DollarSign,
  Zap,
  Droplets,
  Armchair,
  UtensilsCrossed,
  MapPin,
  Clock,
  Heart,
  User,
  Phone,
  FileText,
} from "lucide-react"
import type { DonorOffer } from "@/lib/store"

const categoryIcons: Record<string, React.ElementType> = {
  medical: Pill,
  cleaning: Brush,
  volunteers: Users,
  funds: DollarSign,
  electricity: Zap,
  water: Droplets,
  furniture: Armchair,
  utensils: UtensilsCrossed,
}

const categoryLabels: Record<string, string> = {
  medical: "Medical Supplies",
  cleaning: "Cleaning Equipment",
  volunteers: "Volunteers / Man-hours",
  funds: "Funds Donation",
  electricity: "Electricity Restoration",
  water: "Water Restoration",
  furniture: "Furniture Donation",
  utensils: "Utensils & Kitchen",
}

const statusColors: Record<string, string> = {
  available: "bg-green-100 text-green-800",
  matched: "bg-blue-100 text-blue-800",
  delivered: "bg-purple-100 text-purple-800",
}

interface OfferDetailDialogProps {
  offer: DonorOffer | null
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

export function OfferDetailDialog({ offer, open, onOpenChange }: OfferDetailDialogProps) {
  if (!offer) return null

  const Icon = categoryIcons[offer.category] || Heart
  const categoryLabel = categoryLabels[offer.category] || offer.category

  // Filter out internal fields from display
  const displayData = Object.entries(offer.data || {}).filter(
    ([key]) => !["locationData", "donorName", "fullName", "contact"].includes(key),
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
              <Icon className="h-6 w-6 text-success" />
            </div>
            <div>
              <DialogTitle className="text-xl">{categoryLabel} Offer</DialogTitle>
              <p className="text-sm text-muted-foreground">Offer ID: {offer.id}</p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Status Section */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <Badge className={statusColors[offer.status]}>{offer.status}</Badge>
            </div>

            <Separator />

            {/* Donor Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <User className="h-4 w-4" />
                  Donor Name
                </div>
                <p className="text-foreground">{offer.donorName}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  Contact
                </div>
                <p className="text-foreground">{offer.contact}</p>
              </div>
            </div>

            {/* Location & Time */}
            <div className="grid gap-4 sm:grid-cols-2">
              {offer.location && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    Location
                  </div>
                  <p className="text-foreground">{offer.location}</p>
                  {offer.coordinates && (
                    <p className="text-xs text-muted-foreground">
                      GPS: {offer.coordinates.lat.toFixed(6)}, {offer.coordinates.lng.toFixed(6)}
                    </p>
                  )}
                </div>
              )}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Registered On
                </div>
                <p className="text-foreground">{new Date(offer.timestamp).toLocaleString()}</p>
              </div>
            </div>

            <Separator />

            {/* All Form Data */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <FileText className="h-4 w-4" />
                Offer Details
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
