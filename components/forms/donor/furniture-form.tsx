"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FurnitureFormProps {
  formData: Record<string, unknown>
  onChange: (data: Record<string, unknown>) => void
}

export function FurnitureForm({ formData, onChange }: FurnitureFormProps) {
  const updateField = (field: string, value: unknown) => {
    onChange({ ...formData, [field]: value })
  }

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

      <div className="space-y-2">
        <Label htmlFor="furnitureType" className="text-foreground">
          Type of Furniture <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="furnitureType"
          placeholder="List furniture items (e.g., Beds, Tables, Chairs, Cupboards)"
          value={(formData.furnitureType as string) || ""}
          onChange={(e) => updateField("furnitureType", e.target.value)}
          className="bg-input border-border text-foreground"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
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
          <Label className="text-foreground">Condition</Label>
          <Select
            value={(formData.condition as string) || ""}
            onValueChange={(value) => updateField("condition", value)}
          >
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="used">Used</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-foreground">Pickup or Drop-off</Label>
          <Select
            value={(formData.deliveryMethod as string) || ""}
            onValueChange={(value) => updateField("deliveryMethod", value)}
          >
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pickup">Need pickup</SelectItem>
              <SelectItem value="dropoff">Will drop off</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="text-foreground">
          Location <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="location"
          placeholder="Enter your address"
          value={(formData.location as string) || ""}
          onChange={(e) => updateField("location", e.target.value)}
          className="bg-input border-border text-foreground"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="photos" className="text-foreground">
          Photo Upload (optional)
        </Label>
        <Input
          id="photos"
          type="file"
          multiple
          accept="image/*"
          className="bg-input border-border text-foreground file:bg-muted file:text-foreground file:border-0"
          onChange={(e) => updateField("photos", e.target.files)}
        />
      </div>
    </div>
  )
}
