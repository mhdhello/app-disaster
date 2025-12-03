"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LocationPicker } from "@/components/location-picker"

interface RoadsFormProps {
  formData: Record<string, unknown>
  onChange: (data: Record<string, unknown>) => void
}

export function RoadsForm({ formData, onChange }: RoadsFormProps) {
  const updateField = (field: string, value: unknown) => {
    onChange({ ...formData, [field]: value })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="roadName" className="text-foreground">
            Road Name / Closest Landmark <span className="text-destructive">*</span>
          </Label>
          <Input
            id="roadName"
            placeholder="Enter road name or landmark"
            value={(formData.roadName as string) || ""}
            onChange={(e) => updateField("roadName", e.target.value)}
            className="bg-input border-border text-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-foreground">
            Type <span className="text-destructive">*</span>
          </Label>
          <Select value={(formData.type as string) || ""} onValueChange={(value) => updateField("type", value)}>
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="road">Road</SelectItem>
              <SelectItem value="bridge">Bridge</SelectItem>
              <SelectItem value="railway">Railway</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-foreground">
            Condition <span className="text-destructive">*</span>
          </Label>
          <Select
            value={(formData.condition as string) || ""}
            onValueChange={(value) => updateField("condition", value)}
          >
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blocked">Blocked</SelectItem>
              <SelectItem value="partially-damaged">Partially Damaged</SelectItem>
              <SelectItem value="fully-damaged">Fully Damaged</SelectItem>
              <SelectItem value="landslide">Landslide</SelectItem>
              <SelectItem value="washed-away">Washed Away</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-foreground">
            Impact on Transportation <span className="text-destructive">*</span>
          </Label>
          <Select value={(formData.impact as string) || ""} onValueChange={(value) => updateField("impact", value)}>
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select impact level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-foreground">Any Vehicles/People Trapped?</Label>
        <Select
          value={(formData.trappedPeople as string) || ""}
          onValueChange={(value) => updateField("trappedPeople", value)}
        >
          <SelectTrigger className="bg-input border-border text-foreground">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes - Immediate rescue needed</SelectItem>
            <SelectItem value="no">No</SelectItem>
            <SelectItem value="unknown">Unknown</SelectItem>
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
