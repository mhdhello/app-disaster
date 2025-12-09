"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LocationPicker } from "@/components/location-picker"
import { ProvinceDistrictSelector } from "@/components/forms/damage/province-district-selector"
import { AlertCircle } from "lucide-react"

export interface RescueSafetyFormProps {
  formData: Record<string, unknown>
  onChange: (data: Record<string, unknown>) => void
}

const safetyItems = [
  { id: "lifeJackets", label: "Life Jackets", icon: "🦺" },
  { id: "firstAidKits", label: "First Aid Kits", icon: "🏥" },
  { id: "flashlights", label: "Flashlights", icon: "🔦" },
  { id: "batteries", label: "Batteries", icon: "🔋" },
  { id: "emergencyToolkits", label: "Emergency Toolkits", icon: "🔧" },
  { id: "ropes", label: "Ropes", icon: "🪢" },
]

const conditions = [
  { id: "new", label: "New/Unused" },
  { id: "excellent", label: "Excellent" },
  { id: "good", label: "Good" },
  { id: "fair", label: "Fair" },
]

const lifeJacketSizes = [
  { id: "child", label: "Child (under 40 kg)" },
  { id: "adult", label: "Adult (40-90 kg)" },
  { id: "largeAdult", label: "Large Adult (90+ kg)" },
  { id: "mixed", label: "Mixed sizes" },
]

const batterySizes = [
  { id: "aa", label: "AA" },
  { id: "aaa", label: "AAA" },
  { id: "c", label: "C" },
  { id: "d", label: "D" },
  { id: "9v", label: "9V" },
  { id: "mixed", label: "Mixed sizes" },
]

const ropeLengths = [
  { id: "short", label: "Short (up to 10m)" },
  { id: "medium", label: "Medium (10-30m)" },
  { id: "long", label: "Long (30-50m)" },
  { id: "extraLong", label: "Extra Long (50m+)" },
  { id: "mixed", label: "Mixed lengths" },
]

const deliveryOptions = [
  { id: "pickup", label: "Pickup from my location" },
  { id: "delivery", label: "I can deliver" },
  { id: "contact", label: "Contact me for details" },
]

