"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LocationPicker } from "@/components/location-picker"

interface MedicalFormProps {
  formData: Record<string, unknown>
  onChange: (data: Record<string, unknown>) => void
}

export function MedicalForm({ formData, onChange }: MedicalFormProps) {
  const updateField = (field: string, value: unknown) => {
    onChange({ ...formData, [field]: value })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="donorName" className="text-foreground">
            Donor Name / Organization <span className="text-destructive">*</span>
          </Label>
          <Input
            id="donorName"
            placeholder="Enter name or organization"
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

      <div className="space-y-2">
        <Label htmlFor="supplies" className="text-foreground">
          Available Medical Supplies <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="supplies"
          placeholder="List the medical supplies you can donate (e.g., First Aid Kits, Medicines, Bandages)"
          value={(formData.supplies as string) || ""}
          onChange={(e) => updateField("supplies", e.target.value)}
          className="bg-input border-border text-foreground"
        />
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
          <Label htmlFor="expiryDates" className="text-foreground">
            Expiry Dates (if applicable)
          </Label>
          <Input
            id="expiryDates"
            placeholder="e.g., 2025-12-31"
            value={(formData.expiryDates as string) || ""}
            onChange={(e) => updateField("expiryDates", e.target.value)}
            className="bg-input border-border text-foreground"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-foreground">Delivery Method</Label>
          <Select
            value={(formData.deliveryMethod as string) || ""}
            onValueChange={(value) => updateField("deliveryMethod", value)}
          >
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="drop-off">Drop-off at collection point</SelectItem>
              <SelectItem value="pickup">Need pickup</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="readinessDate" className="text-foreground">
            Readiness Date
          </Label>
          <Input
            id="readinessDate"
            type="date"
            value={(formData.readinessDate as string) || ""}
            onChange={(e) => updateField("readinessDate", e.target.value)}
            className="bg-input border-border text-foreground"
          />
        </div>
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
