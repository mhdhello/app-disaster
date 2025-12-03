"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LocationPicker } from "@/components/location-picker"

interface ShopsFormProps {
  formData: Record<string, unknown>
  onChange: (data: Record<string, unknown>) => void
}

export function ShopsForm({ formData, onChange }: ShopsFormProps) {
  const updateField = (field: string, value: unknown) => {
    onChange({ ...formData, [field]: value })
  }

  const infrastructureDamage = ["Shelving", "Machinery", "Freezers", "Cash registers", "Display units", "Storage"]
  const assistanceNeeded = ["Cleaning", "Inventory recovery", "Repair work", "Equipment replacement"]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ownerName" className="text-foreground">
            Owner/Manager Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="ownerName"
            placeholder="Enter name"
            value={(formData.ownerName as string) || ""}
            onChange={(e) => updateField("ownerName", e.target.value)}
            className="bg-input border-border text-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="businessName" className="text-foreground">
            Business Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="businessName"
            placeholder="Enter business name"
            value={(formData.businessName as string) || ""}
            onChange={(e) => updateField("businessName", e.target.value)}
            className="bg-input border-border text-foreground"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
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
        <div className="space-y-2">
          <Label className="text-foreground">Type of Business</Label>
          <Select
            value={(formData.businessType as string) || ""}
            onValueChange={(value) => updateField("businessType", value)}
          >
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="wholesale">Wholesale</SelectItem>
              <SelectItem value="food">Food & Restaurant</SelectItem>
              <SelectItem value="pharmacy">Pharmacy</SelectItem>
              <SelectItem value="other">Other</SelectItem>
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
          <Label htmlFor="stockDamage" className="text-foreground">
            Estimated Stock Damage Value (LKR)
          </Label>
          <Input
            id="stockDamage"
            type="number"
            min="0"
            placeholder="Enter amount"
            value={(formData.stockDamage as string) || ""}
            onChange={(e) => updateField("stockDamage", e.target.value)}
            className="bg-input border-border text-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="waterLevel" className="text-foreground">
            Water Level (cm)
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
      </div>

      <div className="space-y-3">
        <Label className="text-foreground">Infrastructure Damage</Label>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {infrastructureDamage.map((item) => (
            <div key={item} className="flex items-center space-x-2">
              <Checkbox
                id={`infra-${item}`}
                checked={((formData.infrastructureDamage as string[]) || []).includes(item)}
                onCheckedChange={(checked) => {
                  const current = (formData.infrastructureDamage as string[]) || []
                  if (checked) {
                    updateField("infrastructureDamage", [...current, item])
                  } else {
                    updateField(
                      "infrastructureDamage",
                      current.filter((i) => i !== item),
                    )
                  }
                }}
              />
              <Label htmlFor={`infra-${item}`} className="text-sm text-foreground">
                {item}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-foreground">Required Assistance</Label>
        <div className="grid grid-cols-2 gap-3">
          {assistanceNeeded.map((assist) => (
            <div key={assist} className="flex items-center space-x-2">
              <Checkbox
                id={`assist-${assist}`}
                checked={((formData.assistanceNeeded as string[]) || []).includes(assist)}
                onCheckedChange={(checked) => {
                  const current = (formData.assistanceNeeded as string[]) || []
                  if (checked) {
                    updateField("assistanceNeeded", [...current, assist])
                  } else {
                    updateField(
                      "assistanceNeeded",
                      current.filter((a) => a !== assist),
                    )
                  }
                }}
              />
              <Label htmlFor={`assist-${assist}`} className="text-sm text-foreground">
                {assist}
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
