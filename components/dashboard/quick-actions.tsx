"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileWarning, Heart, Phone, UserSearch, HelpingHand } from "lucide-react"

export function QuickActions() {
  return (
    <Card className="bg-card border-border shadow-lg">
      <CardHeader>
        <CardTitle className="text-foreground">Quick Actions</CardTitle>
      </CardHeader>

      <CardContent>

        {/* Responsive Layout */}
        <div className="flex flex-col md:flex-row md:flex-wrap gap-3">

          {/* Report Flood Damage */}
          <Link href="/report-damage" className="flex-1">
            <Button
              className="
                w-full justify-start gap-3 rounded-xl p-4
                bg-gradient-to-r from-red-500 to-red-600 text-white
                shadow-md hover:shadow-xl hover:scale-[1.02]
                transition-all duration-200
              "
            >
              <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                <FileWarning className="h-5 w-5" />
              </div>
              Report Flood Damage
            </Button>
          </Link>

          {/* Offer Donations */}
          <Link href="/offer-help" className="flex-1">
            <Button
              className="
                w-full justify-start gap-3 rounded-xl p-4
                bg-gradient-to-r from-green-500 to-green-600 text-white
                shadow-md hover:shadow-xl hover:scale-[1.02]
                transition-all duration-200
              "
            >
              <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                <Heart className="h-5 w-5" />
              </div>
              Offer Help & Donations
            </Button>
          </Link>

          {/* Volunteer Sign-up */}
          <Link href="/volunteers" className="flex-1">
            <Button
              className="
                w-full justify-start gap-3 rounded-xl p-4
                bg-gradient-to-r from-blue-500 to-blue-600 text-white
                shadow-md hover:shadow-xl hover:scale-[1.02]
                transition-all duration-200
              "
            >
              <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                <HelpingHand className="h-5 w-5" />
              </div>
              Volunteer Sign-up
            </Button>
          </Link>

          {/* Emergency Hotline */}
          <div className="flex-1">
            <Button
              variant="outline"
              className="
                w-full justify-start gap-3 rounded-xl p-4
                border-border text-foreground bg-transparent
                hover:bg-muted transition-all
              "
            >
              <Phone className="h-5 w-5" />
              Emergency Hotline: 119
            </Button>
          </div>
          <Link href="https://floodsupport.org" className="flex-1">
            <Button
              className="
                w-full relative overflow-hidden rounded-xl p-4
                flex items-center justify-start gap-3
                bg-gradient-to-r from-red-500 to-red-600
                text-white shadow-md
                hover:shadow-xl hover:scale-[1.02] transition-all
              "
            >
              <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                <Heart className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-sm">Emergency Rescue</p>
                <p className="text-xs opacity-90 leading-tight">Support flood-affected families</p>
              </div>
              <div className="absolute right-0 top-0 h-full w-8 bg-white/20 blur-xl opacity-20" />
            </Button>
          </Link>

          {/* Find Missing People */}
          <Link href="https://Hopefinder.vercel.app" className="flex-1">
            <Button
              className="
                w-full relative overflow-hidden rounded-xl p-4
                flex items-center justify-start gap-3
                bg-gradient-to-r from-blue-500 to-blue-600
                text-white shadow-md
                hover:shadow-xl hover:scale-[1.02] transition-all
              "
            >
              <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                <UserSearch className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-sm">Find Missing People</p>
                <p className="text-xs opacity-90 leading-tight">Search & identify missing individuals</p>
              </div>
              <div className="absolute right-0 top-0 h-full w-8 bg-white/20 blur-xl opacity-20" />
            </Button>
          </Link>
        </div>
        <br/>
        <div className="flex-1">
          <Button
            variant="outline"
            className="
                w-full justify-start gap-3 rounded-xl p-4
                border-border text-foreground bg-transparent
                hover:bg-muted transition-all
              "
          >
            <Phone className="h-5 w-5" />
            Disaster Management: 117
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
