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
import { AlertCircle, Info } from "lucide-react"

export interface FinancialSupportFormProps {
  formData: Record<string, unknown>
  onChange: (data: Record<string, unknown>) => void
}

const supportTypes = [
  { id: "transportCost", label: "Transport Cost Coverage", icon: "🚗" },
  { id: "accommodation", label: "Temporary Accommodation Funding", icon: "🏨" },
  { id: "specialNeeds", label: "Special Needs Equipment", icon: "♿" },
]

const currencyTypes = [
  { id: "lkr", label: "LKR (Sri Lankan Rupee)" },
  { id: "usd", label: "USD (US Dollar)" },
]

const transportCostCategories = [
  { id: "daily", label: "Daily Transport" },
  { id: "weekly", label: "Weekly Transport" },
  { id: "monthly", label: "Monthly Transport Coverage" },
  { id: "lumpsum", label: "Lump Sum for Specific Trip" },
]

const accommodationDurations = [
  { id: "oneweek", label: "One Week" },
  { id: "twoweeks", label: "Two Weeks" },
  { id: "onemonth", label: "One Month" },
  { id: "threemonths", label: "Three Months" },
  { id: "custom", label: "Custom Duration" },
]

const specialNeedsEquipment = [
  { id: "wheelchair", label: "Wheelchair", icon: "♿" },
  { id: "crutches", label: "Crutches/Walking Aids", icon: "🦯" },
  { id: "hearing", label: "Hearing Aids/Assistive Devices", icon: "👂" },
  { id: "mobility", label: "Mobility Equipment (Cane, Walker)", icon: "🚶" },
  { id: "ortho", label: "Orthopedic Supports/Braces", icon: "💪" },
  { id: "other", label: "Other Special Equipment", icon: "🛠️" },
]

const equipmentConditions = [
  { id: "new", label: "New" },
  { id: "excellent", label: "Excellent" },
  { id: "good", label: "Good" },
  { id: "fair", label: "Fair" },
]

const deliveryOptions = [
  { id: "directTransfer", label: "Direct Bank Transfer" },
  { id: "checkOrCash", label: "Check or Cash" },
  { id: "supplier", label: "Direct to Supplier/Service Provider" },
  { id: "contact", label: "Contact me for details" },
]

