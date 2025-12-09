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

export interface BabyChildFormProps {
  formData: Record<string, unknown>
  onChange: (data: Record<string, unknown>) => void
}

const babyItems = [
  { id: "babyFood", label: "Baby Food", icon: "🥫" },
  { id: "formula", label: "Baby Formula", icon: "🍶" },
  { id: "diapers", label: "Diapers", icon: "👶" },
  { id: "clothes", label: "Baby Clothes", icon: "👕" },
  { id: "bottles", label: "Feeding Bottles", icon: "🍼" },
]

const conditions = [
  { id: "new", label: "New/Unused" },
  { id: "excellent", label: "Excellent" },
  { id: "good", label: "Good" },
  { id: "fair", label: "Fair" },
]

const diaperSizes = [
  { id: "newborn", label: "Newborn (0-5 kg)" },
  { id: "small", label: "Small (5-8 kg)" },
  { id: "medium", label: "Medium (8-12 kg)" },
  { id: "large", label: "Large (12-15 kg)" },
  { id: "xlarge", label: "Extra Large (15+ kg)" },
  { id: "mixed", label: "Mixed sizes" },
]

const clothingSizes = [
  { id: "0-3m", label: "0-3 months" },
  { id: "3-6m", label: "3-6 months" },
  { id: "6-12m", label: "6-12 months" },
  { id: "12-24m", label: "12-24 months" },
  { id: "mixed", label: "Mixed sizes" },
]

const deliveryOptions = [
  { id: "pickup", label: "Pickup from my location" },
  { id: "delivery", label: "I can deliver" },
  { id: "contact", label: "Contact me for details" },
]

export function BabyChildForm({ formData, onChange }: BabyChildFormProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>(
    (formData.babyItems as string[]) || []
  )
  const [itemQuantities, setItemQuantities] = useState<Record<string, string>>(
    (formData.itemQuantities as Record<string, string>) || {}
  )

  const handleItemToggle = (itemId: string) => {
    const updated = selectedItems.includes(itemId)
      ? selectedItems.filter((id) => id !== itemId)
      : [...selectedItems, itemId]
    setSelectedItems(updated)
    onChange({ ...formData, babyItems: updated })
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

  const hasDiapers = selectedItems.includes("diapers")
  const hasClothes = selectedItems.includes("clothes")
  const hasFormula = selectedItems.includes("formula")

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

      {/* Baby & Child Care Items */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Baby & Child Care Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {babyItems.map((item) => (
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

          {hasDiapers && (
            <div className="space-y-2">
              <Label htmlFor="diaperSize" className="text-sm font-medium">
                Diaper Size
              </Label>
              <Select
                value={(formData.diaperSize as string) || ""}
                onValueChange={(value) => handleInputChange("diaperSize", value)}
              >
                <SelectTrigger id="diaperSize" className="bg-background text-foreground border-border">
                  <SelectValue placeholder="Select diaper size" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  {diaperSizes.map((size) => (
                    <SelectItem key={size.id} value={size.id}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {hasClothes && (
            <div className="space-y-2">
              <Label htmlFor="clothingSize" className="text-sm font-medium">
                Baby Clothing Size
              </Label>
              <Select
                value={(formData.clothingSize as string) || ""}
                onValueChange={(value) => handleInputChange("clothingSize", value)}
              >
                <SelectTrigger id="clothingSize" className="bg-background text-foreground border-border">
                  <SelectValue placeholder="Select clothing size" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  {clothingSizes.map((size) => (
                    <SelectItem key={size.id} value={size.id}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {hasFormula && (
            <div className="space-y-2">
              <Label htmlFor="expiryDate" className="text-sm font-medium">
                Formula Expiry Date
              </Label>
              <Input
                id="expiryDate"
                type="date"
                value={(formData.expiryDate as string) || ""}
                onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                className="bg-background text-foreground border-border"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Additional Details
            </Label>
            <Textarea
              id="description"
              placeholder="Provide any additional information (e.g., formula type, baby food flavors, clothing types, bottle material, allergies/safety concerns, etc.)"
              value={(formData.description as string) || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="bg-background text-foreground border-border resize-none h-24"
            />
          </div>
        </CardContent>
      </Card>

      {/* Safety & Allergen Information */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Safety & Allergen Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="allergens" className="text-sm font-medium">
              Allergen Information
            </Label>
            <Textarea
              id="allergens"
              placeholder="List any potential allergens or safety concerns (e.g., contains nuts, shellfish, gluten, etc.)"
              value={(formData.allergens as string) || ""}
              onChange={(e) => handleInputChange("allergens", e.target.value)}
              className="bg-background text-foreground border-border resize-none h-20"
            />
          </div>

          <div className="flex items-start gap-3 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-blue-800">
              Please provide accurate allergen information to ensure child safety. If formula or food items have expiry dates, please mention them in the details section.
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
