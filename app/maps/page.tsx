"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useStore } from "@/lib/store"
import dynamic from "next/dynamic"
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
  Heart,
  Loader2,
  AlertTriangle,
  MapPin,
} from "lucide-react"

const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full rounded-lg border border-border bg-secondary flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  ),
})

const damageCategories = [
  { id: "houses", label: "Houses", icon: Home, color: "#ef4444" },
  { id: "worship", label: "Worship Places", icon: Church, color: "#8b5cf6" },
  { id: "shops", label: "Shops", icon: Store, color: "#f97316" },
  { id: "vehicles", label: "Vehicles", icon: Car, color: "#06b6d4" },
  { id: "schools", label: "Schools", icon: GraduationCap, color: "#eab308" },
  { id: "roads", label: "Roads", icon: Route, color: "#64748b" },
  { id: "electricity", label: "Electricity", icon: Zap, color: "#facc15" },
  { id: "water", label: "Water", icon: Droplets, color: "#3b82f6" },
  { id: "hospitals", label: "Hospitals", icon: Stethoscope, color: "#ec4899" },
  { id: "telecom", label: "Telecom", icon: Wifi, color: "#14b8a6" },
]

const donorCategories = [
  { id: "medical", label: "Medical", color: "#22c55e" },
  { id: "cleaning", label: "Cleaning", color: "#22c55e" },
  { id: "volunteers", label: "Volunteers", color: "#22c55e" },
  { id: "funds", label: "Funds", color: "#22c55e" },
  { id: "electricity", label: "Electricity Support", color: "#22c55e" },
  { id: "water", label: "Water Support", color: "#22c55e" },
  { id: "furniture", label: "Furniture", color: "#22c55e" },
  { id: "utensils", label: "Utensils", color: "#22c55e" },
]

export default function MapsPage() {
  const { damageReports, donorOffers } = useStore()
  const [showDamageReports, setShowDamageReports] = useState(true)
  const [showDonorOffers, setShowDonorOffers] = useState(true)
  const [selectedDamageCategories, setSelectedDamageCategories] = useState<string[]>(damageCategories.map((c) => c.id))
  const [selectedDonorCategories, setSelectedDonorCategories] = useState<string[]>(donorCategories.map((c) => c.id))

  const toggleDamageCategory = (id: string) => {
    setSelectedDamageCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
  }

  const toggleDonorCategory = (id: string) => {
    setSelectedDonorCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
  }

  // Prepare markers for the map
  const markers: Array<{ position: [number, number]; popup: string; color: string }> = []

  if (showDamageReports) {
    damageReports
      .filter((r) => r.coordinates && selectedDamageCategories.includes(r.category))
      .forEach((report) => {
        const category = damageCategories.find((c) => c.id === report.category)
        markers.push({
          position: [report.coordinates!.lat, report.coordinates!.lng],
          popup: `
            <div style="min-width: 200px;">
              <strong style="color: ${category?.color || "#ef4444"};">${report.category.toUpperCase()} DAMAGE</strong>
              <p style="margin: 8px 0 4px; font-size: 14px;">${report.location}</p>
              <p style="margin: 0; font-size: 12px; color: #666;">Severity: ${report.severity}</p>
              <p style="margin: 0; font-size: 12px; color: #666;">Status: ${report.status}</p>
            </div>
          `,
          color: category?.color || "#ef4444",
        })
      })
  }

  if (showDonorOffers) {
    donorOffers
      .filter((o) => o.coordinates && selectedDonorCategories.includes(o.category))
      .forEach((offer) => {
        markers.push({
          position: [offer.coordinates!.lat, offer.coordinates!.lng],
          popup: `
            <div style="min-width: 200px;">
              <strong style="color: #22c55e;">SUPPORT AVAILABLE</strong>
              <p style="margin: 8px 0 4px; font-size: 14px;">${offer.category} from ${offer.donorName}</p>
              <p style="margin: 0; font-size: 12px; color: #666;">Contact: ${offer.contact}</p>
              <p style="margin: 0; font-size: 12px; color: #666;">Status: ${offer.status}</p>
            </div>
          `,
          color: "#22c55e",
        })
      })
  }

  const damageCount = damageReports.filter((r) => r.coordinates && selectedDamageCategories.includes(r.category)).length
  const donorCount = donorOffers.filter((o) => o.coordinates && selectedDonorCategories.includes(o.category)).length

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Emergency Response Map</h1>
          <p className="text-muted-foreground">
            View all damage reports and available support on the map. Click markers for details.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <div className="space-y-4">
            {/* Legend Stats */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Map Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Damage Reports</span>
                  <Badge variant="destructive">{damageCount}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Support Offers</span>
                  <Badge className="bg-success text-success-foreground">{donorCount}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Damage Reports Filter */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    Damage Reports
                  </CardTitle>
                  <Checkbox
                    checked={showDamageReports}
                    onCheckedChange={(checked) => setShowDamageReports(!!checked)}
                  />
                </div>
              </CardHeader>
              {showDamageReports && (
                <CardContent className="space-y-2">
                  {damageCategories.map((category) => {
                    const Icon = category.icon
                    return (
                      <div key={category.id} className="flex items-center gap-2">
                        <Checkbox
                          id={`damage-${category.id}`}
                          checked={selectedDamageCategories.includes(category.id)}
                          onCheckedChange={() => toggleDamageCategory(category.id)}
                        />
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                        <Label
                          htmlFor={`damage-${category.id}`}
                          className="text-sm text-foreground cursor-pointer flex items-center gap-1"
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {category.label}
                        </Label>
                      </div>
                    )
                  })}
                </CardContent>
              )}
            </Card>

            {/* Donor Offers Filter */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Heart className="h-4 w-4 text-success" />
                    Support Offers
                  </CardTitle>
                  <Checkbox checked={showDonorOffers} onCheckedChange={(checked) => setShowDonorOffers(!!checked)} />
                </div>
              </CardHeader>
              {showDonorOffers && (
                <CardContent className="space-y-2">
                  {donorCategories.map((category) => (
                    <div key={category.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`donor-${category.id}`}
                        checked={selectedDonorCategories.includes(category.id)}
                        onCheckedChange={() => toggleDonorCategory(category.id)}
                      />
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                      <Label
                        htmlFor={`donor-${category.id}`}
                        className="text-sm text-foreground cursor-pointer capitalize"
                      >
                        {category.label}
                      </Label>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          </div>

          {/* Map */}
          <div className="lg:col-span-3">
            <Card className="bg-card border-border overflow-hidden">
              <CardContent className="p-0">
                <MapComponent center={[7.8731, 80.7718]} zoom={8} markers={markers} height="600px" />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
