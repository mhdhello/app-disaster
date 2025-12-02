"use client"

import type React from "react"
import { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useStore, type DonorOffer } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { OfferDetailDialog } from "@/components/offer-detail-dialog"
import {
  Pill,
  Brush,
  Users,
  DollarSign,
  Zap,
  Droplets,
  Armchair,
  UtensilsCrossed,
  ChevronRight,
  ArrowLeft,
  Heart,
  List,
  FileEdit,
  Clock,
  Phone,
  User,
  Eye,
} from "lucide-react"

import { MedicalForm } from "@/components/forms/donor/medical-form"
import { CleaningForm } from "@/components/forms/donor/cleaning-form"
import { VolunteersForm } from "@/components/forms/donor/volunteers-form"
import { FundsForm } from "@/components/forms/donor/funds-form"
import { ElectricitySupportForm } from "@/components/forms/donor/electricity-support-form"
import { WaterSupportForm } from "@/components/forms/donor/water-support-form"
import { FurnitureForm } from "@/components/forms/donor/furniture-form"
import { UtensilsForm } from "@/components/forms/donor/utensils-form"

const categories = [
  {
    id: "medical",
    label: "Medical Supplies",
    icon: Pill,
    description: "Donate medicines, first aid kits, medical equipment",
  },
  { id: "cleaning", label: "Cleaning Equipment", icon: Brush, description: "Shovels, brooms, pumps, pressure washers" },
  { id: "volunteers", label: "Man-hours / Volunteers", icon: Users, description: "Offer your time and skills" },
  { id: "funds", label: "Funds Donation", icon: DollarSign, description: "Financial contributions" },
  { id: "electricity", label: "Electricity Restoration", icon: Zap, description: "Electrical skills and equipment" },
  { id: "water", label: "Water Restoration", icon: Droplets, description: "Pumps, pipes, purifiers" },
  { id: "furniture", label: "Furniture Donation", icon: Armchair, description: "Beds, tables, chairs, cupboards" },
  {
    id: "utensils",
    label: "Utensils & Kitchen",
    icon: UtensilsCrossed,
    description: "Plates, pots, cooking equipment",
  },
]

const formComponents: Record<
  string,
  React.FC<{ formData: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void }>
> = {
  medical: MedicalForm,
  cleaning: CleaningForm,
  volunteers: VolunteersForm,
  funds: FundsForm,
  electricity: ElectricitySupportForm,
  water: WaterSupportForm,
  furniture: FurnitureForm,
  utensils: UtensilsForm,
}

const categoryIcons: Record<string, React.ElementType> = {
  medical: Pill,
  cleaning: Brush,
  volunteers: Users,
  funds: DollarSign,
  electricity: Zap,
  water: Droplets,
  furniture: Armchair,
  utensils: UtensilsCrossed,
}

const statusColors: Record<string, string> = {
  available: "bg-green-100 text-green-800",
  matched: "bg-blue-100 text-blue-800",
  delivered: "bg-purple-100 text-purple-800",
}

export default function OfferHelpPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<DonorOffer | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { donorOffers, addDonorOffer } = useStore()
  const { toast } = useToast()

  const handleViewOffer = (offer: DonorOffer) => {
    setSelectedOffer(offer)
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!selectedCategory) return

    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const locationData = formData.locationData as { lat: number; lng: number; address?: string } | undefined

    addDonorOffer({
      category: selectedCategory,
      donorName: (formData.donorName as string) || (formData.fullName as string) || "Anonymous",
      contact: (formData.contact as string) || "Not provided",
      location: locationData?.address,
      coordinates: locationData ? { lat: locationData.lat, lng: locationData.lng } : undefined,
      data: formData,
    })

    toast({
      title: "Thank You!",
      description: "Your offer to help has been registered. We will coordinate with you soon.",
    })

    setFormData({})
    setSelectedCategory(null)
    setIsSubmitting(false)
  }

  const selectedCategoryData = categories.find((c) => c.id === selectedCategory)
  const FormComponent = selectedCategory ? formComponents[selectedCategory] : null

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-4 sm:py-6">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2">Offer Help & Donations</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            View available support offers or register your own contribution.
          </p>
        </div>

        <Tabs defaultValue="view" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-auto">
            <TabsTrigger value="view" className="gap-2 py-2.5 text-xs sm:text-sm">
              <List className="h-4 w-4" />
              <span className="hidden xs:inline">View All</span> Offers
            </TabsTrigger>
            <TabsTrigger value="form" className="gap-2 py-2.5 text-xs sm:text-sm">
              <FileEdit className="h-4 w-4" />
              Offer <span className="hidden xs:inline">Support</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="view" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm text-muted-foreground">Showing {donorOffers.length} support offers</p>
            </div>

            {donorOffers.length === 0 ? (
              <Card className="bg-card border-border">
                <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
                  <Heart className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
                  <p className="text-muted-foreground text-sm sm:text-base">No support offers yet</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Be the first to offer help using the form tab
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3 sm:gap-4">
                {donorOffers.map((offer) => {
                  const Icon = categoryIcons[offer.category] || Heart
                  return (
                    <Card key={offer.id} className="bg-card border-border">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                          <div className="flex items-center gap-3 sm:block">
                            <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg bg-success/10">
                              <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
                            </div>
                            {/* Mobile-only title next to icon */}
                            <h3 className="font-semibold text-foreground capitalize sm:hidden">
                              {offer.category.replace(/-/g, " ")} Support
                            </h3>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                              <div className="flex-1">
                                {/* Desktop title */}
                                <h3 className="font-semibold text-foreground capitalize hidden sm:block">
                                  {offer.category.replace(/-/g, " ")} Support
                                </h3>
                                <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm text-muted-foreground">
                                  <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                                  <span>{offer.donorName}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm text-muted-foreground">
                                  <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                                  <span>{offer.contact}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm text-muted-foreground">
                                  <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                                  <span>{new Date(offer.timestamp).toLocaleString()}</span>
                                </div>
                              </div>
                              <Badge className={`text-xs mt-2 sm:mt-0 w-fit ${statusColors[offer.status]}`}>
                                {offer.status}
                              </Badge>
                            </div>
                            <div className="mt-3 flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewOffer(offer)}
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
                      className="cursor-pointer bg-card border-border hover:border-success hover:shadow-md transition-all"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <CardHeader className="flex flex-row items-center gap-3 sm:gap-4 p-4 sm:p-6">
                        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-success/10 shrink-0">
                          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
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
                      <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-success/10 shrink-0">
                        {selectedCategoryData && (
                          <selectedCategoryData.icon className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-lg sm:text-xl text-foreground truncate">
                          {selectedCategoryData?.label}
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                          Fill in the details below to register your support
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
                        className="order-1 sm:order-2 flex-1 bg-success hover:bg-success/90 text-success-foreground"
                      >
                        {isSubmitting ? (
                          "Submitting..."
                        ) : (
                          <>
                            <Heart className="mr-2 h-4 w-4" />
                            Register Support
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

      <OfferDetailDialog offer={selectedOffer} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
