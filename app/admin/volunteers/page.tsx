"use client"

import { useState, useMemo } from "react"
import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Users, Search, Filter, Edit, Trash2, Eye, CheckCircle2, Clock, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { VolunteerDetailDialog } from "@/components/volunteer-detail-dialog"

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  verified: "bg-green-100 text-green-800",
  deployed: "bg-blue-100 text-blue-800",
}

export default function AdminVolunteersPage() {
  const { volunteers, updateVolunteer, deleteVolunteer } = useStore()
  const { toast } = useToast()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedForDelete, setSelectedForDelete] = useState<string | null>(null)
  const [selectedVolunteer, setSelectedVolunteer] = useState<any>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)

  const filteredVolunteers = useMemo(() => {
    return volunteers.filter((v) => {
      const matchesSearch =
        v.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.nic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.district.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || v.status === statusFilter
      const matchesType = typeFilter === "all" || v.volunteerType === typeFilter

      return matchesSearch && matchesStatus && matchesType
    })
  }, [volunteers, searchTerm, statusFilter, typeFilter])

  const stats = {
    total: volunteers.length,
    pending: volunteers.filter((v) => v.status === "pending").length,
    verified: volunteers.filter((v) => v.status === "verified").length,
    deployed: volunteers.filter((v) => v.status === "deployed").length,
    singles: volunteers.filter((v) => v.volunteerType === "single" || !v.volunteerType).length,
    teams: volunteers.filter((v) => v.volunteerType === "team").length,
  }

  const handleStatusUpdate = (volunteerId: string, newStatus: string) => {
    updateVolunteer(volunteerId, { status: newStatus as any })
    toast({
      title: "Status updated",
      description: `Volunteer status changed to ${newStatus}`,
    })
  }

  const handleDelete = (volunteerId: string) => {
    setSelectedForDelete(volunteerId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedForDelete) {
      deleteVolunteer(selectedForDelete)
      toast({
        title: "Volunteer deleted",
        description: "The volunteer record has been removed.",
        variant: "destructive",
      })
      setDeleteDialogOpen(false)
      setSelectedForDelete(null)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
          <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          Volunteer Management
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage all volunteer registrations and assignments</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Volunteers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.singles} singles, {stats.teams} teams
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting verification</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Verified</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.verified}</div>
            <p className="text-xs text-muted-foreground mt-1">Approved volunteers</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Deployed</CardTitle>
            <User className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.deployed}</div>
            <p className="text-xs text-muted-foreground mt-1">Active in field</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Name, email, NIC, or district..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-background border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="deployed">Deployed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Volunteer Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="single">Individual</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-card border-border overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg">Volunteers ({filteredVolunteers.length})</CardTitle>
          <CardDescription>Showing {filteredVolunteers.length} of {volunteers.length} records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-foreground font-semibold">Name</TableHead>
                  <TableHead className="text-foreground font-semibold">Contact</TableHead>
                  <TableHead className="text-foreground font-semibold">District</TableHead>
                  <TableHead className="text-foreground font-semibold">Type</TableHead>
                  <TableHead className="text-foreground font-semibold">Role</TableHead>
                  <TableHead className="text-foreground font-semibold">Status</TableHead>
                  <TableHead className="text-foreground font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVolunteers.length === 0 ? (
                  <TableRow className="hover:bg-transparent border-border">
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No volunteers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVolunteers.map((volunteer) => (
                    <TableRow key={volunteer.id} className="border-border hover:bg-muted/50">
                      <TableCell className="font-medium text-foreground">{volunteer.fullName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <div>{volunteer.email}</div>
                        {volunteer.phone && <div className="text-xs">{volunteer.phone}</div>}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{volunteer.district}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-border">
                          {volunteer.volunteerType === "team" ? "👥 Team" : "👤 Single"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {volunteer.preferredRole || "—"}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={volunteer.status}
                          onValueChange={(newStatus) => handleStatusUpdate(volunteer.id, newStatus)}
                        >
                          <SelectTrigger className={cn("w-fit h-8 border-0", statusStyles[volunteer.status])}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="verified">Verified</SelectItem>
                            <SelectItem value="deployed">Deployed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog open={detailDialogOpen && selectedVolunteer?.id === volunteer.id} onOpenChange={setDetailDialogOpen}>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedVolunteer(volunteer)
                                  setDetailDialogOpen(true)
                                }}
                                className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            {selectedVolunteer?.id === volunteer.id && (
                              <VolunteerDetailDialog
                                volunteer={selectedVolunteer}
                                onClose={() => setDetailDialogOpen(false)}
                              />
                            )}
                          </Dialog>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(volunteer.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Volunteer?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The volunteer record will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4">
            <AlertDialogCancel className="flex-1 border-border">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
