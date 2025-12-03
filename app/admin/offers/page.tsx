"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStore, type DonorOffer } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { useAdminStore } from "@/lib/admin-store"
import {
  Heart,
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

const statusColors: Record<string, string> = {
  available: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  matched: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  delivered: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
}

export default function AdminOffersPage() {
  const { donorOffers, updateOfferStatus, verifyOffer } = useStore()
  const { toast } = useToast()
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated)

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [verifiedFilter, setVerifiedFilter] = useState<string>("all")
  const [selectedOffer, setSelectedOffer] = useState<DonorOffer | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleStatusChange = (id: string, newStatus: string) => {
    updateOfferStatus(id, newStatus as DonorOffer["status"])
    toast({
      title: "Status Updated",
      description: "Donor offer status has been updated successfully.",
    })
  }

  const handleVerify = (id: string) => {
    verifyOffer(id, "Admin")
    toast({
      title: "Offer Verified",
      description: "This donor offer has been marked as verified.",
    })
  }

  const filteredOffers = donorOffers.filter((offer) => {
    const matchesSearch =
      searchQuery === "" ||
      offer.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (offer.location && offer.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      JSON.stringify(offer.data).toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || offer.status === statusFilter
    const matchesCategory = categoryFilter === "all" || offer.category === categoryFilter
    const matchesVerified =
      verifiedFilter === "all" ||
      (verifiedFilter === "verified" && offer.verified) ||
      (verifiedFilter === "unverified" && !offer.verified)

    return matchesSearch && matchesStatus && matchesCategory && matchesVerified
  })

  const viewOfferDetails = (offer: DonorOffer) => {
    setSelectedOffer(offer)
    setDialogOpen(true)
  }

  if (!isAuthenticated) return null

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
          <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-success" />
          <span className="break-words">Donor Offers Management</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage and verify all donor offers</p>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by donor name, contact, category..."
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
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="matched">Matched</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[160px] lg:w-[180px] bg-background border-border text-foreground">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="cleaning">Cleaning</SelectItem>
                <SelectItem value="volunteers">Volunteers</SelectItem>
                <SelectItem value="funds">Funds</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="electricity">Electricity Support</SelectItem>
                <SelectItem value="water">Water Support</SelectItem>
                <SelectItem value="utensils">Utensils</SelectItem>
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

      {/* Offers List */}
      {filteredOffers.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No donor offers found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredOffers.map((offer) => (
            <Card key={offer.id} className="bg-card border-border hover:border-primary transition-colors">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start gap-2 mb-3">
                      <Badge variant="outline" className={`text-xs ${statusColors[offer.status]}`}>
                        {offer.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {offer.category}
                      </Badge>
                      {offer.verified && (
                        <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-300">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg text-foreground mb-2 capitalize">
                      {offer.category.replace(/-/g, " ")} Support
                    </h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 shrink-0" />
                        <span>{offer.donorName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 shrink-0" />
                        <span>{offer.contact}</span>
                      </div>
                      {offer.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 shrink-0" />
                          <span>{offer.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 shrink-0" />
                        <span>{new Date(offer.timestamp).toLocaleString()}</span>
                      </div>
                      {offer.verified && offer.verifiedAt && (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                          <span>Verified on {new Date(offer.verifiedAt).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Select
                      value={offer.status}
                      onValueChange={(value) => handleStatusChange(offer.id, value)}
                    >
                      <SelectTrigger className="w-full sm:w-[130px] lg:w-[140px] bg-background border-border text-foreground text-xs sm:text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="matched">Matched</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                    {!offer.verified && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleVerify(offer.id)}
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
                      onClick={() => viewOfferDetails(offer)}
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

      {/* Offer Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Donor Offer Details</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Complete information about this donor offer
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            {selectedOffer && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Category</p>
                    <p className="text-foreground capitalize">{selectedOffer.category.replace(/-/g, " ")}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge variant="outline" className={statusColors[selectedOffer.status]}>
                      {selectedOffer.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Donor Name</p>
                    <p className="text-foreground">{selectedOffer.donorName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contact</p>
                    <p className="text-foreground">{selectedOffer.contact}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Verified</p>
                    <Badge variant="outline" className={selectedOffer.verified ? "bg-green-100 text-green-800" : ""}>
                      {selectedOffer.verified ? "Yes" : "No"}
                    </Badge>
                  </div>
                  {selectedOffer.location && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Location</p>
                      <p className="text-foreground">{selectedOffer.location}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Timestamp</p>
                    <p className="text-foreground">{new Date(selectedOffer.timestamp).toLocaleString()}</p>
                  </div>
                  {selectedOffer.verifiedAt && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Verified At</p>
                      <p className="text-foreground">{new Date(selectedOffer.verifiedAt).toLocaleString()}</p>
                    </div>
                  )}
                  {selectedOffer.coordinates && (
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">Coordinates</p>
                      <p className="text-foreground">
                        {selectedOffer.coordinates.lat}, {selectedOffer.coordinates.lng}
                      </p>
                    </div>
                  )}
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Form Data</p>
                  <div className="bg-secondary rounded-lg p-4">
                    <pre className="text-xs text-foreground overflow-auto">
                      {JSON.stringify(selectedOffer.data, null, 2)}
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

