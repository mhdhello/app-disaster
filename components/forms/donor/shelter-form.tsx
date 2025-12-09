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

export interface ShelterFormProps {
  formData: Record<string, unknown>
  onChange: (data: Record<string, unknown>) => void
}

const shelterItems = [
  { id: "tents", label: "Tents", icon: "⛺" },
  { id: "tarpaulins", label: "Tarpaulins", icon: "📦" },
  { id: "sleepingBags", label: "Sleeping Bags", icon: "🛏️" },
  { id: "mattresses", label: "Mattresses", icon: "🛏️" },
  { id: "plasticSheeting", label: "Plastic Sheeting", icon: "📋" },
  { id: "cement", label: "Cement", icon: "🏗️" },
  { id: "bricks", label: "Bricks", icon: "🧱" },
  { id: "roofingSheets", label: "Roofing Sheets", icon: "🏠" },
]

const conditions = [
  { id: "new", label: "New/Unused" },
  { id: "excellent", label: "Excellent" },
  { id: "good", label: "Good" },
  { id: "fair", label: "Fair" },
]

const deliveryOptions = [
  { id: "pickup", label: "Pickup from my location" },
  { id: "delivery", label: "I can deliver" },
  { id: "contact", label: "Contact me for details" },
]

export function ShelterForm({ formData, onChange }: ShelterFormProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>(
    (formData.shelterItems as string[]) || []
  )
  const [itemQuantities, setItemQuantities] = useState<Record<string, string>>(
    (formData.itemQuantities as Record<string, string>) || {}
  )

  const handleItemToggle = (itemId: string) => {
    const updated = selectedItems.includes(itemId)
      ? selectedItems.filter((id) => id !== itemId)
      : [...selectedItems, itemId]
    setSelectedItems(updated)
    onChange({ ...formData, shelterItems: updated })
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

      {/* Shelter & Housing Items */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Shelter & Housing Materials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {shelterItems.map((item) => (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div className="space-y-2">
              <Label htmlFor="packageWeight" className="text-sm font-medium">
                Estimated Total Weight (kg)
              </Label>
              <Input
                id="packageWeight"
                type="number"
                min="0"
                placeholder="e.g., 50"
                value={(formData.packageWeight as string) || ""}
                onChange={(e) => handleInputChange("packageWeight", e.target.value)}
                className="bg-background text-foreground border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Additional Details
            </Label>
            <Textarea
              id="description"
              placeholder="Provide any additional information about the materials (e.g., tent capacity, cement bags, dimensions, etc.)"
              value={(formData.description as string) || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="bg-background text-foreground border-border resize-none h-24"
            />
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
