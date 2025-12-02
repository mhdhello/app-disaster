"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LocationPicker } from "@/components/location-picker"

interface CleaningFormProps {
  formData: Record<string, unknown>
  onChange: (data: Record<string, unknown>) => void
}

export function CleaningForm({ formData, onChange }: CleaningFormProps) {
  const updateField = (field: string, value: unknown) => {
    onChange({ ...formData, [field]: value })
  }

  const equipmentTypes = [
    "Shovels",
    "Brooms",
    "Water pumps",
    "Pressure washers",
    "Buckets",
    "Mops",
    "Gloves",
    "Disinfectants",
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="donorName" className="text-foreground">
            Donor Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="donorName"
            placeholder="Enter your name"
            value={(formData.donorName as string) || ""}
            onChange={(e) => updateField("donorName", e.target.value)}
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

      <div className="space-y-3">
        <Label className="text-foreground">Type of Cleaning Equipment</Label>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {equipmentTypes.map((equipment) => (
            <div key={equipment} className="flex items-center space-x-2">
              <Checkbox
                id={`equipment-${equipment}`}
                checked={((formData.equipmentTypes as string[]) || []).includes(equipment)}
                onCheckedChange={(checked) => {
                  const current = (formData.equipmentTypes as string[]) || []
                  if (checked) {
                    updateField("equipmentTypes", [...current, equipment])
                  } else {
                    updateField(
                      "equipmentTypes",
                      current.filter((e) => e !== equipment),
                    )
                  }
                }}
              />
              <Label htmlFor={`equipment-${equipment}`} className="text-sm text-foreground">
                {equipment}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="quantity" className="text-foreground">
            Quantity
          </Label>
          <Input
            id="quantity"
            placeholder="Enter quantity"
            value={(formData.quantity as string) || ""}
            onChange={(e) => updateField("quantity", e.target.value)}
            className="bg-input border-border text-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-foreground">Pickup/Drop-off Preference</Label>
          <Select
            value={(formData.deliveryPreference as string) || ""}
            onValueChange={(value) => updateField("deliveryPreference", value)}
          >
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pickup">Need pickup</SelectItem>
              <SelectItem value="dropoff">Will drop off</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="availableFrom" className="text-foreground">
          Available From (date/time)
        </Label>
        <Input
          id="availableFrom"
          type="datetime-local"
          value={(formData.availableFrom as string) || ""}
          onChange={(e) => updateField("availableFrom", e.target.value)}
          className="bg-input border-border text-foreground"
        />
      </div>

      <LocationPicker
        label="Location"
        required
        value={formData.locationData as { lat: number; lng: number; address?: string } | undefined}
        onChange={(location) => updateField("locationData", location)}
      />
    </div>
  )
}
