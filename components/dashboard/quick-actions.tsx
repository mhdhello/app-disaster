"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileWarning, Heart, Phone, MapPin } from "lucide-react"

export function QuickActions() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <Link href="/damage-report">
          <Button className="w-full justify-start gap-3 bg-destructive hover:bg-destructive/90 text-destructive-foreground">
            <FileWarning className="h-5 w-5" />
            Report Flood Damage
          </Button>
        </Link>
        <Link href="/donor-support">
          <Button className="w-full justify-start gap-3 bg-success hover:bg-success/90 text-success-foreground">
            <Heart className="h-5 w-5" />
            Offer Help & Donations
          </Button>
        </Link>
        <Button
          variant="outline"
          className="w-full justify-start gap-3 border-border text-foreground hover:bg-muted bg-transparent"
        >
          <Phone className="h-5 w-5" />
          Emergency Hotline: 119
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start gap-3 border-border text-foreground hover:bg-muted bg-transparent"
        >
          <MapPin className="h-5 w-5" />
          Find Nearest Shelter
        </Button>
      </CardContent>
    </Card>
  )
}
