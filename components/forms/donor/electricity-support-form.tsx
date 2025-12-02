"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

interface ElectricitySupportFormProps {
  formData: Record<string, unknown>
  onChange: (data: Record<string, unknown>) => void
}

export function ElectricitySupportForm({ formData, onChange }: ElectricitySupportFormProps) {
  const updateField = (field: string, value: unknown) => {
    onChange({ ...formData, [field]: value })
  }

  const skillTypes = ["Electrical engineer", "Technician", "Lineman", "Apprentice"]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="donorName" className="text-foreground">
            Name <span className="text-destructive">*</span>
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
        <Label className="text-foreground">Skills</Label>
        <div className="grid grid-cols-2 gap-3">
          {skillTypes.map((skill) => (
            <div key={skill} className="flex items-center space-x-2">
              <Checkbox
                id={`skill-${skill}`}
                checked={((formData.skills as string[]) || []).includes(skill)}
                onCheckedChange={(checked) => {
                  const current = (formData.skills as string[]) || []
                  if (checked) {
                    updateField("skills", [...current, skill])
                  } else {
                    updateField(
                      "skills",
                      current.filter((s) => s !== skill),
                    )
                  }
                }}
              />
              <Label htmlFor={`skill-${skill}`} className="text-sm text-foreground">
                {skill}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="equipment" className="text-foreground">
          Equipment Available
        </Label>
        <Textarea
          id="equipment"
          placeholder="List any electrical equipment you have (e.g., tools, generators, etc.)"
          value={(formData.equipment as string) || ""}
          onChange={(e) => updateField("equipment", e.target.value)}
          className="bg-input border-border text-foreground"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="areaCoverage" className="text-foreground">
          Area Coverage
        </Label>
        <Textarea
          id="areaCoverage"
          placeholder="List areas/districts you can support"
          value={(formData.areaCoverage as string) || ""}
          onChange={(e) => updateField("areaCoverage", e.target.value)}
          className="bg-input border-border text-foreground"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="availability" className="text-foreground">
          Availability Schedule
        </Label>
        <Textarea
          id="availability"
          placeholder="Describe your availability"
          value={(formData.availability as string) || ""}
          onChange={(e) => updateField("availability", e.target.value)}
          className="bg-input border-border text-foreground"
        />
      </div>
    </div>
  )
}
