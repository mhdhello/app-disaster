"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { Home, Church, Store, Car, GraduationCap, Route, Zap, Droplets, Stethoscope, Wifi } from "lucide-react"

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

const statusColors: Record<string, string> = {
  pending: "bg-warning/20 text-warning border-warning/30",
  reviewed: "bg-primary/20 text-primary border-primary/30",
  assigned: "bg-accent/20 text-accent border-accent/30",
  resolved: "bg-success/20 text-success border-success/30",
}

export function RecentReports() {
  const { damageReports } = useStore()

  const recentReports = [...damageReports].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 5)

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Recent Damage Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentReports.map((report) => {
            const Icon = categoryIcons[report.category] || Home
            return (
              <div key={report.id} className="flex items-center gap-4 rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <Icon className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground capitalize">{report.category.replace(/-/g, " ")}</p>
                  <p className="text-sm text-muted-foreground truncate">{report.location}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className={statusColors[report.status]}>
                    {report.status}
                  </Badge>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {report.timestamp.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
