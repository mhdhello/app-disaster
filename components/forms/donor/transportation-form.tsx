"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LocationPicker } from "@/components/location-picker"
import { ProvinceDistrictSelector } from "@/components/forms/damage/province-district-selector"
import { AlertCircle, Info } from "lucide-react"

export interface TransportationFormProps {
  formData: Record<string, unknown>
  onChange: (data: Record<string, unknown>) => void
}

const transportationServices = [
  { id: "vehicle", label: "Offering a Vehicle", icon: "🚗" },
  { id: "fuel", label: "Fuel Donations", icon: "⛽" },
  { id: "transporting", label: "Transporting Goods/Supplies", icon: "📦" },
  { id: "volunteerDriver", label: "Volunteer Driver Services", icon: "🚙" },
]

const vehicleTypes = [
  { id: "car", label: "Car/Sedan" },
  { id: "van", label: "Van/MPV" },
  { id: "truck", label: "Truck/Lorry" },
  { id: "motorcycle", label: "Motorcycle/Tuk-Tuk" },
  { id: "bicycle", label: "Bicycle/Cart" },
  { id: "other", label: "Other" },
]

const vehicleConditions = [
  { id: "excellent", label: "Excellent (Recently serviced)" },
  { id: "good", label: "Good (Good working condition)" },
  { id: "fair", label: "Fair (Basic repairs might be needed)" },
  { id: "needsRepair", label: "Needs Repair" },
]

const fuelTypes = [
  { id: "petrol", label: "Petrol" },
  { id: "diesel", label: "Diesel" },
  { id: "hybrid", label: "Hybrid" },
  { id: "other", label: "Other" },
]

const deliveryOptions = [
  { id: "pickup", label: "Pickup from my location" },
  { id: "delivery", label: "I can deliver/assist with delivery" },
  { id: "contact", label: "Contact me for details" },
]

const drivingRanges = [
  { id: "local", label: "Local (Within 10 km)" },
  { id: "district", label: "Within District" },
  { id: "province", label: "Within Province" },
  { id: "nationwide", label: "Nationwide" },
]

