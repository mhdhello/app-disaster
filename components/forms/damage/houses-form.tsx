"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LocationPicker } from "@/components/location-picker"

interface HousesFormProps {
  formData: Record<string, unknown>
  onChange: (data: Record<string, unknown>) => void
}

export function HousesForm({ formData, onChange }: HousesFormProps) {
  const updateField = (field: string, value: unknown) => {
    onChange({ ...formData, [field]: value })
  }

  const damageTypes = [
    "Roof damage",
    "Wall cracks",
    "Foundation damage",
    "Flooding",
    "Landslide impact",
    "Electrical issues",
    "Structural collapse",
  ]

  const roomsAffected = ["Bedrooms", "Living area", "Kitchen", "Bathroom", "All rooms"]
  const vulnerablePersons = ["Children", "Elderly", "Disabled", "Medical needs"]
  const immediateNeeds = ["Shelter", "Food", "Medical", "Clothes", "Repair support"]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-foreground">
            Full Name (optional)
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
            Contact Number (optional)
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

      <LocationPicker
        label="Exact Location"
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
          <Label className="text-foreground">Type of Residence</Label>
          <Select
            value={(formData.residenceType as string) || ""}
            onValueChange={(value) => updateField("residenceType", value)}
          >
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="annex">Annex</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-foreground">Ownership Status</Label>
          <Select
            value={(formData.ownership as string) || ""}
            onValueChange={(value) => updateField("ownership", value)}
          >
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="owner">Owner</SelectItem>
              <SelectItem value="tenant">Tenant</SelectItem>
              <SelectItem value="rented">Rented</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="peopleAffected" className="text-foreground">
            Number of People Affected <span className="text-destructive">*</span>
          </Label>
          <Input
            id="peopleAffected"
            type="number"
            min="1"
            placeholder="Enter number"
            value={(formData.peopleAffected as string) || ""}
            onChange={(e) => updateField("peopleAffected", e.target.value)}
            className="bg-input border-border text-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-foreground">
            Severity of Damage <span className="text-destructive">*</span>
          </Label>
          <Select value={(formData.severity as string) || ""} onValueChange={(value) => updateField("severity", value)}>
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minor">Minor</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="major">Major</SelectItem>
              <SelectItem value="destroyed">Fully Destroyed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-foreground">Vulnerable Persons Present</Label>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {vulnerablePersons.map((person) => (
            <div key={person} className="flex items-center space-x-2">
              <Checkbox
                id={`vulnerable-${person}`}
                checked={((formData.vulnerablePersons as string[]) || []).includes(person)}
                onCheckedChange={(checked) => {
                  const current = (formData.vulnerablePersons as string[]) || []
                  if (checked) {
                    updateField("vulnerablePersons", [...current, person])
                  } else {
                    updateField(
                      "vulnerablePersons",
                      current.filter((p) => p !== person),
                    )
                  }
                }}
              />
              <Label htmlFor={`vulnerable-${person}`} className="text-sm text-foreground">
                {person}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-foreground">What Damages Occurred?</Label>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {damageTypes.map((damage) => (
            <div key={damage} className="flex items-center space-x-2">
              <Checkbox
                id={`damage-${damage}`}
                checked={((formData.damageTypes as string[]) || []).includes(damage)}
                onCheckedChange={(checked) => {
                  const current = (formData.damageTypes as string[]) || []
                  if (checked) {
                    updateField("damageTypes", [...current, damage])
                  } else {
                    updateField(
                      "damageTypes",
                      current.filter((d) => d !== damage),
                    )
                  }
                }}
              />
              <Label htmlFor={`damage-${damage}`} className="text-sm text-foreground">
                {damage}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="waterLevel" className="text-foreground">
            Estimated Water Level Inside (cm)
          </Label>
          <Input
            id="waterLevel"
            type="number"
            min="0"
            placeholder="Enter water level in cm"
            value={(formData.waterLevel as string) || ""}
            onChange={(e) => updateField("waterLevel", e.target.value)}
            className="bg-input border-border text-foreground"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-foreground">Rooms Affected</Label>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {roomsAffected.map((room) => (
            <div key={room} className="flex items-center space-x-2">
              <Checkbox
                id={`room-${room}`}
                checked={((formData.roomsAffected as string[]) || []).includes(room)}
                onCheckedChange={(checked) => {
                  const current = (formData.roomsAffected as string[]) || []
                  if (checked) {
                    updateField("roomsAffected", [...current, room])
                  } else {
                    updateField(
                      "roomsAffected",
                      current.filter((r) => r !== room),
                    )
                  }
                }}
              />
              <Label htmlFor={`room-${room}`} className="text-sm text-foreground">
                {room}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-foreground">Immediate Needs to Rebuild</Label>
        <textarea
          className="w-full rounded-md border border-input bg-background p-3 text-sm"
          placeholder="Enter immediate needs (comma separated or one per line)"
          value={(formData.immediateNeeds as string[])?.join("\n") || ""}
          onChange={(e) => {
            const value = e.target.value
              .split("\n")
              .map((v) => v.trim())
              .filter((v) => v !== "")

            updateField("immediateNeeds", value)
          }}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="photos" className="text-foreground">
          Photos of Damage
        </Label>
        <Input
          id="photos"
          type="file"
          multiple
          accept="image/*"
          className="bg-input border-border text-foreground file:bg-secondary file:text-foreground file:border-0"
          onChange={(e) => updateField("photos", e.target.files)}
        />
        <p className="text-xs text-muted-foreground">Upload multiple photos showing the damage</p>
      </div>
    </div>
  )
}
