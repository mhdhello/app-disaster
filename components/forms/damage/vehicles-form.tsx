"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LocationPicker } from "@/components/location-picker"
import { ProvinceDistrictSelector } from "./province-district-selector"

interface VehiclesFormProps {
  formData: Record<string, unknown>
  onChange: (data: Record<string, unknown>) => void
}

export function VehiclesForm({ formData, onChange }: VehiclesFormProps) {
  const updateField = (field: string, value: unknown) => {
    onChange({ ...formData, [field]: value })
  }

  const damageTypes = ["Flooded engine", "Interior damage", "Electrical failure", "Body damage"]
  const supportNeeded = ["Towing", "Mechanical repairs", "Assessment", "Parts replacement"]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ownerName" className="text-foreground">
            Owner Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="ownerName"
            placeholder="Enter your name"
            value={(formData.ownerName as string) || ""}
            onChange={(e) => updateField("ownerName", e.target.value)}
            className="bg-input border-border text-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact" className="text-foreground">
            Contact Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="contact"
            placeholder="+94 XX XXX XXXX"
            value={(formData.contact as string) || ""}
            onChange={(e) => updateField("contact", e.target.value)}
            className="bg-input border-border text-foreground"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-foreground">
            Vehicle Type <span className="text-destructive">*</span>
          </Label>
          <Select
            value={(formData.vehicleType as string) || ""}
            onValueChange={(value) => updateField("vehicleType", value)}
          >
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="car">Car</SelectItem>
              <SelectItem value="van">Van</SelectItem>
              <SelectItem value="bus">Bus</SelectItem>
              <SelectItem value="bike">Bike</SelectItem>
              <SelectItem value="lorry">Lorry</SelectItem>
              <SelectItem value="three-wheeler">Three-wheeler</SelectItem>
              <SelectItem value="tractor">Tractor</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="vehicleNumber" className="text-foreground">
            Vehicle Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="vehicleNumber"
            placeholder="e.g., CAB-1234"
            value={(formData.vehicleNumber as string) || ""}
            onChange={(e) => updateField("vehicleNumber", e.target.value)}
            className="bg-input border-border text-foreground"
          />
        </div>
      </div>

      <ProvinceDistrictSelector formData={formData} onChange={onChange} />

      <LocationPicker
        label="Location of Vehicle"
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
        <Label className="text-foreground">Type of Damage</Label>
        <div className="grid grid-cols-2 gap-3">
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

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="waterLevel" className="text-foreground">
            Water Level at Peak (cm)
          </Label>
          <Input
            id="waterLevel"
            type="number"
            min="0"
            placeholder="Enter water level"
            value={(formData.waterLevel as string) || ""}
            onChange={(e) => updateField("waterLevel", e.target.value)}
            className="bg-input border-border text-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-foreground">Is the vehicle movable?</Label>
          <Select
            value={(formData.isMovable as string) || ""}
            onValueChange={(value) => updateField("isMovable", value)}
          >
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-foreground">Required Support</Label>
        <div className="grid grid-cols-2 gap-3">
          {supportNeeded.map((support) => (
            <div key={support} className="flex items-center space-x-2">
              <Checkbox
                id={`support-${support}`}
                checked={((formData.supportNeeded as string[]) || []).includes(support)}
                onCheckedChange={(checked) => {
                  const current = (formData.supportNeeded as string[]) || []
                  if (checked) {
                    updateField("supportNeeded", [...current, support])
                  } else {
                    updateField(
                      "supportNeeded",
                      current.filter((s) => s !== support),
                    )
                  }
                }}
              />
              <Label htmlFor={`support-${support}`} className="text-sm text-foreground">
                {support}
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