export function TransportationForm({ formData, onChange }: TransportationFormProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>(
    (formData.transportationServices as string[]) || []
  )

  const handleServiceToggle = (serviceId: string) => {
    const updated = selectedServices.includes(serviceId)
      ? selectedServices.filter((id) => id !== serviceId)
      : [...selectedServices, serviceId]
    setSelectedServices(updated)
    onChange({ ...formData, transportationServices: updated })
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    onChange({ ...formData, [field]: value })
  }

  const handleLocationChange = (locationData: {
    lat: number
    lng: number
    address?: string
  }) => {
    onChange({ ...formData, locationData })
  }

  const hasVehicle = selectedServices.includes("vehicle")
  const hasFuel = selectedServices.includes("fuel")
  const hasDriver = selectedServices.includes("volunteerDriver")

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="donorName" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="donorName"
                placeholder="Your name"
                value={(formData.donorName as string) || ""}
                onChange={(e) => handleInputChange("donorName", e.target.value)}
                className="bg-background text-foreground border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact" className="text-sm font-medium">
                Contact Number
              </Label>
              <Input
                id="contact"
                type="tel"
                placeholder="Your phone number"
                value={(formData.contact as string) || ""}
                onChange={(e) => handleInputChange("contact", e.target.value)}
                className="bg-background text-foreground border-border"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transportation Services */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Transportation Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {transportationServices.map((service) => (
              <div key={service.id} className="flex items-center gap-3">
                <Checkbox
                  id={service.id}
                  checked={selectedServices.includes(service.id)}
                  onCheckedChange={() => handleServiceToggle(service.id)}
                  className="border-border"
                />
                <Label
                  htmlFor={service.id}
                  className="text-sm font-medium cursor-pointer flex items-center gap-2"
                >
                  <span>{service.icon}</span>
                  {service.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Details */}
      {hasVehicle && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Vehicle Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleType" className="text-sm font-medium">
                  Vehicle Type
                </Label>
                <Select
                  value={(formData.vehicleType as string) || ""}
                  onValueChange={(value) => handleInputChange("vehicleType", value)}
                >
                  <SelectTrigger id="vehicleType" className="bg-background text-foreground border-border">
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    {vehicleTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleCondition" className="text-sm font-medium">
                  Vehicle Condition
                </Label>
                <Select
                  value={(formData.vehicleCondition as string) || ""}
                  onValueChange={(value) => handleInputChange("vehicleCondition", value)}
                >
                  <SelectTrigger id="vehicleCondition" className="bg-background text-foreground border-border">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    {vehicleConditions.map((cond) => (
                      <SelectItem key={cond.id} value={cond.id}>
                        {cond.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleMake" className="text-sm font-medium">
                  Make & Model
                </Label>
                <Input
                  id="vehicleMake"
                  placeholder="e.g., Toyota Corolla"
                  value={(formData.vehicleMake as string) || ""}
                  onChange={(e) => handleInputChange("vehicleMake", e.target.value)}
                  className="bg-background text-foreground border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleYear" className="text-sm font-medium">
                  Year
                </Label>
                <Input
                  id="vehicleYear"
                  type="number"
                  min="1990"
                  max={new Date().getFullYear()}
                  placeholder="e.g., 2020"
                  value={(formData.vehicleYear as string) || ""}
                  onChange={(e) => handleInputChange("vehicleYear", e.target.value)}
                  className="bg-background text-foreground border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleCapacity" className="text-sm font-medium">
                Cargo Capacity (approx. kg)
              </Label>
              <Input
                id="vehicleCapacity"
                type="number"
                min="0"
                placeholder="e.g., 500"
                value={(formData.vehicleCapacity as string) || ""}
                onChange={(e) => handleInputChange("vehicleCapacity", e.target.value)}
                className="bg-background text-foreground border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleDescription" className="text-sm font-medium">
                Additional Vehicle Information
              </Label>
              <Textarea
                id="vehicleDescription"
                placeholder="Any additional details about the vehicle (fuel type, special features, registration status, etc.)"
                value={(formData.vehicleDescription as string) || ""}
                onChange={(e) => handleInputChange("vehicleDescription", e.target.value)}
                className="bg-background text-foreground border-border resize-none h-20"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fuel Details */}
      {hasFuel && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Fuel Donation Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fuelType" className="text-sm font-medium">
                  Fuel Type
                </Label>
                <Select
                  value={(formData.fuelType as string) || ""}
                  onValueChange={(value) => handleInputChange("fuelType", value)}
                >
                  <SelectTrigger id="fuelType" className="bg-background text-foreground border-border">
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    {fuelTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fuelQuantity" className="text-sm font-medium">
                  Quantity (Liters)
                </Label>
                <Input
                  id="fuelQuantity"
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="e.g., 50"
                  value={(formData.fuelQuantity as string) || ""}
                  onChange={(e) => handleInputChange("fuelQuantity", e.target.value)}
                  className="bg-background text-foreground border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuelDescription" className="text-sm font-medium">
                Additional Details
              </Label>
              <Textarea
                id="fuelDescription"
                placeholder="Any additional information about the fuel donation (timing, packaging, special requirements, etc.)"
                value={(formData.fuelDescription as string) || ""}
                onChange={(e) => handleInputChange("fuelDescription", e.target.value)}
                className="bg-background text-foreground border-border resize-none h-20"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Driver Services */}
      {hasDriver && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Volunteer Driver Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="drivingRange" className="text-sm font-medium">
                Driving Range Available
              </Label>
              <Select
                value={(formData.drivingRange as string) || ""}
                onValueChange={(value) => handleInputChange("drivingRange", value)}
              >
                <SelectTrigger id="drivingRange" className="bg-background text-foreground border-border">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  {drivingRanges.map((range) => (
                    <SelectItem key={range.id} value={range.id}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseInfo" className="text-sm font-medium">
                Driving License Category
              </Label>
              <Select
                value={(formData.licenseCategory as string) || ""}
                onValueChange={(value) => handleInputChange("licenseCategory", value)}
              >
                <SelectTrigger id="licenseInfo" className="bg-background text-foreground border-border">
                  <SelectValue placeholder="Select license category" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  <SelectItem value="A">Light Vehicle (Cars - Category A)</SelectItem>
                  <SelectItem value="C">Heavy Vehicle (Trucks - Category C)</SelectItem>
                  <SelectItem value="Both">Both Light & Heavy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="driverExperience" className="text-sm font-medium">
                Years of Driving Experience
              </Label>
              <Input
                id="driverExperience"
                type="number"
                min="0"
                max="70"
                placeholder="e.g., 10"
                value={(formData.driverExperience as string) || ""}
                onChange={(e) => handleInputChange("driverExperience", e.target.value)}
                className="bg-background text-foreground border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="driverAvailability" className="text-sm font-medium">
                Availability
              </Label>
              <Select
                value={(formData.driverAvailability as string) || ""}
                onValueChange={(value) => handleInputChange("driverAvailability", value)}
              >
                <SelectTrigger id="driverAvailability" className="bg-background text-foreground border-border">
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  <SelectItem value="fulltime">Full-time</SelectItem>
                  <SelectItem value="parttime">Part-time</SelectItem>
                  <SelectItem value="weekends">Weekends Only</SelectItem>
                  <SelectItem value="evenings">Evenings/Nights Only</SelectItem>
                  <SelectItem value="flexible">Flexible/As Needed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="driverDescription" className="text-sm font-medium">
                Additional Information
              </Label>
              <Textarea
                id="driverDescription"
                placeholder="Any additional details (vehicle available for use, special skills, language proficiency, etc.)"
                value={(formData.driverDescription as string) || ""}
                onChange={(e) => handleInputChange("driverDescription", e.target.value)}
                className="bg-background text-foreground border-border resize-none h-20"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transportation Goods Section */}
      {selectedServices.includes("transporting") && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Transporting Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="transportCapacity" className="text-sm font-medium">
                Transportation Capacity (Approx. kg)
              </Label>
              <Input
                id="transportCapacity"
                type="number"
                min="0"
                placeholder="e.g., 500"
                value={(formData.transportCapacity as string) || ""}
                onChange={(e) => handleInputChange("transportCapacity", e.target.value)}
                className="bg-background text-foreground border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transportDescription" className="text-sm font-medium">
                What Types of Goods Can You Transport?
              </Label>
              <Textarea
                id="transportDescription"
                placeholder="Describe what types of goods/supplies you can help transport (medical supplies, food, construction materials, etc.)"
                value={(formData.transportDescription as string) || ""}
                onChange={(e) => handleInputChange("transportDescription", e.target.value)}
                className="bg-background text-foreground border-border resize-none h-20"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Information */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {deliveryOptions.map((option) => (
              <div key={option.id} className="flex items-center gap-3">
                <Checkbox
                  id={`delivery-${option.id}`}
                  checked={(formData.deliveryPreference as string) === option.id}
                  onCheckedChange={() => handleInputChange("deliveryPreference", option.id)}
                  className="border-border"
                />
                <Label
                  htmlFor={`delivery-${option.id}`}
                  className="text-sm font-medium cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="availabilityDate" className="text-sm font-medium">
              Available From
            </Label>
            <Input
              id="availabilityDate"
              type="date"
              value={(formData.availabilityDate as string) || ""}
              onChange={(e) => handleInputChange("availabilityDate", e.target.value)}
              className="bg-background text-foreground border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="generalNotes" className="text-sm font-medium">
              General Notes & Restrictions
            </Label>
            <Textarea
              id="generalNotes"
              placeholder="Any restrictions, special requirements, or important notes (e.g., not available during specific times, distance limitations, etc.)"
              value={(formData.generalNotes as string) || ""}
              onChange={(e) => handleInputChange("generalNotes", e.target.value)}
              className="bg-background text-foreground border-border resize-none h-20"
            />
          </div>

          <div className="flex items-start gap-3 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-blue-800">
              We will contact you to coordinate the transportation assistance and verify vehicle/fuel details.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProvinceDistrictSelector
            formData={formData}
            onChange={onChange}
          />

          <div className="mt-4">
            <LocationPicker
              onLocationChange={handleLocationChange}
              currentLocation={(formData.locationData as { lat: number; lng: number; address?: string }) || undefined}
            />
          </div>

          {!(formData.locationData as { lat: number; lng: number; address?: string }) && (
            <div className="flex items-start gap-3 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-amber-800">
                Please select your location on the map or use the "My Location" button for accurate coordination.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
