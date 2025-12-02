"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { Home, Church, Store, Car, GraduationCap, Route, Zap, Droplets, Stethoscope, Wifi, ChevronRight, ArrowLeft, Send } from 'lucide-react';

import { HousesForm } from "@/components/forms/damage/houses-form";
import { WorshipForm } from "@/components/forms/damage/worship-form";
import { ShopsForm } from "@/components/forms/damage/shops-form";
import { VehiclesForm } from "@/components/forms/damage/vehicles-form";
import { SchoolsForm } from "@/components/forms/damage/schools-form";
import { RoadsForm } from "@/components/forms/damage/roads-form";
import { ElectricityForm } from "@/components/forms/damage/electricity-form";
import { WaterForm } from "@/components/forms/damage/water-form";
import { HospitalsForm } from "@/components/forms/damage/hospitals-form";
import { TelecomForm } from "@/components/forms/damage/telecom-form";

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
];

const formComponents: Record<string, React.FC<{ formData: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void }>> = {
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
};

export default function DamageReportPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addDamageReport } = useStore();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!selectedCategory) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    addDamageReport({
      category: selectedCategory,
      location: (formData.location as string) || "Location not specified",
      severity: (formData.severity as string) || "unknown",
      data: formData,
    });

    toast({
      title: "Report Submitted",
      description: "Your damage report has been submitted successfully. Help is on the way.",
    });

    setFormData({});
    setSelectedCategory(null);
    setIsSubmitting(false);
  };

  const selectedCategoryData = categories.find((c) => c.id === selectedCategory);
  const FormComponent = selectedCategory ? formComponents[selectedCategory] : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Report Flood Damage</h1>
          <p className="text-muted-foreground">
            Select the type of damage you want to report. Your information helps coordinate relief efforts.
          </p>
        </div>

        {!selectedCategory ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.id}
                  className="cursor-pointer bg-card border-border hover:border-primary transition-colors"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-foreground">{category.label}</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {category.description}
                      </CardDescription>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                </Card>
              );
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
                      setSelectedCategory(null);
                      setFormData({});
                    }}
                    className="text-foreground hover:bg-muted"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    {selectedCategoryData && <selectedCategoryData.icon className="h-6 w-6 text-primary" />}
                  </div>
                  <div>
                    <CardTitle className="text-xl text-foreground">
                      {selectedCategoryData?.label}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Fill in the details below to report damage
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {FormComponent && (
                  <FormComponent formData={formData} onChange={setFormData} />
                )}

                <div className="mt-8 flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory(null);
                      setFormData({});
                    }}
                    className="flex-1 border-border text-foreground hover:bg-muted"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
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
      </main>
    </div>
  );
}
