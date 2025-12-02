"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { Pill, Brush, Users, DollarSign, Zap, Droplets, Armchair, UtensilsCrossed } from "lucide-react"

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
  available: "bg-success/20 text-success border-success/30",
  matched: "bg-primary/20 text-primary border-primary/30",
  delivered: "bg-muted text-muted-foreground border-muted",
}

export function DonorOffersList() {
  const { donorOffers } = useStore()

  const recentOffers = [...donorOffers].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 5)

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Available Donor Support</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOffers.map((offer) => {
            const Icon = categoryIcons[offer.category] || DollarSign
            return (
              <div key={offer.id} className="flex items-center gap-4 rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/20">
                  <Icon className="h-5 w-5 text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{offer.donorName}</p>
                  <p className="text-sm text-muted-foreground capitalize">{offer.category} Support</p>
                </div>
                <Badge variant="outline" className={statusColors[offer.status]}>
                  {offer.status}
                </Badge>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
