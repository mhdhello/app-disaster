"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStore, type DamageReport } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { useAdminStore } from "@/lib/admin-store"
import {
  FileWarning,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  MapPin,
  Phone,
  User,
  Calendar,
  AlertTriangle,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const severityColors: Record<string, string> = {
  minor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  moderate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  major: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  Minor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Moderate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Major: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  Critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  reviewed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  assigned: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
}

export default function AdminReportsPage() {
  const { damageReports, updateReportStatus, verifyReport } = useStore()
  const { toast } = useToast()
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated)

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [verifiedFilter, setVerifiedFilter] = useState<string>("all")
  const [selectedReport, setSelectedReport] = useState<DamageReport | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleStatusChange = (id: string, newStatus: string) => {
    updateReportStatus(id, newStatus as DamageReport["status"])
    toast({
      title: "Status Updated",
      description: "Damage report status has been updated successfully.",
    })
  }

  const handleVerify = (id: string) => {
    verifyReport(id, "Admin")
    toast({
      title: "Report Verified",
      description: "This damage report has been marked as verified.",
    })
  }

  const filteredReports = damageReports.filter((report) => {
      const matchesSearch =
      searchQuery === "" ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.severity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (report.data && JSON.stringify(report.data).toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === "all" || report.status === statusFilter
    const matchesCategory = categoryFilter === "all" || report.category === categoryFilter
    const matchesVerified =
      verifiedFilter === "all" ||
      (verifiedFilter === "verified" && report.verified) ||
      (verifiedFilter === "unverified" && !report.verified)

    return matchesSearch && matchesStatus && matchesCategory && matchesVerified
  })

  const viewReportDetails = (report: DamageReport) => {
    setSelectedReport(report)
    setDialogOpen(true)
  }

  if (!isAuthenticated) return null

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
      <div className="w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
          <FileWarning className="h-6 w-6 sm:h-8 sm:w-8 text-primary shrink-0" />
          <span className="break-words">Damage Reports Management</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage and verify all damage reports</p>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by location, category, severity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border text-foreground"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[160px] lg:w-[180px] bg-background border-border text-foreground">
                <Filter className="h-4 w-4 mr-2 hidden sm:inline" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[160px] lg:w-[180px] bg-background border-border text-foreground">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="houses">Houses</SelectItem>
                <SelectItem value="worship">Worship Places</SelectItem>
                <SelectItem value="shops">Shops</SelectItem>
                <SelectItem value="vehicles">Vehicles</SelectItem>
                <SelectItem value="schools">Schools</SelectItem>
                <SelectItem value="roads">Roads</SelectItem>
                <SelectItem value="electricity">Electricity</SelectItem>
                <SelectItem value="water">Water</SelectItem>
                <SelectItem value="hospitals">Hospitals</SelectItem>
                <SelectItem value="telecom">Telecom</SelectItem>
              </SelectContent>
            </Select>
            <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
              <SelectTrigger className="w-full sm:w-[160px] lg:w-[180px] bg-background border-border text-foreground">
                <SelectValue placeholder="Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No damage reports found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredReports.map((report) => (
            <Card key={report.id} className="bg-card border-border hover:border-primary transition-colors w-full overflow-hidden">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 w-full">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start gap-2 mb-3">
                      <Badge
                        className={`text-xs capitalize ${severityColors[report.severity] || "bg-gray-100 text-gray-800"}`}
                      >
                        {report.severity}
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${statusColors[report.status]}`}>
                        {report.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {report.category}
                      </Badge>
                      {report.verified && (
                        <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-300">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg text-foreground mb-2 capitalize truncate">
                      {report.category.replace(/-/g, " ")} Damage
                    </h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2 min-w-0">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span className="truncate">{report.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 shrink-0" />
                        <span className="truncate">{new Date(report.timestamp).toLocaleString()}</span>
                      </div>
                      {(() => {
                        const contact = report.data?.contact
                        return contact && typeof contact === "string" ? (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 shrink-0" />
                            <span className="truncate">{contact}</span>
                          </div>
                        ) : null
                      })()}
                      {(() => {
                        const fullName = report.data?.fullName
                        return fullName && typeof fullName === "string" ? (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 shrink-0" />
                            <span className="truncate">{fullName}</span>
                          </div>
                        ) : null
                      })()}
                      {report.verified && report.verifiedAt && (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                          <span>Verified on {new Date(report.verifiedAt).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                    <Select
                      value={report.status}
                      onValueChange={(value) => handleStatusChange(report.id, value)}
                    >
                      <SelectTrigger className="w-full sm:w-[130px] lg:w-[140px] bg-background border-border text-foreground text-xs sm:text-sm shrink-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="reviewed">Reviewed</SelectItem>
                        <SelectItem value="assigned">Assigned</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                    {!report.verified && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleVerify(report.id)}
                        className="gap-1 sm:gap-2 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Mark as Verified</span>
                        <span className="sm:hidden">Verify</span>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewReportDetails(report)}
                      className="gap-1 sm:gap-2 border-border text-foreground hover:bg-secondary text-xs sm:text-sm"
                    >
                      <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">View Details</span>
                      <span className="sm:hidden">Details</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Report Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] bg-card border-border p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-foreground text-lg sm:text-xl">
              Damage Report Details
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Complete information about this damage report
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh] pr-2 sm:pr-4">
            {selectedReport && (
              <div className="space-y-4">

                {/* Responsive grid: 2 columns on desktop, 1 column on mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Category</p>
                    <p className="text-foreground capitalize">
                      {selectedReport.category.replace(/-/g, " ")}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Severity</p>
                    <Badge className={severityColors[selectedReport.severity] || ""}>
                      {selectedReport.severity}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge variant="outline" className={statusColors[selectedReport.status]}>
                      {selectedReport.status}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Verified</p>
                    <Badge
                      variant="outline"
                      className={
                        selectedReport.verified
                          ? "bg-green-100 text-green-800"
                          : ""
                      }
                    >
                      {selectedReport.verified ? "Yes" : "No"}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Timestamp</p>
                    <p className="text-foreground">
                      {new Date(selectedReport.timestamp).toLocaleString()}
                    </p>
                  </div>

                  {selectedReport.verifiedAt && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Verified At</p>
                      <p className="text-foreground">
                        {new Date(selectedReport.verifiedAt).toLocaleString()}
                      </p>
                    </div>
                  )}

                  <div className="sm:col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                    <p className="text-foreground">{selectedReport.location}</p>
                  </div>

                  {selectedReport.coordinates && (
                    <div className="sm:col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">Coordinates</p>
                      <p className="text-foreground">
                        {selectedReport.coordinates.lat}, {selectedReport.coordinates.lng}
                      </p>
                    </div>
                  )}
                </div>

                <Separator />

                {/* JSON block with mobile-friendly scrolling */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Form Data</p>
                  <div className="bg-secondary rounded-lg p-4">
                    <pre className="text-xs text-foreground overflow-auto whitespace-pre-wrap sm:whitespace-pre">
                      {JSON.stringify(selectedReport.data, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}

