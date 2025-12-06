"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { LocationPicker } from "@/components/location-picker"
import { ProvinceDistrictSelector } from "./province-district-selector"

interface HospitalsFormProps {
  formData: Record<string, unknown>
  onChange: (data: Record<string, unknown>) => void
}

export function HospitalsForm({ formData, onChange }: HospitalsFormProps) {
  const updateField = (field: string, value: unknown) => {
    onChange({ ...formData, [field]: value })
  }

  const issueTypes = ["Flooding", "Electrical issues", "Structural damage", "Equipment damage", "Supply shortage"]
  const immediateNeeds = ["Beds", "Machines", "Medicines", "Power supply", "Staff support", "Patient evacuation"]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="hospitalName" className="text-foreground">
            Hospital/Clinic Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="hospitalName"
            placeholder="Enter name"
            value={(formData.hospitalName as string) || ""}
            onChange={(e) => updateField("hospitalName", e.target.value)}
            className="bg-input border-border text-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department" className="text-foreground">
            Department Affected
          </Label>
          <Input
            id="department"
            placeholder="e.g., Emergency, ICU, etc."
            value={(formData.department as string) || ""}
            onChange={(e) => updateField("department", e.target.value)}
            className="bg-input border-border text-foreground"
          />
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
          <Label htmlFor="patientsAffected" className="text-foreground">
            Number of Patients/Services Affected
          </Label>
          <Input
            id="patientsAffected"
            type="number"
            min="0"
            placeholder="Enter number"
            value={(formData.patientsAffected as string) || ""}
            onChange={(e) => updateField("patientsAffected", e.target.value)}
            className="bg-input border-border text-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="equipmentDamaged" className="text-foreground">
            Medical Equipment Damaged
          </Label>
          <Input
            id="equipmentDamaged"
            placeholder="List damaged equipment"
            value={(formData.equipmentDamaged as string) || ""}
            onChange={(e) => updateField("equipmentDamaged", e.target.value)}
            className="bg-input border-border text-foreground"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-foreground">Issue Type</Label>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {issueTypes.map((issue) => (
            <div key={issue} className="flex items-center space-x-2">
              <Checkbox
                id={`issue-${issue}`}
                checked={((formData.issueTypes as string[]) || []).includes(issue)}
                onCheckedChange={(checked) => {
                  const current = (formData.issueTypes as string[]) || []
                  if (checked) {
                    updateField("issueTypes", [...current, issue])
                  } else {
                    updateField(
                      "issueTypes",
                      current.filter((i) => i !== issue),
                    )
                  }
                }}
              />
              <Label htmlFor={`issue-${issue}`} className="text-sm text-foreground">
                {issue}
              </Label>
            </div>
          ))}
        </div>
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
