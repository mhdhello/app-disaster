"use client"

import { useMemo, useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useStore, type VolunteerRegistration } from "@/lib/store"
import { LocationPicker } from "@/components/location-picker"
import {
  BadgeCheck,
  CheckCircle2,
  Clock,
  FileEdit,
  Radio,
  IdCard,
  Image as ImageIcon,
  List,
  Mail,
  MapPin,
  Phone,
  Users2,
  ShieldCheck,
  Upload,
  UserCircle2,
  Users,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type ImageField = "nicFrontImage" | "nicBackImage"

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

const statusStyles: Record<VolunteerRegistration["status"], string> = {
  pending: "bg-yellow-100 text-yellow-800",
  verified: "bg-green-100 text-green-800",
  deployed: "bg-blue-100 text-blue-800",
}

const initialFormState: Record<string, unknown> = {
  fullName: "",
  email: "",
  phone: "",
  nic: "",
  district: "",
  province: "",
  skills: "",
  availability: "",
  preferredRole: "",
  groupLeaderName: "",
  groupLeaderPhone: "",
  groupLeaderIsMember: false,
  groupLeaderMemberIndex: undefined,
  nicFrontImage: undefined,
  nicBackImage: undefined,
  locationData: undefined,
  responsiblePersons: [
    {
      name: "",
      phone: "",
      relation: "",
      relationOther: "",
    },
  ],
}

export default function VolunteersPage() {
  const { volunteers, addVolunteer } = useStore()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerRegistration | null>(null)
  const [formData, setFormData] = useState<Record<string, unknown>>(initialFormState)
  const selectedProvince = formData.province as string
  const districtOptions = useMemo(() => {
    if (!selectedProvince || !districtsByProvince[selectedProvince]) return []
    return districtsByProvince[selectedProvince]
  }, [selectedProvince])

  const guardianRoles = ["Father", "Mother", "Spouse", "Child", "Other"]
  const roleOptions = [
    "Search & Rescue",
    "Medical - Doctor",
    "Medical - Nurse",
    "Medical - First Aid",
    "Logistics / Supply",
    "Cooking / Catering",
    "Child Care",
    "Elderly Care",
    "Psychosocial Support",
    "Shelter Management",
    "Cleaning / Sanitation",
    "Carpentry",
    "Masonry",
    "Plumbing",
    "Electrical",
    "Mechanical",
    "Driving - Light Vehicles",
    "Driving - Heavy Vehicles",
    "Boat Operations",
    "IT / Communications",
    "Mapping / GIS",
    "Translation",
    "Administration",
    "Security",
    "Water Purification",
    "Food Distribution",
    "Fundraising",
    "Volunteer Coordination",
    "Warehouse Management",
    "Civil Engineering",
    "Survey / Damage Assessment",
    "Agriculture Support",
    "Livestock Support",
    "Other",
  ]

  const volunteerType = (formData.volunteerType as string) || "single"
  const teamSize = Number(formData.teamSize || 0)
  const teamMembers = (formData.teamMembers as any[]) || []
  const responsiblePersons = (formData.responsiblePersons as any[]) || []

  const ensureTeamSize = (size: number) => {
    const parsed = Number.isFinite(size) && size > 0 ? Math.min(Math.floor(size), 20) : 0
    handleInputChange("teamSize", parsed)
    if (parsed === 0) {
      handleInputChange("teamMembers", [])
      return
    }
    const next = [...teamMembers]
    while (next.length < parsed) {
      next.push({
        fullName: "",
        email: "",
        phone: "",
        nic: "",
        role: "",
        roleOther: "",
        skills: "",
        responsibleName: "",
        responsiblePhone: "",
        responsibleRelation: "",
        responsibleRelationOther: "",
        nicFrontImage: "",
        nicBackImage: "",
      })
    }
    if (next.length > parsed) {
      next.length = parsed
    }
    handleInputChange("teamMembers", next)
  }

  const updateTeamMember = (index: number, field: string, value: unknown) => {
    const next = [...teamMembers]
    next[index] = { ...(next[index] || {}), [field]: value }
    handleInputChange("teamMembers", next)
  }

  // Validate image files (type + size)
  const validateImageFile = (file: File) => {
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file type", description: "Please upload an image file.", variant: "destructive" })
      return false
    }
    if (file.size > maxSize) {
      toast({ title: "File too large", description: "Image must be 2MB or smaller.", variant: "destructive" })
      return false
    }
    return true
  }

  const updateTeamMemberFile = (index: number, field: "nicFrontImage" | "nicBackImage", file?: File) => {
    if (!file) return
    if (!validateImageFile(file)) return
    const reader = new FileReader()
    reader.onload = () => {
      updateTeamMember(index, field, reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const updateResponsiblePerson = (index: number, field: string, value: unknown) => {
    const next = [...responsiblePersons]
    next[index] = { ...(next[index] || {}), [field]: value }
    handleInputChange("responsiblePersons", next)
  }

  const addResponsiblePerson = () => {
    const next = [...responsiblePersons]
    const last = next[next.length - 1] || { name: "", phone: "", relation: "", relationOther: "" }
    next.push({ ...last })
    handleInputChange("responsiblePersons", next)
  }

  const handleInputChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (field: ImageField, file: File | undefined) => {
    if (!file) return
    if (!validateImageFile(file)) return
    const reader = new FileReader()
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, [field]: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    const locationData = formData.locationData as { lat: number; lng: number; address?: string } | undefined
    const requiredSingle = ["fullName", "email", "nic", "district", "province", "locationData", "nicFrontImage", "nicBackImage"]
    const requiredTeam = ["teamSize"]
    const missingResponsible: string[] = []
    if (volunteerType === "single") {
      if (!responsiblePersons || responsiblePersons.length === 0) {
        missingResponsible.push("responsiblePersons")
      } else {
        responsiblePersons.forEach((rp, idx) => {
          if (!rp?.name) missingResponsible.push(`responsible_${idx + 1}_name`)
          if (!rp?.relation) missingResponsible.push(`responsible_${idx + 1}_relation`)
        })
      }
    }

    let missing: string[] = []
    if (volunteerType === "single") {
      missing = requiredSingle.filter((field) => !formData[field])
    } else {
      if (!teamSize || teamSize < 1) missing.push("teamSize")
      if (!formData.groupLeaderName) missing.push("groupLeaderName")
      if (!formData.groupLeaderPhone) missing.push("groupLeaderPhone")
      teamMembers.forEach((member, idx) => {
        if (!member?.fullName) missing.push(`member_${idx + 1}_fullName`)
        if (!member?.email) missing.push(`member_${idx + 1}_email`)
        if (!member?.phone) missing.push(`member_${idx + 1}_phone`)
        if (!member?.nic) missing.push(`member_${idx + 1}_nic`)
        if (!member?.role) missing.push(`member_${idx + 1}_role`)
        if (!member?.skills) missing.push(`member_${idx + 1}_skills`)
        if (!member?.responsibleName) missing.push(`member_${idx + 1}_resp_name`)
        if (!member?.responsiblePhone) missing.push(`member_${idx + 1}_resp_phone`)
        if (!member?.responsibleRelation) missing.push(`member_${idx + 1}_resp_relation`)
        if (!member?.nicFrontImage) missing.push(`member_${idx + 1}_nicFront`)
        if (!member?.nicBackImage) missing.push(`member_${idx + 1}_nicBack`)
      })

      // Leader selection: must be a member or explicitly provided
      const leaderIsMember = Boolean(formData.groupLeaderIsMember)
      if (leaderIsMember) {
        const idx = Number(formData.groupLeaderMemberIndex)
        if (!Number.isFinite(idx) || idx < 0 || idx >= teamMembers.length) {
          missing.push("groupLeaderMemberIndex")
        } else {
          if (!teamMembers[idx]?.fullName) missing.push("groupLeader_match_member_name")
          // synchronize leader name/phone with selected member if present
          const member = teamMembers[idx]
          if (member) {
            handleInputChange("groupLeaderName", member.fullName || "")
            handleInputChange("groupLeaderPhone", member.phone || "")
          }
        }
      }
    }

    if (missingResponsible.length > 0 || missing.length > 0) {
      toast({
        title: "Missing details",
        description: "Please complete all required fields including responsible person details.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    const skills =
      typeof formData.skills === "string"
        ? (formData.skills as string)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : []

    const normalizedResponsible =
      volunteerType === "single"
        ? (responsiblePersons as Array<any>)?.map((rp) => ({
            name: rp.name as string,
            phone: rp.phone as string,
            relation: rp.relation as string,
            relationOther: rp.relation === "Other" ? (rp.relationOther as string) : undefined,
          })) || []
        : undefined

    const payload = {
      fullName: formData.fullName as string,
      email: formData.email as string,
      phone: formData.phone as string,
      nic: formData.nic as string,
      district: formData.district as string,
      province: formData.province as string,
      location: locationData?.address || `${formData.district}, ${formData.province}`,
      coordinates: locationData ? { lat: locationData.lat, lng: locationData.lng } : undefined,
      nicFrontImage: formData.nicFrontImage as string,
      nicBackImage: formData.nicBackImage as string,
      skills,
      availability: formData.availability as string,
      preferredRole: formData.preferredRole as string,
      volunteerType: volunteerType as "single" | "team",
      responsiblePerson: normalizedResponsible ? normalizedResponsible[0] : undefined,
      responsiblePersons: normalizedResponsible,
      groupLeaderName: volunteerType === "team" ? (formData.groupLeaderName as string) : undefined,
      groupLeaderPhone: volunteerType === "team" ? (formData.groupLeaderPhone as string) : undefined,
      teamSize: volunteerType === "team" ? teamSize : undefined,
      teamMembers: volunteerType === "team" ? teamMembers : undefined,
      data: formData,
    }

    addVolunteer(payload)

    toast({
      title: "Volunteer registered",
      description: "Thank you for registering. Our coordination team will review your details.",
    })

    setFormData(initialFormState)
    setIsSubmitting(false)
  }

  const sortedVolunteers = useMemo(
    () =>
      [...volunteers].sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime()),
    [volunteers],
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-4 sm:py-6">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2">Volunteers</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Join the national response team or view available volunteers by district and province.
          </p>
        </div>

        <Tabs defaultValue="view" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-auto">
            <TabsTrigger value="view" className="gap-2 py-2.5 text-xs sm:text-sm">
              <List className="h-4 w-4" />
              <span className="hidden xs:inline">View All</span> Volunteers
            </TabsTrigger>
            <TabsTrigger value="form" className="gap-2 py-2.5 text-xs sm:text-sm">
              <FileEdit className="h-4 w-4" />
              Submit <span className="hidden xs:inline">Volunteer</span> Form
            </TabsTrigger>
          </TabsList>

          <TabsContent value="view" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm text-muted-foreground">Showing {sortedVolunteers.length} volunteers</p>
            </div>

            {sortedVolunteers.length === 0 ? (
              <Card className="bg-card border-border">
                <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
                  <Users className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
                  <p className="text-muted-foreground text-sm sm:text-base">No volunteers yet</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Be the first to register using the form tab</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3 sm:gap-4">
                {sortedVolunteers.map((volunteer) => (
                  <Card
                    key={volunteer.id}
                    className="bg-card border-border cursor-pointer hover:border-primary hover:shadow-md transition-all"
                    onClick={() => {
                      setSelectedVolunteer(volunteer)
                      setDialogOpen(true)
                    }}
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                        <div className="flex items-center gap-3 sm:block">
                          <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <UserCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                          </div>
                          <h3 className="font-semibold text-foreground sm:hidden">{volunteer.fullName}</h3>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground hidden sm:block">{volunteer.fullName}</h3>
                              <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm text-muted-foreground">
                                <Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                                <span className="truncate">{volunteer.email}</span>
                              </div>
                              {volunteer.phone && (
                                <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm text-muted-foreground">
                                  <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                                  <span>{volunteer.phone}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                                <span className="truncate">
                                  {volunteer.district}, {volunteer.province}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm text-muted-foreground">
                                <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                                <span>{volunteer.submittedAt.toLocaleString()}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-start sm:items-end gap-2 mt-2 sm:mt-0">
                              <Badge className={cn("text-xs", statusStyles[volunteer.status])}>{volunteer.status}</Badge>
                              <Badge variant="outline" className="text-xs flex items-center gap-1">
                                <IdCard className="h-3 w-3" />
                                {volunteer.nic}
                              </Badge>
                            </div>
                          </div>
                          {volunteer.skills && volunteer.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {volunteer.skills.map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-[11px]">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className="mt-3 flex justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedVolunteer(volunteer)
                                setDialogOpen(true)
                              }}
                              className="gap-2 text-xs sm:text-sm"
                            >
                              <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="form">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-card border-border">
                <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-lg sm:text-xl text-foreground truncate">Volunteer Sign-up</CardTitle>
                      <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                        Provide your details to support relief efforts. All fields are required unless marked optional.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 sm:p-6 pt-2 sm:pt-2 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    {/* Volunteer type */}
                    <div className="space-y-2 md:col-span-2">
                      <Label>Volunteer Type</Label>
                      <div className="flex flex-wrap gap-3">
                        {[
                          { value: "single", label: "Single" },
                          { value: "team", label: "Team / Group" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleInputChange("volunteerType", option.value)}
                            className={cn(
                              "flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
                              volunteerType === option.value
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border text-foreground hover:bg-secondary"
                            )}
                          >
                            <Radio className="h-4 w-4" data-checked={volunteerType === option.value ? "true" : "false"} />
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="Your full name"
                        value={(formData.fullName as string) || ""}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={(formData.email as string) || ""}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone (optional)</Label>
                      <Input
                        id="phone"
                        placeholder="+94 XX XXX XXXX"
                        value={(formData.phone as string) || ""}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nic">NIC Number</Label>
                      <Input
                        id="nic"
                        placeholder="NIC / Passport number"
                        value={(formData.nic as string) || ""}
                        onChange={(e) => handleInputChange("nic", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="province">Province</Label>
                      <select
                        id="province"
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        value={selectedProvince || ""}
                        onChange={(e) => {
                          handleInputChange("province", e.target.value)
                          handleInputChange("district", "")
                        }}
                      >
                        <option value="">Select province</option>
                        {provinces.map((province) => (
                          <option key={province} value={province}>
                            {province}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="district">District</Label>
                      <select
                        id="district"
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        value={(formData.district as string) || ""}
                        onChange={(e) => handleInputChange("district", e.target.value)}
                        disabled={!selectedProvince}
                      >
                        <option value="">{selectedProvince ? "Select district" : "Select province first"}</option>
                        {districtOptions.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="preferredRole">Preferred Role</Label>
                      <select
                        id="preferredRole"
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        value={(formData.preferredRole as string) || ""}
                        onChange={(e) => handleInputChange("preferredRole", e.target.value)}
                      >
                        <option value="">Select a role</option>
                        {roleOptions.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                      {formData.preferredRole === "Other" && (
                        <Input
                          className="mt-2"
                          placeholder="Specify your role"
                          value={(formData.preferredRoleOther as string) || ""}
                          onChange={(e) => handleInputChange("preferredRoleOther", e.target.value)}
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skills">Skills (comma separated)</Label>
                      <Input
                        id="skills"
                        placeholder="First aid, Driving, Carpentry"
                        value={(formData.skills as string) || ""}
                        onChange={(e) => handleInputChange("skills", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="availability">Availability</Label>
                      <Textarea
                        id="availability"
                        placeholder="Share your availability and schedule"
                        value={(formData.availability as string) || ""}
                        onChange={(e) => handleInputChange("availability", e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Responsible persons (single only) */}
                  {volunteerType === "single" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Responsible Person(s)</Label>
                          <p className="text-xs text-muted-foreground">
                            Use a parent/guardian if the volunteer is affected or underage. Add more if needed.
                          </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={addResponsiblePerson} className="gap-2">
                          + Add responsible person
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {responsiblePersons.map((rp, idx) => (
                          <div key={idx} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 rounded-md border border-border p-3">
                            <Input
                              placeholder="Name"
                              value={rp?.name || ""}
                              onChange={(e) => updateResponsiblePerson(idx, "name", e.target.value)}
                            />
                            <Input
                              placeholder="Phone (optional)"
                              value={rp?.phone || ""}
                              onChange={(e) => updateResponsiblePerson(idx, "phone", e.target.value)}
                            />
                            <select
                              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                              value={rp?.relation || ""}
                              onChange={(e) => updateResponsiblePerson(idx, "relation", e.target.value)}
                            >
                              <option value="">Relation</option>
                              {guardianRoles.map((role) => (
                                <option key={role} value={role}>
                                  {role}
                                </option>
                              ))}
                            </select>
                            {rp?.relation === "Other" ? (
                              <Input
                                placeholder="Specify relation"
                                value={rp?.relationOther || ""}
                                onChange={(e) => updateResponsiblePerson(idx, "relationOther", e.target.value)}
                              />
                            ) : (
                              <div className="hidden lg:block" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <LocationPicker
                    value={formData.locationData as any}
                    onChange={(location) => handleInputChange("locationData", location)}
                    label="Select your location"
                    required
                  />

                  {volunteerType === "single" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="nicFront">NIC Front Image</Label>
                        <label
                          htmlFor="nicFront"
                          className="flex items-center justify-between rounded-md border border-dashed border-border px-3 py-3 cursor-pointer hover:border-primary transition-colors"
                        >
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <Upload className="h-4 w-4" />
                            Upload front side
                          </div>
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        </label>
                        <input
                          id="nicFront"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageChange("nicFrontImage", e.target.files?.[0])}
                        />
                        {Boolean(formData.nicFrontImage) && (
                          <p className="text-xs text-muted-foreground">Front image selected</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nicBack">NIC Back Image</Label>
                        <label
                          htmlFor="nicBack"
                          className="flex items-center justify-between rounded-md border border-dashed border-border px-3 py-3 cursor-pointer hover:border-primary transition-colors"
                        >
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <Upload className="h-4 w-4" />
                            Upload back side
                          </div>
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        </label>
                        <input
                          id="nicBack"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageChange("nicBackImage", e.target.files?.[0])}
                        />
                        {Boolean(formData.nicBackImage) && (
                          <p className="text-xs text-muted-foreground">Back image selected</p>
                        )}
                      </div>
                    </div>
                  )}

                  {volunteerType === "team" && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="teamSize">Number of team members</Label>
                          <Input
                            id="teamSize"
                            type="number"
                            min={1}
                            max={20}
                            placeholder="e.g. 5"
                            value={teamSize || ""}
                            onChange={(e) => ensureTeamSize(Number(e.target.value))}
                          />
                          <p className="text-xs text-muted-foreground">Max 20 members.</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="groupLeaderName">Group Leader Name</Label>
                          <Input
                            id="groupLeaderName"
                            placeholder="Group leader full name"
                            value={(formData.groupLeaderName as string) || ""}
                            onChange={(e) => handleInputChange("groupLeaderName", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="groupLeaderPhone">Group Leader Phone</Label>
                          <Input
                            id="groupLeaderPhone"
                            placeholder="Contact number"
                            value={(formData.groupLeaderPhone as string) || ""}
                            onChange={(e) => handleInputChange("groupLeaderPhone", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <div className="flex items-center gap-3">
                            <input
                              id="groupLeaderIsMember"
                              type="checkbox"
                              checked={Boolean(formData.groupLeaderIsMember)}
                              onChange={(e) => {
                                handleInputChange("groupLeaderIsMember", e.target.checked)
                                if (!e.target.checked) handleInputChange("groupLeaderMemberIndex", undefined)
                              }}
                              className="h-4 w-4"
                            />
                            <label htmlFor="groupLeaderIsMember" className="text-sm text-foreground">
                              Leader is one of the team members
                            </label>
                          </div>
                          {Boolean(formData.groupLeaderIsMember) && teamSize > 0 && (
                            <select
                              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring mt-2"
                              value={typeof formData.groupLeaderMemberIndex === "number" ? String(formData.groupLeaderMemberIndex) : ""}
                              onChange={(e) => {
                                const val = e.target.value
                                const idx = val === "" ? undefined : Number(val)
                                handleInputChange("groupLeaderMemberIndex", idx)
                                if (typeof idx === "number") {
                                  const member = teamMembers[idx]
                                  handleInputChange("groupLeaderName", member?.fullName || "")
                                  handleInputChange("groupLeaderPhone", member?.phone || "")
                                } else {
                                  handleInputChange("groupLeaderName", "")
                                  handleInputChange("groupLeaderPhone", "")
                                }
                              }}
                            >
                              <option value="">Select leader from members</option>
                              {teamMembers.slice(0, teamSize).map((m, i) => (
                                <option key={i} value={i}>
                                  {m?.fullName ? `${i + 1} — ${m.fullName}` : `Member ${i + 1}`}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>

                      {teamSize > 0 && (
                        <div className="space-y-4">
                          {teamMembers.slice(0, teamSize).map((member, idx) => (
                            <Card key={idx} className="bg-muted/40 border-border">
                              <CardHeader className="pb-2 flex flex-row items-center gap-2">
                                <Users2 className="h-4 w-4 text-primary" />
                                <CardTitle className="text-base">Team Member {idx + 1}</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <Input
                                    placeholder="Full name"
                                    value={member?.fullName || ""}
                                    onChange={(e) => updateTeamMember(idx, "fullName", e.target.value)}
                                  />
                                  <Input
                                    placeholder="Email"
                                    value={member?.email || ""}
                                    onChange={(e) => updateTeamMember(idx, "email", e.target.value)}
                                  />
                                  <Input
                                    placeholder="Phone"
                                    value={member?.phone || ""}
                                    onChange={(e) => updateTeamMember(idx, "phone", e.target.value)}
                                  />
                                  <Input
                                    placeholder="NIC / Passport number"
                                    value={member?.nic || ""}
                                    onChange={(e) => updateTeamMember(idx, "nic", e.target.value)}
                                  />
                                  <div className="space-y-1">
                                    <select
                                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                      value={member?.role || ""}
                                      onChange={(e) => updateTeamMember(idx, "role", e.target.value)}
                                    >
                                      <option value="">Select role</option>
                                      {roleOptions.map((role) => (
                                        <option key={role} value={role}>
                                          {role}
                                        </option>
                                      ))}
                                    </select>
                                    {member?.role === "Other" && (
                                      <Input
                                        placeholder="Specify role"
                                        value={member?.roleOther || ""}
                                        onChange={(e) => updateTeamMember(idx, "roleOther", e.target.value)}
                                        className="mt-2"
                                      />
                                    )}
                                  </div>
                                  <Input
                                    placeholder="Skills (comma separated)"
                                    value={member?.skills || ""}
                                    onChange={(e) => updateTeamMember(idx, "skills", e.target.value)}
                                  />
                                  <div className="space-y-1">
                                    <Input
                                      placeholder="Responsible person name"
                                      value={member?.responsibleName || ""}
                                      onChange={(e) => updateTeamMember(idx, "responsibleName", e.target.value)}
                                    />
                                    <Input
                                      placeholder="Responsible person phone"
                                      value={member?.responsiblePhone || ""}
                                      onChange={(e) => updateTeamMember(idx, "responsiblePhone", e.target.value)}
                                      className="mt-2"
                                    />
                                    <select
                                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring mt-2"
                                      value={member?.responsibleRelation || ""}
                                      onChange={(e) => updateTeamMember(idx, "responsibleRelation", e.target.value)}
                                    >
                                      <option value="">Responsible relation</option>
                                      {guardianRoles.map((role) => (
                                        <option key={role} value={role}>
                                          {role}
                                        </option>
                                      ))}
                                    </select>
                                    {member?.responsibleRelation === "Other" && (
                                      <Input
                                        placeholder="Specify responsible relation"
                                        value={member?.responsibleRelationOther || ""}
                                        onChange={(e) => updateTeamMember(idx, "responsibleRelationOther", e.target.value)}
                                        className="mt-2"
                                      />
                                    )}
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div className="space-y-2">
                                    <Label>NIC Front Image</Label>
                                    <label className="flex items-center justify-between rounded-md border border-dashed border-border px-3 py-3 cursor-pointer hover:border-primary transition-colors">
                                      <div className="flex items-center gap-2 text-sm text-foreground">
                                        <Upload className="h-4 w-4" />
                                        Upload front side
                                      </div>
                                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => updateTeamMemberFile(idx, "nicFrontImage", e.target.files?.[0])}
                                      />
                                    </label>
                                    {member?.nicFrontImage && (
                                      <p className="text-xs text-muted-foreground">Front image selected</p>
                                    )}
                                  </div>
                                  <div className="space-y-2">
                                    <Label>NIC Back Image</Label>
                                    <label className="flex items-center justify-between rounded-md border border-dashed border-border px-3 py-3 cursor-pointer hover:border-primary transition-colors">
                                      <div className="flex items-center gap-2 text-sm text-foreground">
                                        <Upload className="h-4 w-4" />
                                        Upload back side
                                      </div>
                                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => updateTeamMemberFile(idx, "nicBackImage", e.target.files?.[0])}
                                      />
                                    </label>
                                    {member?.nicBackImage && (
                                      <p className="text-xs text-muted-foreground">Back image selected</p>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setFormData(initialFormState)}
                      className="order-2 sm:order-1 flex-1 border-border text-foreground hover:bg-secondary"
                    >
                      Reset
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="order-1 sm:order-2 flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {isSubmitting ? (
                        "Submitting..."
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Submit Volunteer Form
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-primary" />
              Volunteer Details
            </DialogTitle>
          </DialogHeader>
          {selectedVolunteer && (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <UserCircle2 className="h-4 w-4 text-primary" />
                <span className="font-semibold text-foreground">{selectedVolunteer.fullName}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Email</p>
                  <p>{selectedVolunteer.email}</p>
                </div>
                {selectedVolunteer.phone && (
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Phone</p>
                    <p>{selectedVolunteer.phone}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">NIC</p>
                  <p>{selectedVolunteer.nic}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">District / Province</p>
                  <p>
                    {selectedVolunteer.district}, {selectedVolunteer.province}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Status</p>
                  <Badge className={cn("w-fit", statusStyles[selectedVolunteer.status])}>
                    {selectedVolunteer.status}
                  </Badge>
                </div>
                {selectedVolunteer.location && (
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Location</p>
                    <p className="line-clamp-2">{selectedVolunteer.location}</p>
                  </div>
                )}
              </div>
              {selectedVolunteer.skills && selectedVolunteer.skills.length > 0 && (
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedVolunteer.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-[11px]">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {selectedVolunteer.availability && (
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Availability</p>
                  <p>{selectedVolunteer.availability}</p>
                </div>
              )}
              {selectedVolunteer.preferredRole && (
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Preferred Role</p>
                  <p>{selectedVolunteer.preferredRole}</p>
                </div>
              )}
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">Submitted</p>
                <p>{selectedVolunteer.submittedAt.toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