export function FinancialSupportForm({ formData, onChange }: FinancialSupportFormProps) {
  const [selectedSupport, setSelectedSupport] = useState<string[]>(
    (formData.supportTypes as string[]) || []
  )

  const handleSupportToggle = (typeId: string) => {
    const updated = selectedSupport.includes(typeId)
      ? selectedSupport.filter((id) => id !== typeId)
      : [...selectedSupport, typeId]
    setSelectedSupport(updated)
    onChange({ ...formData, supportTypes: updated })
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

  const hasTransportCost = selectedSupport.includes("transportCost")
  const hasAccommodation = selectedSupport.includes("accommodation")
  const hasSpecialNeeds = selectedSupport.includes("specialNeeds")

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

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={(formData.email as string) || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="bg-background text-foreground border-border"
            />
          </div>
        </CardContent>
      </Card>

      {/* Support Types */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Type of Support</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {supportTypes.map((support) => (
              <div key={support.id} className="flex items-center gap-3">
                <Checkbox
                  id={support.id}
                  checked={selectedSupport.includes(support.id)}
                  onCheckedChange={() => handleSupportToggle(support.id)}
                  className="border-border"
                />
                <Label
                  htmlFor={support.id}
                  className="text-sm font-medium cursor-pointer flex items-center gap-2"
                >
                  <span>{support.icon}</span>
                  {support.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transport Cost Details */}
      {hasTransportCost && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Transport Cost Coverage Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transportCategory" className="text-sm font-medium">
                  Transport Type
                </Label>
                <Select
                  value={(formData.transportCategory as string) || ""}
                  onValueChange={(value) => handleInputChange("transportCategory", value)}
                >
                  <SelectTrigger id="transportCategory" className="bg-background text-foreground border-border">
                    <SelectValue placeholder="Select transport type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    {transportCostCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="transportAmount" className="text-sm font-medium">
                  Amount
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="transportAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Amount"
                    value={(formData.transportAmount as string) || ""}
                    onChange={(e) => handleInputChange("transportAmount", e.target.value)}
                    className="bg-background text-foreground border-border flex-1"
                  />
                  <Select
                    value={(formData.transportCurrency as string) || "lkr"}
                    onValueChange={(value) => handleInputChange("transportCurrency", value)}
                  >
                    <SelectTrigger className="bg-background text-foreground border-border w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      {currencyTypes.map((curr) => (
                        <SelectItem key={curr.id} value={curr.id}>
                          {curr.id.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transportDescription" className="text-sm font-medium">
                Purpose & Details
              </Label>
              <Textarea
                id="transportDescription"
                placeholder="Describe the transport need (e.g., daily commute for work recovery, medical appointments, emergency evacuation, etc.)"
                value={(formData.transportDescription as string) || ""}
                onChange={(e) => handleInputChange("transportDescription", e.target.value)}
                className="bg-background text-foreground border-border resize-none h-20"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Accommodation Details */}
      {hasAccommodation && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Temporary Accommodation Funding Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accommodationDuration" className="text-sm font-medium">
                  Duration Covered
                </Label>
                <Select
                  value={(formData.accommodationDuration as string) || ""}
                  onValueChange={(value) => handleInputChange("accommodationDuration", value)}
                >
                  <SelectTrigger id="accommodationDuration" className="bg-background text-foreground border-border">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    {accommodationDurations.map((dur) => (
                      <SelectItem key={dur.id} value={dur.id}>
                        {dur.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accommodationAmount" className="text-sm font-medium">
                  Amount per Month
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="accommodationAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Amount"
                    value={(formData.accommodationAmount as string) || ""}
                    onChange={(e) => handleInputChange("accommodationAmount", e.target.value)}
                    className="bg-background text-foreground border-border flex-1"
                  />
                  <Select
                    value={(formData.accommodationCurrency as string) || "lkr"}
                    onValueChange={(value) => handleInputChange("accommodationCurrency", value)}
                  >
                    <SelectTrigger className="bg-background text-foreground border-border w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      {currencyTypes.map((curr) => (
                        <SelectItem key={curr.id} value={curr.id}>
                          {curr.id.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accommodationDescription" className="text-sm font-medium">
                Details & Beneficiary Information
              </Label>
              <Textarea
                id="accommodationDescription"
                placeholder="Describe the accommodation need and beneficiary details (family size, displaced due to disaster, etc.)"
                value={(formData.accommodationDescription as string) || ""}
                onChange={(e) => handleInputChange("accommodationDescription", e.target.value)}
                className="bg-background text-foreground border-border resize-none h-20"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Special Needs Equipment */}
      {hasSpecialNeeds && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Special Needs Equipment Donation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Equipment Type</Label>
              {specialNeedsEquipment.map((equipment) => (
                <div key={equipment.id} className="flex items-center gap-3">
                  <Checkbox
                    id={`equipment-${equipment.id}`}
                    checked={((formData.specialNeedsItems as string[]) || []).includes(equipment.id)}
                    onCheckedChange={(checked) => {
                      const current = ((formData.specialNeedsItems as string[]) || [])
                      const updated = checked
                        ? [...current, equipment.id]
                        : current.filter((id) => id !== equipment.id)
                      handleInputChange("specialNeedsItems", updated)
                    }}
                    className="border-border"
                  />
                  <Label
                    htmlFor={`equipment-${equipment.id}`}
                    className="text-sm font-medium cursor-pointer flex items-center gap-2"
                  >
                    <span>{equipment.icon}</span>
                    {equipment.label}
                  </Label>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="equipmentCondition" className="text-sm font-medium">
                  Condition
                </Label>
                <Select
                  value={(formData.equipmentCondition as string) || ""}
                  onValueChange={(value) => handleInputChange("equipmentCondition", value)}
                >
                  <SelectTrigger id="equipmentCondition" className="bg-background text-foreground border-border">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    {equipmentConditions.map((cond) => (
                      <SelectItem key={cond.id} value={cond.id}>
                        {cond.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="equipmentQuantity" className="text-sm font-medium">
                  Quantity
                </Label>
                <Input
                  id="equipmentQuantity"
                  type="number"
                  min="1"
                  value={(formData.equipmentQuantity as string) || ""}
                  onChange={(e) => handleInputChange("equipmentQuantity", e.target.value)}
                  className="bg-background text-foreground border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="equipmentDetails" className="text-sm font-medium">
                Equipment Details & Specifications
              </Label>
              <Textarea
                id="equipmentDetails"
                placeholder="Describe the equipment (brand, size, features, serial numbers if applicable, any special requirements, etc.)"
                value={(formData.equipmentDetails as string) || ""}
                onChange={(e) => handleInputChange("equipmentDetails", e.target.value)}
                className="bg-background text-foreground border-border resize-none h-20"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Information */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {deliveryOptions.map((option) => (
              <div key={option.id} className="flex items-center gap-3">
                <Checkbox
                  id={`delivery-${option.id}`}
                  checked={(formData.paymentMethod as string) === option.id}
                  onCheckedChange={() => handleInputChange("paymentMethod", option.id)}
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
            <Label htmlFor="bankDetails" className="text-sm font-medium">
              Bank Account Details (if applicable)
            </Label>
            <Textarea
              id="bankDetails"
              placeholder="Provide bank account information if applicable (Bank name, Account number, Swift code, etc.) - This information will be kept confidential"
              value={(formData.bankDetails as string) || ""}
              onChange={(e) => handleInputChange("bankDetails", e.target.value)}
              className="bg-background text-foreground border-border resize-none h-20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="generalNotes" className="text-sm font-medium">
              Additional Notes & Restrictions
            </Label>
            <Textarea
              id="generalNotes"
              placeholder="Any special conditions, timing requirements, or important notes"
              value={(formData.generalNotes as string) || ""}
              onChange={(e) => handleInputChange("generalNotes", e.target.value)}
              className="bg-background text-foreground border-border resize-none h-20"
            />
          </div>

          <div className="flex items-start gap-3 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-blue-800">
              We will contact you to verify details and arrange the most appropriate way to deliver your support. All financial information will be handled securely and confidentially.
            </p>
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
              onChange={handleLocationChange}
              value={(formData.locationData as { lat: number; lng: number; address?: string }) || undefined}
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
