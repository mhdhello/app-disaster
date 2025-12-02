"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
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

export default function DonorSupportPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addDonorOffer } = useStore()
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!selectedCategory) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    addDonorOffer({
      category: selectedCategory,
      donorName: (formData.donorName as string) || (formData.fullName as string) || "Anonymous",
      contact: (formData.contact as string) || "Not provided",
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

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Offer Help & Donations</h1>
          <p className="text-muted-foreground">
            Select how you would like to contribute. Every bit of help makes a difference.
          </p>
        </div>

        {!selectedCategory ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Card
                  key={category.id}
                  className="cursor-pointer bg-card border-border hover:border-success transition-colors"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                      <Icon className="h-6 w-6 text-success" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-foreground">{category.label}</CardTitle>
                      <CardDescription className="text-muted-foreground">{category.description}</CardDescription>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedCategory(null)
                      setFormData({})
                    }}
                    className="text-foreground hover:bg-muted"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                    {selectedCategoryData && <selectedCategoryData.icon className="h-6 w-6 text-success" />}
                  </div>
                  <div>
                    <CardTitle className="text-xl text-foreground">{selectedCategoryData?.label}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Fill in the details below to register your support
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {FormComponent && <FormComponent formData={formData} onChange={setFormData} />}

                <div className="mt-8 flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory(null)
                      setFormData({})
                    }}
                    className="flex-1 border-border text-foreground hover:bg-muted"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
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
      </main>
    </div>
  )
}
