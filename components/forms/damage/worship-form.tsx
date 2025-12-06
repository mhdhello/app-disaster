"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LocationPicker } from "@/components/location-picker"
import { ProvinceDistrictSelector } from "./province-district-selector"

interface WorshipFormProps {
  formData: Record<string, unknown>
  onChange: (data: Record<string, unknown>) => void
}

export function WorshipForm({ formData, onChange }: WorshipFormProps) {
  const updateField = (field: string, value: unknown) => {
    onChange({ ...formData, [field]: value })
  }

  const damageTypes = [
    "Structural damage",
    "Flooding",
    "Equipment damage",
    "Electrical damage",
    "Sanctum/holy area affected",
  ]

  const immediateNeeds = ["Cleaning", "Repair", "Holy books", "Arrangements", "Equipment"]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="institutionName" className="text-foreground">
            Name of Institution <span className="text-destructive">*</span>
          </Label>
          <Input
            id="institutionName"
            placeholder="Enter institution name"
            value={(formData.institutionName as string) || ""}
            onChange={(e) => updateField("institutionName", e.target.value)}
            className="bg-input border-border text-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-foreground">
            Type of Place <span className="text-destructive">*</span>
          </Label>
          <Select
            value={(formData.placeType as string) || ""}
            onValueChange={(value) => updateField("placeType", value)}
          >
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mosque">Mosque</SelectItem>
              <SelectItem value="temple">Temple</SelectItem>
              <SelectItem value="church">Church</SelectItem>
              <SelectItem value="kovil">Kovil</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ProvinceDistrictSelector formData={formData} onChange={onChange} />

      <LocationPicker
        label="Location"
        required
        value={formData.locationData as { lat: number; lng: number; address?: string } | undefined}
        onChange={(location) => updateField("locationData", location)}
      />

      <div className="space-y-2">
        <Label htmlFor="address" className="text-foreground">
          Nearby Landmark or Place Description
        </Label>
        <Input
          id="address"
          placeholder="e.g., Near school, beside market, etc."
          value={(formData.address as string) || ""}
          onChange={(e) => updateField("address", e.target.value)}
          className="bg-input border-border text-foreground"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="dailyUsers" className="text-foreground">
            Approximate Number of Daily Users
          </Label>
          <Input
            id="dailyUsers"
            type="number"
            min="0"
            placeholder="Enter number"
            value={(formData.dailyUsers as string) || ""}
            onChange={(e) => updateField("dailyUsers", e.target.value)}
            className="bg-input border-border text-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-foreground">
            Damage Severity <span className="text-destructive">*</span>
          </Label>
          <Select value={(formData.severity as string) || ""} onValueChange={(value) => updateField("severity", value)}>
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minor">Minor</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="major">Major</SelectItem>
              <SelectItem value="destroyed">Fully Destroyed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-foreground">Type of Damage</Label>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {damageTypes.map((damage) => (
            <div key={damage} className="flex items-center space-x-2">
              <Checkbox
                id={`damage-${damage}`}
                checked={((formData.damageTypes as string[]) || []).includes(damage)}
                onCheckedChange={(checked) => {
                  const current = (formData.damageTypes as string[]) || []
                  if (checked) {
                    updateField("damageTypes", [...current, damage])
                  } else {
                    updateField(
                      "damageTypes",
                      current.filter((d) => d !== damage),
                    )
                  }
                }}
              />
              <Label htmlFor={`damage-${damage}`} className="text-sm text-foreground">
                {damage}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-foreground">Any Religious Items/Books Damaged?</Label>
        <Select
          value={(formData.religiousItemsDamaged as string) || ""}
          onValueChange={(value) => updateField("religiousItemsDamaged", value)}
        >
          <SelectTrigger className="bg-input border-border text-foreground">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
            <SelectItem value="unknown">Unknown</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-foreground">Immediate Needs to Rebuild</Label>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {immediateNeeds.map((need) => (
            <div key={need} className="flex items-center space-x-2">
              <Checkbox
                id={`need-${need}`}
                checked={((formData.immediateNeeds as string[]) || []).includes(need)}
                onCheckedChange={(checked) => {
                  const current = (formData.immediateNeeds as string[]) || []
                  if (checked) {
                    updateField("immediateNeeds", [...current, need])
                  } else {
                    updateField(
                      "immediateNeeds",
                      current.filter((n) => n !== need),
                    )
                  }
                }}
              />
              <Label htmlFor={`need-${need}`} className="text-sm text-foreground">
                {need}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="photos" className="text-foreground">
          Photos
        </Label>
        <Input
          id="photos"
          type="file"
          multiple
          accept="image/*"
          className="bg-input border-border text-foreground file:bg-secondary file:text-foreground file:border-0"
          onChange={(e) => updateField("photos", e.target.files)}
        />
      </div>
    </div>
  )
}
