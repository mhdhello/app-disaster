"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { VolunteerRegistration } from "@/lib/store"
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import {
  UserCircle2,
  BadgeCheck,
  Mail,
  Phone,
  MapPin,
  Users,
  Briefcase,
  Award,
  ClipboardList,
  FileText,
  Calendar,
  Edit2,
  Save,
  X,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  verified: "bg-green-100 text-green-800",
  deployed: "bg-blue-100 text-blue-800",
}

interface VolunteerDetailDialogProps {
  volunteer: VolunteerRegistration
  onClose: () => void
}

export function VolunteerDetailDialog({ volunteer, onClose }: VolunteerDetailDialogProps) {
  const { updateVolunteer } = useStore()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(volunteer)

  const handleSave = () => {
    updateVolunteer(volunteer.id, editData)
    toast({
      title: "Volunteer updated",
      description: "Changes have been saved successfully.",
    })
    setIsEditing(false)
  }

  const handleEditChange = (field: string, value: any) => {
    setEditData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BadgeCheck className="h-5 w-5 text-primary" />
            <div>
              <DialogTitle className="text-xl">
                {isEditing ? "Edit Volunteer" : "Volunteer Details"}
              </DialogTitle>
              <DialogDescription>
                {volunteer.volunteerType === "team" ? "Team volunteer" : "Individual volunteer"}
              </DialogDescription>
            </div>
          </div>
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="text-primary hover:bg-primary/10"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </DialogHeader>

      {isEditing ? (
        <div className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="team">Team Info</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={editData.fullName}
                    onChange={(e) => handleEditChange("fullName", e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={editData.email}
                    onChange={(e) => handleEditChange("email", e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={editData.phone || ""}
                    onChange={(e) => handleEditChange("phone", e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>NIC</Label>
                  <Input
                    value={editData.nic}
                    onChange={(e) => handleEditChange("nic", e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>District</Label>
                  <Input
                    value={editData.district}
                    onChange={(e) => handleEditChange("district", e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Province</Label>
                  <Input
                    value={editData.province}
                    onChange={(e) => handleEditChange("province", e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Availability</Label>
                <Textarea
                  value={editData.availability || ""}
                  onChange={(e) => handleEditChange("availability", e.target.value)}
                  className="bg-background border-border"
                />
              </div>
            </TabsContent>

            <TabsContent value="professional" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Preferred Role</Label>
                  <Input
                    value={editData.preferredRole || ""}
                    onChange={(e) => handleEditChange("preferredRole", e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Years of Experience</Label>
                  <Input
                    type="number"
                    value={editData.yearsOfExperience || ""}
                    onChange={(e) => handleEditChange("yearsOfExperience", e.target.value ? Number(e.target.value) : undefined)}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Medical License / Certification</Label>
                  <Input
                    value={editData.medicalLicense || ""}
                    onChange={(e) => handleEditChange("medicalLicense", e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Dietary Restrictions</Label>
                  <Input
                    value={editData.dietaryRestrictions || ""}
                    onChange={(e) => handleEditChange("dietaryRestrictions", e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Certifications</Label>
                <Textarea
                  value={editData.certifications || ""}
                  onChange={(e) => handleEditChange("certifications", e.target.value)}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label>Special Training</Label>
                <Textarea
                  value={editData.specialTraining || ""}
                  onChange={(e) => handleEditChange("specialTraining", e.target.value)}
                  className="bg-background border-border"
                />
              </div>
            </TabsContent>

            <TabsContent value="team" className="space-y-4">
              {volunteer.volunteerType === "team" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Team Size</Label>
                      <Input
                        type="number"
                        value={editData.teamSize || ""}
                        onChange={(e) => handleEditChange("teamSize", e.target.value ? Number(e.target.value) : undefined)}
                        className="bg-background border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Group Leader Name</Label>
                      <Input
                        value={editData.groupLeaderName || ""}
                        onChange={(e) => handleEditChange("groupLeaderName", e.target.value)}
                        className="bg-background border-border"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Group Leader Phone</Label>
                    <Input
                      value={editData.groupLeaderPhone || ""}
                      onChange={(e) => handleEditChange("groupLeaderPhone", e.target.value)}
                      className="bg-background border-border"
                    />
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false)
                setEditData(volunteer)
              }}
              className="border-border"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="team">Team Info</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs font-semibold uppercase">Full Name</p>
                  <p className="font-medium text-foreground">{volunteer.fullName}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs font-semibold uppercase">Status</p>
                  <Badge className={cn("w-fit", statusStyles[volunteer.status])}>
                    {volunteer.status.charAt(0).toUpperCase() + volunteer.status.slice(1)}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs font-semibold uppercase flex items-center gap-1">
                    <Mail className="h-3 w-3" /> Email
                  </p>
                  <p className="text-foreground break-all">{volunteer.email}</p>
                </div>
                {volunteer.phone && (
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-xs font-semibold uppercase flex items-center gap-1">
                      <Phone className="h-3 w-3" /> Phone
                    </p>
                    <p className="text-foreground">{volunteer.phone}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs font-semibold uppercase">NIC / Passport</p>
                  <p className="text-foreground font-mono">{volunteer.nic}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs font-semibold uppercase flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Location
                  </p>
                  <p className="text-foreground">{volunteer.district}, {volunteer.province}</p>
                </div>
              </div>

              {volunteer.location && (
                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs font-semibold uppercase">Full Address</p>
                  <p className="text-foreground">{volunteer.location}</p>
                </div>
              )}

              {volunteer.availability && (
                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs font-semibold uppercase">Availability & Schedule</p>
                  <p className="text-foreground whitespace-pre-wrap">{volunteer.availability}</p>
                </div>
              )}

              {volunteer.preferredRole && (
                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs font-semibold uppercase flex items-center gap-1">
                    <Briefcase className="h-3 w-3" /> Preferred Role
                  </p>
                  <p className="text-foreground">{volunteer.preferredRole}</p>
                </div>
              )}

              {volunteer.skills && volunteer.skills.length > 0 && (
                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs font-semibold uppercase flex items-center gap-1">
                    <Award className="h-3 w-3" /> Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {volunteer.skills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Professional Tab */}
            <TabsContent value="professional" className="space-y-4">
              {volunteer.yearsOfExperience && (
                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs font-semibold uppercase">Years of Experience</p>
                  <p className="text-foreground">{volunteer.yearsOfExperience} years</p>
                </div>
              )}

              {volunteer.medicalLicense && (
                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs font-semibold uppercase">License / Certification</p>
                  <p className="text-foreground">{volunteer.medicalLicense}</p>
                </div>
              )}

              {volunteer.certifications && (
                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs font-semibold uppercase">Certifications</p>
                  <p className="text-foreground whitespace-pre-wrap">{volunteer.certifications}</p>
                </div>
              )}

              {volunteer.specialTraining && (
                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs font-semibold uppercase">Special Training</p>
                  <p className="text-foreground whitespace-pre-wrap">{volunteer.specialTraining}</p>
                </div>
              )}

              {volunteer.equipmentAvailable && (
                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs font-semibold uppercase">Equipment Available</p>
                  <p className="text-foreground">{volunteer.equipmentAvailable}</p>
                </div>
              )}

              {volunteer.dietaryRestrictions && (
                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs font-semibold uppercase">Dietary Restrictions</p>
                  <p className="text-foreground">{volunteer.dietaryRestrictions}</p>
                </div>
              )}

              {volunteer.accessibilityNeeds && (
                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs font-semibold uppercase">Accessibility Needs</p>
                  <p className="text-foreground">{volunteer.accessibilityNeeds}</p>
                </div>
              )}

              {!volunteer.yearsOfExperience &&
                !volunteer.medicalLicense &&
                !volunteer.certifications &&
                !volunteer.specialTraining && (
                  <p className="text-muted-foreground text-sm">No professional details provided</p>
                )}
            </TabsContent>

            {/* Team Info Tab */}
            <TabsContent value="team" className="space-y-4">
              {volunteer.volunteerType === "team" ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-xs font-semibold uppercase flex items-center gap-1">
                        <Users className="h-3 w-3" /> Team Size
                      </p>
                      <p className="text-foreground text-lg font-semibold">{volunteer.teamSize} members</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-xs font-semibold uppercase">Group Leader</p>
                      <p className="text-foreground">{volunteer.groupLeaderName}</p>
                    </div>
                  </div>

                  {volunteer.groupLeaderPhone && (
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-xs font-semibold uppercase flex items-center gap-1">
                        <Phone className="h-3 w-3" /> Leader Phone
                      </p>
                      <p className="text-foreground">{volunteer.groupLeaderPhone}</p>
                    </div>
                  )}

                  {volunteer.teamMembers && volunteer.teamMembers.length > 0 && (
                    <div className="space-y-3 border-t pt-4">
                      <p className="text-muted-foreground text-xs font-semibold uppercase">Team Members</p>
                      <div className="space-y-3">
                        {volunteer.teamMembers.map((member, idx) => (
                          <div key={idx} className="border border-border rounded-lg p-3 bg-muted/30">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-muted-foreground text-xs">Name</p>
                                <p className="font-medium text-foreground">{member.fullName}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">Role</p>
                                <p className="font-medium text-foreground">{member.role}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">Email</p>
                                <p className="text-foreground break-all text-xs">{member.email}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">Phone</p>
                                <p className="text-foreground">{member.phone}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div>
                  {volunteer.responsiblePerson && (
                    <div className="space-y-3">
                      <p className="text-muted-foreground text-xs font-semibold uppercase">Emergency Contact</p>
                      <div className="border border-border rounded-lg p-3 bg-muted/30 space-y-2">
                        <div>
                          <p className="text-muted-foreground text-xs">Name</p>
                          <p className="text-foreground">{volunteer.responsiblePerson.name}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Relation</p>
                          <p className="text-foreground">{volunteer.responsiblePerson.relation}</p>
                        </div>
                        {volunteer.responsiblePerson.phone && (
                          <div>
                            <p className="text-muted-foreground text-xs">Phone</p>
                            <p className="text-foreground">{volunteer.responsiblePerson.phone}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {volunteer.submittedAt && (
            <div className="border-t pt-4 space-y-1">
              <p className="text-muted-foreground text-xs flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Submitted
              </p>
              <p className="text-sm text-foreground">{new Date(volunteer.submittedAt).toLocaleString()}</p>
            </div>
          )}
        </div>
      )}
    </DialogContent>
  )
}
