"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { LocationPicker } from "@/components/location-picker"
import { ProvinceDistrictSelector } from "./province-district-selector"

interface WaterFormProps {
  formData: Record<string, unknown>
  onChange: (data: Record<string, unknown>) => void
}

export function WaterForm({ formData, onChange }: WaterFormProps) {
  const updateField = (field: string, value: unknown) => {
    onChange({ ...formData, [field]: value })
  }

  const issueTypes = ["Pipe burst", "Pump failure", "Contaminated water", "Supply decline", "No water supply"]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="areaName" className="text-foreground">
            Area Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="areaName"
            placeholder="Enter area name"
            value={(formData.areaName as string) || ""}
            onChange={(e) => updateField("areaName", e.target.value)}
            className="bg-input border-border text-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="familiesAffected" className="text-foreground">
            Number of Families Affected
          </Label>
          <Input
            id="familiesAffected"
            type="number"
            min="0"
            placeholder="Enter number"
            value={(formData.familiesAffected as string) || ""}
            onChange={(e) => updateField("familiesAffected", e.target.value)}
            className="bg-input border-border text-foreground"
          />
        </div>
      </div>

      <ProvinceDistrictSelector formData={formData} onChange={onChange} />

      <LocationPicker
        label="GPS Location"
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

      <div className="space-y-3">
        <Label className="text-foreground">Type of Issue</Label>
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
