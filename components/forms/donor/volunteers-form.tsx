"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { LocationPicker } from "@/components/location-picker"

interface VolunteersFormProps {
  formData: Record<string, unknown>
  onChange: (data: Record<string, unknown>) => void
}

export function VolunteersForm({ formData, onChange }: VolunteersFormProps) {
  const updateField = (field: string, value: unknown) => {
    onChange({ ...formData, [field]: value })
  }

  const skillTypes = [
    "Cleaning",
    "Electrical",
    "Carpentry",
    "Plumbing",
    "General labor",
    "Medical/First Aid",
    "Cooking",
    "Driving",
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-foreground">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fullName"
            placeholder="Enter your name"
            value={(formData.fullName as string) || ""}
            onChange={(e) => updateField("fullName", e.target.value)}
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
        <Label htmlFor="volunteersCount" className="text-foreground">
          Number of Volunteers Available
        </Label>
        <Input
          id="volunteersCount"
          type="number"
          min="1"
          placeholder="Enter number"
          value={(formData.volunteersCount as string) || ""}
          onChange={(e) => updateField("volunteersCount", e.target.value)}
          className="bg-input border-border text-foreground"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-foreground">Skills Available</Label>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
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
        <Label htmlFor="availability" className="text-foreground">
          Availability (Dates & Times)
        </Label>
        <Textarea
          id="availability"
          placeholder="Describe your availability (e.g., Weekends 8am-5pm, Mon-Fri after 4pm)"
          value={(formData.availability as string) || ""}
          onChange={(e) => updateField("availability", e.target.value)}
          className="bg-input border-border text-foreground"
        />
      </div>

      <LocationPicker
        label="Your Base Location"
        value={formData.locationData as { lat: number; lng: number; address?: string } | undefined}
        onChange={(location) => updateField("locationData", location)}
      />

      <div className="space-y-2">
        <Label htmlFor="coverageAreas" className="text-foreground">
          Additional Areas You Can Cover
        </Label>
        <Textarea
          id="coverageAreas"
          placeholder="List additional areas/districts you can travel to"
          value={(formData.coverageAreas as string) || ""}
          onChange={(e) => updateField("coverageAreas", e.target.value)}
          className="bg-input border-border text-foreground"
        />
      </div>
    </div>
  )
}
