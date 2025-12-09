"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LocationPicker } from "@/components/location-picker"
import { ProvinceDistrictSelector } from "../damage/province-district-selector"

interface ClothingFormProps {
  formData: Record<string, unknown>
  onChange: (data: Record<string, unknown>) => void
}

export function ClothingForm({ formData, onChange }: ClothingFormProps) {
  const updateField = (field: string, value: unknown) => {
    onChange({ ...formData, [field]: value })
  }

  const clothingTypes = [
    "Adult Clothes (M)",
    "Adult Clothes (F)",
    "Children's Clothes (0-5)",
    "Children's Clothes (5-12)",
    "Teen Clothes",
    "Blankets",
    "Pillows",
    "Towels",
    "Footwear (Adult)",
    "Footwear (Children)",
    "Undergarments (New)",
    "Winter Wear",
  ]

  const sizes = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "Mixed",
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
        <Label className="text-foreground">Type of Clothing & Items</Label>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {clothingTypes.map((clothing) => (
            <div key={clothing} className="flex items-center space-x-2">
              <Checkbox
                id={`clothing-${clothing}`}
                checked={((formData.clothingTypes as string[]) || []).includes(clothing)}
                onCheckedChange={(checked) => {
                  const current = (formData.clothingTypes as string[]) || []
                  if (checked) {
                    updateField("clothingTypes", [...current, clothing])
                  } else {
                    updateField(
                      "clothingTypes",
                      current.filter((c) => c !== clothing),
                    )
                  }
                }}
              />
              <Label htmlFor={`clothing-${clothing}`} className="text-sm text-foreground">
                {clothing}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-foreground">Size(s) Available</Label>
          <Select
            value={(formData.size as string) || ""}
            onValueChange={(value) => updateField("size", value)}
          >
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {sizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="condition" className="text-foreground">
            Condition of Items
          </Label>
          <Select
            value={(formData.condition as string) || ""}
            onValueChange={(value) => updateField("condition", value)}
          >
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New/Unused</SelectItem>
              <SelectItem value="excellent">Excellent</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity" className="text-foreground">
          Estimated Quantity / Number of Items
        </Label>
        <Input
          id="quantity"
          placeholder="e.g., 50 pieces, 20 sets, etc."
          value={(formData.quantity as string) || ""}
          onChange={(e) => updateField("quantity", e.target.value)}
          className="bg-input border-border text-foreground"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-foreground">
          Additional Details (Optional)
        </Label>
        <Input
          id="description"
          placeholder="e.g., Mix of brands, seasons, special care instructions"
          value={(formData.description as string) || ""}
          onChange={(e) => updateField("description", e.target.value)}
          className="bg-input border-border text-foreground"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
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
      </div>

      <ProvinceDistrictSelector formData={formData} onChange={onChange} />

      <LocationPicker
        label="Location"
        required
        value={formData.locationData as { lat: number; lng: number; address?: string } | undefined}
        onChange={(location) => updateField("locationData", location)}
      />
    </div>
  )
}
