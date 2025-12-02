"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { Home, Users, AlertTriangle, CheckCircle, Clock, Heart } from "lucide-react"

export function StatsCards() {
  const { damageReports, donorOffers } = useStore()

  const stats = [
    {
      title: "Total Reports",
      value: damageReports.length,
      icon: AlertTriangle,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Pending Review",
      value: damageReports.filter((r) => r.status === "pending").length,
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Being Addressed",
      value: damageReports.filter((r) => r.status === "assigned").length,
      icon: Home,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Resolved",
      value: damageReports.filter((r) => r.status === "resolved").length,
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Donor Offers",
      value: donorOffers.length,
      icon: Heart,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "Available Help",
      value: donorOffers.filter((o) => o.status === "available").length,
      icon: Users,
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
