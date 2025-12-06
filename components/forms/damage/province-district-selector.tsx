"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const provinces = [
  "Central",
  "Eastern",
  "North Central",
  "Northern",
  "North Western",
  "Sabaragamuwa",
  "Southern",
  "Uva",
  "Western",
]

const districtsByProvince: Record<string, string[]> = {
  Western: ["Colombo", "Gampaha", "Kalutara"],
  Central: ["Kandy", "Matale", "Nuwara Eliya"],
  Southern: ["Galle", "Matara", "Hambantota"],
  Northern: ["Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu"],
  Eastern: ["Batticaloa", "Ampara", "Trincomalee"],
  "North Western": ["Kurunegala", "Puttalam"],
  "North Central": ["Anuradhapura", "Polonnaruwa"],
  Uva: ["Badulla", "Moneragala"],
  Sabaragamuwa: ["Ratnapura", "Kegalle"],
}

interface ProvinceDistrictSelectorProps {
  formData: Record<string, unknown>
  onChange: (data: Record<string, unknown>) => void
}

export function ProvinceDistrictSelector({ formData, onChange }: ProvinceDistrictSelectorProps) {
  const updateField = (field: string, value: unknown) => {
    const newData = { ...formData, [field]: value }
    // Clear district when province changes
    if (field === "province") {
      newData.district = ""
    }
    onChange(newData)
  }

  const selectedProvince = (formData.province as string) || ""
  const availableDistricts = selectedProvince ? districtsByProvince[selectedProvince] || [] : []

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label className="text-foreground">
          Select Province <span className="text-destructive">*</span>
        </Label>
        <Select
          value={selectedProvince}
          onValueChange={(value) => updateField("province", value)}
        >
          <SelectTrigger className="bg-input border-border text-foreground">
            <SelectValue placeholder="Select province" />
          </SelectTrigger>
          <SelectContent>
            {provinces.map((province) => (
              <SelectItem key={province} value={province}>
                {province}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-foreground">
          Select District <span className="text-destructive">*</span>
        </Label>
        <Select
          value={(formData.district as string) || ""}
          onValueChange={(value) => updateField("district", value)}
          disabled={!selectedProvince}
        >
          <SelectTrigger className="bg-input border-border text-foreground">
            <SelectValue placeholder={selectedProvince ? "Select district" : "Select province first"} />
          </SelectTrigger>
          <SelectContent>
            {availableDistricts.map((district) => (
              <SelectItem key={district} value={district}>
                {district}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

