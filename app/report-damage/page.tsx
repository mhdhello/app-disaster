"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useStore, type DamageReport } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { ReportDetailDialog } from "@/components/report-detail-dialog"
import {
  Home,
  Church,
  Store,
  Car,
  GraduationCap,
  Route,
  Zap,
  Droplets,
  Stethoscope,
  Wifi,
  ChevronRight,
  ArrowLeft,
  Send,
  List,
  FileEdit,
  MapPin,
  Clock,
  AlertTriangle,
  Eye,
  Image as ImageIcon,
} from "lucide-react"

import { HousesForm } from "@/components/forms/damage/houses-form"
import { WorshipForm } from "@/components/forms/damage/worship-form"
import { ShopsForm } from "@/components/forms/damage/shops-form"
import { VehiclesForm } from "@/components/forms/damage/vehicles-form"
import { SchoolsForm } from "@/components/forms/damage/schools-form"
import { RoadsForm } from "@/components/forms/damage/roads-form"
import { ElectricityForm } from "@/components/forms/damage/electricity-form"
import { WaterForm } from "@/components/forms/damage/water-form"
import { HospitalsForm } from "@/components/forms/damage/hospitals-form"
import { TelecomForm } from "@/components/forms/damage/telecom-form"

const categories = [
  { id: "houses", label: "Houses / Residential", icon: Home, description: "Report residential property damage" },
  { id: "worship", label: "Worshipping Places", icon: Church, description: "Mosques, Temples, Churches, Kovils" },
  { id: "shops", label: "Shops & Commercial", icon: Store, description: "Business and commercial properties" },
  { id: "vehicles", label: "Vehicles", icon: Car, description: "Cars, vans, bikes, three-wheelers" },
  { id: "schools", label: "Schools & Institutes", icon: GraduationCap, description: "Educational facilities" },
  { id: "roads", label: "Roads & Railways", icon: Route, description: "Transportation infrastructure" },
  { id: "electricity", label: "Electricity & Power", icon: Zap, description: "Power outages and electrical damage" },
  { id: "water", label: "Water & Pipelines", icon: Droplets, description: "Water supply issues" },
  { id: "hospitals", label: "Hospitals & Clinics", icon: Stethoscope, description: "Medical facilities" },
  { id: "telecom", label: "Telecommunications", icon: Wifi, description: "Internet and phone services" },
]

const formComponents: Record<
  string,
  React.FC<{ formData: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void }>
> = {
  houses: HousesForm,
  worship: WorshipForm,
  shops: ShopsForm,
  vehicles: VehiclesForm,
  schools: SchoolsForm,
  roads: RoadsForm,
  electricity: ElectricityForm,
  water: WaterForm,
  hospitals: HospitalsForm,
  telecom: TelecomForm,
}

const categoryIcons: Record<string, React.ElementType> = {
  houses: Home,
  worship: Church,
  shops: Store,
  vehicles: Car,
  schools: GraduationCap,
  roads: Route,
  electricity: Zap,
  water: Droplets,
  hospitals: Stethoscope,
  telecom: Wifi,
}

const severityColors: Record<string, string> = {
  minor: "bg-green-100 text-green-800",
  moderate: "bg-yellow-100 text-yellow-800",
  major: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
  destroyed: "bg-red-100 text-red-800",
  Critical: "bg-red-100 text-red-800",
  Major: "bg-orange-100 text-orange-800",
  Moderate: "bg-yellow-100 text-yellow-800",
  Minor: "bg-green-100 text-green-800",
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  reviewed: "bg-blue-100 text-blue-800",
  assigned: "bg-purple-100 text-purple-800",
  resolved: "bg-green-100 text-green-800",
}

