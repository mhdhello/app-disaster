"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import {
  Shield,
  FileWarning,
  Heart,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  AlertTriangle,
} from "lucide-react"

export default function AdminDashboardPage() {
  const { damageReports, donorOffers } = useStore()

  const stats = {
    totalReports: damageReports.length,
    pendingReports: damageReports.filter((r) => r.status === "pending").length,
    resolvedReports: damageReports.filter((r) => r.status === "resolved").length,
    verifiedReports: damageReports.filter((r) => r.verified).length,
    totalOffers: donorOffers.length,
    availableOffers: donorOffers.filter((o) => o.status === "available").length,
    matchedOffers: donorOffers.filter((o) => o.status === "matched").length,
    verifiedOffers: donorOffers.filter((o) => o.verified).length,
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
          <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          Admin Dashboard
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Overview of all system activities</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Reports</CardTitle>
            <FileWarning className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalReports}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.pendingReports} pending review
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Verified Reports</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.verifiedReports}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalReports > 0
                ? Math.round((stats.verifiedReports / stats.totalReports) * 100)
                : 0}% verified
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Offers</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalOffers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.availableOffers} available
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Verified Offers</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.verifiedOffers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalOffers > 0
                ? Math.round((stats.verifiedOffers / stats.totalOffers) * 100)
                : 0}% verified
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Reports</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingReports}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolved Reports</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolvedReports}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Matched Offers</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.matchedOffers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <a
              href="/admin/reports"
              className="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-secondary transition-colors"
            >
              <FileWarning className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Manage Reports</p>
                <p className="text-sm text-muted-foreground">View and verify damage reports</p>
              </div>
            </a>
            <a
              href="/admin/offers"
              className="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-secondary transition-colors"
            >
              <Heart className="h-5 w-5 text-success" />
              <div>
                <p className="font-medium text-foreground">Manage Offers</p>
                <p className="text-sm text-muted-foreground">View and verify donor offers</p>
              </div>
            </a>
            <a
              href="/admin/users"
              className="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-secondary transition-colors"
            >
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-foreground">User Management</p>
                <p className="text-sm text-muted-foreground">Manage admin users</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