export function RescueSafetyForm({ formData, onChange }: RescueSafetyFormProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>(
    (formData.safetyItems as string[]) || []
  )
  const [itemQuantities, setItemQuantities] = useState<Record<string, string>>(
    (formData.itemQuantities as Record<string, string>) || {}
  )

  const handleItemToggle = (itemId: string) => {
    const updated = selectedItems.includes(itemId)
      ? selectedItems.filter((id) => id !== itemId)
      : [...selectedItems, itemId]
    setSelectedItems(updated)
    onChange({ ...formData, safetyItems: updated })
  }

  const handleQuantityChange = (itemId: string, value: string) => {
    const updated = { ...itemQuantities, [itemId]: value }
    setItemQuantities(updated)
    onChange({ ...formData, itemQuantities: updated })
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    onChange({ ...formData, [field]: value })
  }

  const handleLocationChange = (locationData: {
    lat: number
    lng: number
    address?: string
  }) => {
    onChange({ ...formData, locationData })
  }

  const hasLifeJackets = selectedItems.includes("lifeJackets")
  const hasBatteries = selectedItems.includes("batteries")
  const hasRopes = selectedItems.includes("ropes")

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="donorName" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="donorName"
                placeholder="Your name"
                value={(formData.donorName as string) || ""}
                onChange={(e) => handleInputChange("donorName", e.target.value)}
                className="bg-background text-foreground border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact" className="text-sm font-medium">
                Contact Number
              </Label>
              <Input
                id="contact"
                type="tel"
                placeholder="Your phone number"
                value={(formData.contact as string) || ""}
                onChange={(e) => handleInputChange("contact", e.target.value)}
                className="bg-background text-foreground border-border"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Equipment Items */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Rescue & Safety Equipment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {safetyItems.map((item) => (
              <div key={item.id} className="space-y-2">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={item.id}
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => handleItemToggle(item.id)}
                    className="border-border"
                  />
                  <Label
                    htmlFor={item.id}
                    className="text-sm font-medium cursor-pointer flex items-center gap-2"
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Label>
                </div>
                {selectedItems.includes(item.id) && (
                  <div className="ml-7 mt-2">
                    <Input
                      type="number"
                      min="1"
                      placeholder="Quantity"
                      value={itemQuantities[item.id] || ""}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      className="bg-background text-foreground border-border text-sm"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Condition & Details */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Condition & Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="condition" className="text-sm font-medium">
              Condition
            </Label>
            <Select
              value={(formData.condition as string) || ""}
              onValueChange={(value) => handleInputChange("condition", value)}
            >
              <SelectTrigger id="condition" className="bg-background text-foreground border-border">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                {conditions.map((cond) => (
                  <SelectItem key={cond.id} value={cond.id}>
                    {cond.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hasLifeJackets && (
            <div className="space-y-2">
              <Label htmlFor="lifeJacketSize" className="text-sm font-medium">
                Life Jacket Size
              </Label>
              <Select
                value={(formData.lifeJacketSize as string) || ""}
                onValueChange={(value) => handleInputChange("lifeJacketSize", value)}
              >
                <SelectTrigger id="lifeJacketSize" className="bg-background text-foreground border-border">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  {lifeJacketSizes.map((size) => (
                    <SelectItem key={size.id} value={size.id}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {hasBatteries && (
            <div className="space-y-2">
              <Label htmlFor="batterySize" className="text-sm font-medium">
                Battery Size/Type
              </Label>
              <Select
                value={(formData.batterySize as string) || ""}
                onValueChange={(value) => handleInputChange("batterySize", value)}
              >
                <SelectTrigger id="batterySize" className="bg-background text-foreground border-border">
                  <SelectValue placeholder="Select battery type" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  {batterySizes.map((size) => (
                    <SelectItem key={size.id} value={size.id}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {hasRopes && (
            <div className="space-y-2">
              <Label htmlFor="ropeLength" className="text-sm font-medium">
                Rope Length
              </Label>
              <Select
                value={(formData.ropeLength as string) || ""}
                onValueChange={(value) => handleInputChange("ropeLength", value)}
              >
                <SelectTrigger id="ropeLength" className="bg-background text-foreground border-border">
                  <SelectValue placeholder="Select rope length" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  {ropeLengths.map((length) => (
                    <SelectItem key={length.id} value={length.id}>
                      {length.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Additional Details
            </Label>
            <Textarea
              id="description"
              placeholder="Provide any additional information (e.g., first aid kit contents, equipment brand, rope material, tools included in toolkits, expiry dates for medical items, etc.)"
              value={(formData.description as string) || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="bg-background text-foreground border-border resize-none h-24"
            />
          </div>
        </CardContent>
      </Card>

      {/* Safety & Compliance Information */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Safety & Compliance Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="safetyNotes" className="text-sm font-medium">
              Safety Notes & Certifications
            </Label>
            <Textarea
              id="safetyNotes"
              placeholder="List any safety certifications, expiry dates for medical items (first aid kits, medications), or important safety warnings (e.g., life jacket certification, toolkit material/weight capacity)"
              value={(formData.safetyNotes as string) || ""}
              onChange={(e) => handleInputChange("safetyNotes", e.target.value)}
              className="bg-background text-foreground border-border resize-none h-20"
            />
          </div>

          <div className="flex items-start gap-3 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-red-800">
              Safety equipment must be in working condition and meet relevant safety standards. Please disclose any defects, damage, or expiry dates. Lives may depend on this equipment.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Delivery & Availability */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Delivery & Availability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {deliveryOptions.map((option) => (
              <div key={option.id} className="flex items-center gap-3">
                <Checkbox
                  id={`delivery-${option.id}`}
                  checked={(formData.deliveryPreference as string) === option.id}
                  onCheckedChange={() => handleInputChange("deliveryPreference", option.id)}
                  className="border-border"
                />
                <Label
                  htmlFor={`delivery-${option.id}`}
                  className="text-sm font-medium cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="availabilityDate" className="text-sm font-medium">
              Available From
            </Label>
            <Input
              id="availabilityDate"
              type="date"
              value={(formData.availabilityDate as string) || ""}
              onChange={(e) => handleInputChange("availabilityDate", e.target.value)}
              className="bg-background text-foreground border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="availabilityTime" className="text-sm font-medium">
              Preferred Time
            </Label>
            <Select
              value={(formData.availabilityTime as string) || ""}
              onValueChange={(value) => handleInputChange("availabilityTime", value)}
            >
              <SelectTrigger id="availabilityTime" className="bg-background text-foreground border-border">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="morning">Morning (6 AM - 12 PM)</SelectItem>
                <SelectItem value="afternoon">Afternoon (12 PM - 6 PM)</SelectItem>
                <SelectItem value="evening">Evening (6 PM - 9 PM)</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProvinceDistrictSelector
            formData={formData}
            onChange={onChange}
          />

          <div className="mt-4">
            <LocationPicker
              onLocationChange={handleLocationChange}
              currentLocation={(formData.locationData as { lat: number; lng: number; address?: string }) || undefined}
            />
          </div>

          {!(formData.locationData as { lat: number; lng: number; address?: string }) && (
            <div className="flex items-start gap-3 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-amber-800">
                Please select your location on the map or use the "My Location" button for accurate coordination.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
