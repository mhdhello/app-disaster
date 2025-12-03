"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LocationPicker } from "@/components/location-picker"

interface ElectricityFormProps {
  formData: Record<string, unknown>
  onChange: (data: Record<string, unknown>) => void
}

export function ElectricityForm({ formData, onChange }: ElectricityFormProps) {
  const updateField = (field: string, value: unknown) => {
    onChange({ ...formData, [field]: value })
  }

  const issueTypes = ["Power outage", "Damaged transformer", "Exposed wires", "Substation flood", "Fallen poles"]

  return (
    <div className="space-y-6">
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

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-foreground">
            Severity <span className="text-destructive">*</span>
          </Label>
          <Select value={(formData.severity as string) || ""} onValueChange={(value) => updateField("severity", value)}>
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minor">Minor</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="major">Major</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="housesAffected" className="text-foreground">
            Houses Affected
          </Label>
          <Input
            id="housesAffected"
            type="number"
            min="0"
            placeholder="Estimated number"
            value={(formData.housesAffected as string) || ""}
            onChange={(e) => updateField("housesAffected", e.target.value)}
            className="bg-input border-border text-foreground"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-foreground">
          Immediate Danger? <span className="text-destructive">*</span>
        </Label>
        <Select
          value={(formData.immediateDanger as string) || ""}
          onValueChange={(value) => updateField("immediateDanger", value)}
        >
          <SelectTrigger className="bg-input border-border text-foreground">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes - Risk to life</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
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
