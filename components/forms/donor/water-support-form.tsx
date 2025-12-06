"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProvinceDistrictSelector } from "../damage/province-district-selector"

interface WaterSupportFormProps {
  formData: Record<string, unknown>
  onChange: (data: Record<string, unknown>) => void
}

export function WaterSupportForm({ formData, onChange }: WaterSupportFormProps) {
  const updateField = (field: string, value: unknown) => {
    onChange({ ...formData, [field]: value })
  }

  const equipmentTypes = ["Pumps", "Pipes", "Purifiers", "Water tanks", "Filters"]

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
        <Label className="text-foreground">Equipment Available</Label>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
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
          <Label className="text-foreground">Technical Staff Available?</Label>
          <Select
            value={(formData.technicalStaff as string) || ""}
            onValueChange={(value) => updateField("technicalStaff", value)}
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

      <ProvinceDistrictSelector formData={formData} onChange={onChange} />

      <div className="space-y-2">
        <Label htmlFor="areasSupport" className="text-foreground">
          Areas You Can Support
        </Label>
        <Textarea
          id="areasSupport"
          placeholder="List areas/districts you can support"
          value={(formData.areasSupport as string) || ""}
          onChange={(e) => updateField("areasSupport", e.target.value)}
          className="bg-input border-border text-foreground"
        />
      </div>
    </div>
  )
}
