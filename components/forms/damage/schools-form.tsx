"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LocationPicker } from "@/components/location-picker"

interface SchoolsFormProps {
  formData: Record<string, unknown>
  onChange: (data: Record<string, unknown>) => void
}

export function SchoolsForm({ formData, onChange }: SchoolsFormProps) {
  const updateField = (field: string, value: unknown) => {
    onChange({ ...formData, [field]: value })
  }

  const damageTypes = [
    "Classrooms",
    "Laboratories",
    "Furniture",
    "Books",
    "IT equipment",
    "Sports equipment",
    "Library",
  ]
  const needsTypes = ["Cleaning", "Furniture replacement", "Books", "Equipment", "Repairs", "Temporary classrooms"]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="institutionName" className="text-foreground">
            Institution Name <span className="text-destructive">*</span>
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
            Type <span className="text-destructive">*</span>
          </Label>
          <Select
            value={(formData.institutionType as string) || ""}
            onValueChange={(value) => updateField("institutionType", value)}
          >
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="school">School</SelectItem>
              <SelectItem value="tuition">Tuition Centre</SelectItem>
              <SelectItem value="university">University</SelectItem>
              <SelectItem value="training">Training Institute</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
          <Label htmlFor="studentsAffected" className="text-foreground">
            Number of Students Affected
          </Label>
          <Input
            id="studentsAffected"
            type="number"
            min="0"
            placeholder="Enter number"
            value={(formData.studentsAffected as string) || ""}
            onChange={(e) => updateField("studentsAffected", e.target.value)}
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
        <Label className="text-foreground">Damage Type</Label>
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

      <div className="space-y-3">
        <Label className="text-foreground">Needs</Label>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {needsTypes.map((need) => (
            <div key={need} className="flex items-center space-x-2">
              <Checkbox
                id={`need-${need}`}
                checked={((formData.needs as string[]) || []).includes(need)}
                onCheckedChange={(checked) => {
                  const current = (formData.needs as string[]) || []
                  if (checked) {
                    updateField("needs", [...current, need])
                  } else {
                    updateField(
                      "needs",
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