export default function ReportDamagePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedReport, setSelectedReport] = useState<DamageReport | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { damageReports, addDamageReport, loadDamageReports, isLoadingReports } = useStore()
  const { toast } = useToast()

  // Load reports from Firebase on mount
  useEffect(() => {
    loadDamageReports().catch((error) => {
      console.error("Error loading damage reports:", error)
      toast({
        title: "Error",
        description: "Failed to load damage reports. Please refresh the page.",
        variant: "destructive",
      })
    })
  }, [loadDamageReports, toast])

  const handleViewReport = (report: DamageReport) => {
    setSelectedReport(report)
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!selectedCategory) return

    setIsSubmitting(true)

    try {
      const locationData = formData.locationData as { lat: number; lng: number; address?: string } | undefined
      const photos = formData.photos as FileList | null

      // Create a clean copy of formData without the FileList (which can't be stored in Firestore)
      // Remove photos FileList but keep all other form fields including locationData
      const { photos: _, ...cleanFormData } = formData

      // Ensure locationData is properly set (it should already be in cleanFormData, but ensure it's correct)
      if (locationData) {
        cleanFormData.locationData = locationData
      }

      // All form fields are now in cleanFormData, including:
      // - Common fields: province, district, address, locationData
      // - Category-specific fields: varies by category (fullName, contact, institutionName, etc.)
      // - All checkbox arrays: vulnerablePersons, damageTypes, issueTypes, etc.
      const reportData = cleanFormData

      // Debug: log the report payload (cleaned) so we can inspect missing fields
      try {
        // stringify safely by removing potential non-serializable items
        const safe = JSON.parse(JSON.stringify(reportData))
        console.log("Submitting damage report data:", { category: selectedCategory, data: safe, severity: (formData.severity as string) || "unknown" })
      } catch (err) {
        console.log("Submitting damage report data (non-serializable) - sending anyway", { category: selectedCategory })
      }

      await addDamageReport(
        {
          category: selectedCategory,
          location: locationData?.address || (formData.location as string) || "Location not specified",
          lat: locationData?.lat !== undefined ? locationData.lat : null,
          lon: locationData?.lng !== undefined ? locationData.lng : null,
          severity: (formData.severity as string) || "unknown",
          data: reportData,
        },
        photos
      )

      toast({
        title: "Report Submitted",
        description: "Your damage report has been submitted successfully. Help is on the way.",
      })

      setFormData({})
      setSelectedCategory(null)
    } catch (error) {
      console.error("Error submitting report:", error)
      toast({
        title: "Error",
        description: "Failed to submit damage report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedCategoryData = categories.find((c) => c.id === selectedCategory)
  const FormComponent = selectedCategory ? formComponents[selectedCategory] : null

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-4 sm:py-6">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2">Report Flood Damage</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Submit damage reports or view existing reports in your area.
          </p>
        </div>

        <Tabs defaultValue="view" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-auto">
            <TabsTrigger value="view" className="gap-2 py-2.5 text-xs sm:text-sm">
              <List className="h-4 w-4" />
              <span className="hidden xs:inline">View All</span> Reports
            </TabsTrigger>
            <TabsTrigger value="form" className="gap-2 py-2.5 text-xs sm:text-sm">
              <FileEdit className="h-4 w-4" />
              Submit <span className="hidden xs:inline">Report</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="view" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm text-muted-foreground">
                {isLoadingReports ? "Loading..." : `Showing ${damageReports.length} damage reports`}
              </p>
            </div>

            {isLoadingReports ? (
              <Card className="bg-card border-border">
                <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
                  <p className="text-muted-foreground text-sm sm:text-base">Loading damage reports...</p>
                </CardContent>
              </Card>
            ) : damageReports.length === 0 ? (
              <Card className="bg-card border-border">
                <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
                  <AlertTriangle className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
                  <p className="text-muted-foreground text-sm sm:text-base">No damage reports yet</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Submit a report using the form tab</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3 sm:gap-4">
                {damageReports.map((report) => {
                  const Icon = categoryIcons[report.category] || AlertTriangle
                  return (
                    <Card 
                      key={report.id} 
                      className="bg-card border-border cursor-pointer hover:border-primary hover:shadow-md transition-all"
                      onClick={() => handleViewReport(report)}
                    >
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                          <div className="flex items-center gap-3 sm:block">
                            <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                              <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                            </div>
                            {/* Mobile-only title next to icon */}
                            <h3 className="font-semibold text-foreground capitalize sm:hidden">
                              {report.category.replace(/-/g, " ")} Damage
                            </h3>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                              <div className="flex-1">
                                {/* Desktop title */}
                                <h3 className="font-semibold text-foreground capitalize hidden sm:block">
                                  {report.category.replace(/-/g, " ")} Damage
                                </h3>
                                <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm text-muted-foreground">
                                  <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                                  <span className="truncate">{report.location}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm text-muted-foreground">
                                  <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                                  <span>{new Date(report.timestamp).toLocaleString()}</span>
                                </div>
                              </div>
                              <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2 mt-2 sm:mt-0">
                                <Badge
                                  className={`text-xs ${severityColors[report.severity] || "bg-gray-100 text-gray-800"}`}
                                >
                                  {report.severity}
                                </Badge>
                                <Badge variant="outline" className={`text-xs ${statusColors[report.status]}`}>
                                  {report.status}
                                </Badge>
                              </div>
                            </div>
                            {/* Display images if available */}
                            {report.photoPaths && report.photoPaths.length > 0 && (
                              <div className="mt-3 space-y-2">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <ImageIcon className="h-3.5 w-3.5" />
                                  <span>{report.photoPaths.length} photo{report.photoPaths.length > 1 ? "s" : ""}</span>
                                </div>
                                <div className="flex gap-2 overflow-x-auto pb-1">
                                  {report.photoPaths.slice(0, 3).map((photoPath, idx) => (
                                    <div
                                      key={idx}
                                      className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-md overflow-hidden border border-border bg-muted"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleViewReport(report)
                                      }}
                                    >
                                      <img
                                        src={`/api/images/${photoPath}`}
                                        alt={`Damage photo ${idx + 1}`}
                                        className="h-full w-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                        onError={(e) => {
                                          // Hide image on error
                                          e.currentTarget.style.display = "none"
                                        }}
                                      />
                                    </div>
                                  ))}
                                  {report.photoPaths.length > 3 && (
                                    <div
                                      className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-md border border-border bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleViewReport(report)
                                      }}
                                    >
                                      <span className="text-xs font-medium text-muted-foreground">
                                        +{report.photoPaths.length - 3}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            <div className="mt-3 flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleViewReport(report)
                                }}
                                className="gap-2 text-xs sm:text-sm"
                              >
                                <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="form">
            {!selectedCategory ? (
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <Card
                      key={category.id}
                      className="cursor-pointer bg-card border-border hover:border-primary hover:shadow-md transition-all"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <CardHeader className="flex flex-row items-center gap-3 sm:gap-4 p-4 sm:p-6">
                        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base sm:text-lg text-foreground">{category.label}</CardTitle>
                          <CardDescription className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                            {category.description}
                          </CardDescription>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                      </CardHeader>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="max-w-3xl mx-auto">
                <Card className="bg-card border-border">
                  <CardHeader className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedCategory(null)
                          setFormData({})
                        }}
                        className="text-foreground hover:bg-secondary h-8 w-8 sm:h-10 sm:w-10 shrink-0"
                      >
                        <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                      <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                        {selectedCategoryData && (
                          <selectedCategoryData.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-lg sm:text-xl text-foreground truncate">
                          {selectedCategoryData?.label}
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                          Fill in the details below to report damage
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                    {FormComponent && <FormComponent formData={formData} onChange={setFormData} />}

                    <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedCategory(null)
                          setFormData({})
                        }}
                        className="order-2 sm:order-1 flex-1 border-border text-foreground hover:bg-secondary"
                      >
                        Cancel
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
                            <Send className="mr-2 h-4 w-4" />
                            Submit Report
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <ReportDetailDialog report={selectedReport} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
