"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LocationPicker } from "@/components/location-picker"
import { ProvinceDistrictSelector } from "../damage/province-district-selector"

interface HygieneFormProps {
  formData: Record<string, unknown>
  onChange: (data: Record<string, unknown>) => void
}

export function HygieneForm({ formData, onChange }: HygieneFormProps) {
  const updateField = (field: string, value: unknown) => {
    onChange({ ...formData, [field]: value })
  }

  const hygieneItems = [
    "Soap",
    "Shampoo",
    "Toothpaste",
    "Toothbrushes",
    "Sanitary Pads",
    "Baby Diapers",
    "Adult Diapers",
    "Wet Wipes",
    "Disinfectants",
    "Hand Sanitizer",
    "Deodorant",
    "Feminine Hygiene Products",
  ]

  const quantities = [
    "1-10 units",
    "11-50 units",
    "51-100 units",
    "101-500 units",
    "500+ units",
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
        <Label className="text-foreground">Type of Hygiene & Sanitation Items</Label>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {hygieneItems.map((item) => (
            <div key={item} className="flex items-center space-x-2">
              <Checkbox
                id={`hygiene-${item}`}
                checked={((formData.hygieneItems as string[]) || []).includes(item)}
                onCheckedChange={(checked) => {
                  const current = (formData.hygieneItems as string[]) || []
                  if (checked) {
                    updateField("hygieneItems", [...current, item])
                  } else {
                    updateField(
                      "hygieneItems",
                      current.filter((h) => h !== item),
                    )
                  }
                }}
              />
              <Label htmlFor={`hygiene-${item}`} className="text-sm text-foreground">
                {item}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-foreground">Quantity Range</Label>
          <Select
            value={(formData.quantityRange as string) || ""}
            onValueChange={(value) => updateField("quantityRange", value)}
          >
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select quantity range" />
            </SelectTrigger>
            <SelectContent>
              {quantities.map((quantity) => (
                <SelectItem key={quantity} value={quantity}>
                  {quantity}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="specificQuantity" className="text-foreground">
            Exact Quantity (Optional)
          </Label>
          <Input
            id="specificQuantity"
            placeholder="e.g., 250 pieces"
            value={(formData.specificQuantity as string) || ""}
            onChange={(e) => updateField("specificQuantity", e.target.value)}
            className="bg-input border-border text-foreground"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="expiry" className="text-foreground">
          Expiration Date (if applicable)
        </Label>
        <Input
          id="expiry"
          type="date"
          value={(formData.expiryDate as string) || ""}
          onChange={(e) => updateField("expiryDate", e.target.value)}
          className="bg-input border-border text-foreground"
        />
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
            <SelectItem value="unopened">Unopened/Sealed</SelectItem>
            <SelectItem value="opened-unused">Opened but Unused</SelectItem>
            <SelectItem value="partially-used">Partially Used</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="storage" className="text-foreground">
          Storage Conditions (Optional)
        </Label>
        <Input
          id="storage"
          placeholder="e.g., Room temperature, Refrigerated, etc."
          value={(formData.storageConditions as string) || ""}
          onChange={(e) => updateField("storageConditions", e.target.value)}
          className="bg-input border-border text-foreground"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-foreground">
          Additional Details (Optional)
        </Label>
        <Input
          id="description"
          placeholder="e.g., Hypoallergenic products, specific brands, etc."
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
