"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { db } from "@/lib/firebase"
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, Timestamp } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { useAdminStore } from "@/lib/admin-store"
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Shield,
  UserCheck,
  Eye,
  Mail,
  Calendar,
  Loader2,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  moderator: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  viewer: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: "admin" | "moderator" | "viewer"
  createdAt: Date
  lastLogin?: Date
  active: boolean
  firebaseUid?: string
}

const COLLECTION_NAME = "adminUsers"

export default function AdminUsersPage() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated)

  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "viewer" as "admin" | "moderator" | "viewer",
    active: true,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showEditPassword, setShowEditPassword] = useState(false)
  const [initializing, setInitializing] = useState(false)
  const [addingUser, setAddingUser] = useState(false)
  const [updatingUser, setUpdatingUser] = useState(false)
  const [deletingUser, setDeletingUser] = useState<string | null>(null)

  // Initialize default admin user on mount if needed
  useEffect(() => {
    if (!isAuthenticated) return

    const initializeDefaultAdmin = async () => {
      try {
        // Check if admin user exists
        const checkResponse = await fetch("/api/admin/init")
        const checkResult = await checkResponse.json()
        
        if (!checkResult.exists) {
          // Initialize default admin user
          const initResponse = await fetch("/api/admin/init", {
            method: "POST",
          })
          const initResult = await initResponse.json()
          
          if (initResponse.ok && initResult.success) {
            // Reload users after initialization
            const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"))
            const querySnapshot = await getDocs(q)
            const users: AdminUser[] = []
            querySnapshot.forEach((docSnapshot) => {
              const data = docSnapshot.data()
              users.push({
                id: docSnapshot.id,
                name: data.name,
                email: data.email,
                role: data.role,
                createdAt: data.createdAt?.toDate() || new Date(),
                lastLogin: data.lastLogin?.toDate(),
                active: data.active ?? true,
                firebaseUid: data.firebaseUid,
              })
            })
            setAdminUsers(users)
          }
        }
      } catch (error) {
        console.error("Error initializing default admin:", error)
      }
    }

    initializeDefaultAdmin()
  }, [isAuthenticated])

  // Load users from Firebase
  useEffect(() => {
    if (!isAuthenticated) return

    const loadUsers = async () => {
      try {
        setLoading(true)
        const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"))
        const querySnapshot = await getDocs(q)
        const users: AdminUser[] = []
        
        querySnapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data()
          users.push({
            id: docSnapshot.id,
            name: data.name,
            email: data.email,
            role: data.role,
            createdAt: data.createdAt?.toDate() || new Date(),
            lastLogin: data.lastLogin?.toDate(),
            active: data.active ?? true,
            firebaseUid: data.firebaseUid,
          })
        })
        
        setAdminUsers(users)
      } catch (error) {
        console.error("Error loading users:", error)
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [isAuthenticated, toast])

  const handleAddUser = async () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (!formData.password || formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      })
      return
    }

    setAddingUser(true)
    const tempId = `temp-${Date.now()}`
    
    // Save form data before clearing
    const userFormData = { ...formData }
    
    const newUser: AdminUser = {
      id: tempId,
      name: userFormData.name,
      email: userFormData.email,
      role: userFormData.role,
      active: userFormData.active,
      createdAt: new Date(),
    }

    // Optimistic update - add user immediately to UI
    setAdminUsers((prev) => [newUser, ...prev])
    setFormData({ name: "", email: "", password: "", role: "viewer", active: true })
    setDialogOpen(false)

    try {
      const userData = {
        name: userFormData.name,
        email: userFormData.email,
        password: userFormData.password,
        role: userFormData.role,
        active: userFormData.active,
        createdAt: Timestamp.now(),
      }

      const docRef = await addDoc(collection(db, COLLECTION_NAME), userData)
      
      // Update with real ID from database
      setAdminUsers((prev) =>
        prev.map((user) => (user.id === tempId ? { ...user, id: docRef.id } : user))
      )
      
      toast({
        title: "User Added",
        description: "New admin user has been added successfully.",
      })
    } catch (error) {
      console.error("Error adding user:", error)
      // Rollback optimistic update on error
      setAdminUsers((prev) => prev.filter((user) => user.id !== tempId))
      toast({
        title: "Error",
        description: "Failed to add user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setAddingUser(false)
    }
  }

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: "", // Don't populate password for security
      role: user.role,
      active: user.active,
    })
    setShowEditPassword(false)
    setEditDialogOpen(true)
  }

  const handleUpdateUser = async () => {
    if (!selectedUser) return

    if (!formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (formData.password && formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      })
      return
    }

    setUpdatingUser(true)
    const originalUser = selectedUser
    
    // Save form data before clearing
    const userFormData = { ...formData }
    
    const updatedUser: AdminUser = {
      ...selectedUser,
      name: userFormData.name,
      email: userFormData.email,
      role: userFormData.role,
      active: userFormData.active,
    }

    // Optimistic update - update user immediately in UI
    setAdminUsers((prev) =>
      prev.map((user) => (user.id === selectedUser.id ? updatedUser : user))
    )
    setEditDialogOpen(false)
    setSelectedUser(null)
    setFormData({ name: "", email: "", password: "", role: "viewer", active: true })

    try {
      // Call API route to update user
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedUser.id,
          name: userFormData.name,
          email: userFormData.email,
          password: userFormData.password || undefined, // Only send if provided
          role: userFormData.role,
          active: userFormData.active,
          firebaseUid: selectedUser.firebaseUid,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to update user")
      }

      toast({
        title: "User Updated",
        description: "User information has been updated successfully.",
      })
    } catch (error: any) {
      console.error("Error updating user:", error)
      // Rollback optimistic update on error
      setAdminUsers((prev) =>
        prev.map((user) => (user.id === selectedUser.id ? originalUser : user))
      )
      toast({
        title: "Error",
        description: error.message || "Failed to update user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUpdatingUser(false)
    }
  }

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    setDeletingUser(id)
    const deletedUser = adminUsers.find((user) => user.id === id)

    // Optimistic update - remove user immediately from UI
    setAdminUsers((prev) => prev.filter((user) => user.id !== id))

    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id))
      
      toast({
        title: "User Deleted",
        description: "User has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting user:", error)
      // Rollback optimistic update on error
      if (deletedUser) {
        setAdminUsers((prev) => {
          const updated = [...prev, deletedUser]
          return updated.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        })
      }
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeletingUser(null)
    }
  }

  const handleInitializeAdmin = async () => {
    setInitializing(true)
    try {
      const response = await fetch("/api/admin/init", {
        method: "POST",
      })
      const result = await response.json()

      if (response.ok && result.success) {
        toast({
          title: "Success",
          description: result.message || "Default admin user initialized successfully.",
        })
        
        // Reload users
        const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"))
        const querySnapshot = await getDocs(q)
        const users: AdminUser[] = []
        querySnapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data()
          users.push({
            id: docSnapshot.id,
            name: data.name,
            email: data.email,
            role: data.role,
            createdAt: data.createdAt?.toDate() || new Date(),
            lastLogin: data.lastLogin?.toDate(),
            active: data.active ?? true,
            firebaseUid: data.firebaseUid,
          })
        })
        setAdminUsers(users)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to initialize admin user.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Error initializing admin:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to initialize admin user.",
        variant: "destructive",
      })
    } finally {
      setInitializing(false)
    }
  }

  const filteredUsers = adminUsers.filter((user) => {
    return (
      searchQuery === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  if (!isAuthenticated) return null

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading users...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            User Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage admin users and permissions</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleInitializeAdmin}
            disabled={initializing}
            className="gap-2"
          >
            <Shield className="h-4 w-4" />
            {initializing ? "Initializing..." : "Init Default Admin"}
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Add New Admin User</DialogTitle>
              <DialogDescription>Create a new admin user account</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter user name"
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter user email"
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter password (min 6 characters)"
                    className="bg-background border-border text-foreground pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <Eye className={`h-4 w-4 ${showPassword ? "text-primary" : "text-muted-foreground"}`} />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value as AdminUser["role"] })}
                >
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddUser} className="w-full" disabled={addingUser}>
                {addingUser ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add User"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      </div>

      {/* Search */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-border text-foreground"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No users found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="bg-card border-border hover:border-primary transition-colors">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start gap-2 mb-3">
                      <Badge className={`text-xs capitalize ${roleColors[user.role]}`}>
                        {user.role}
                      </Badge>
                      <Badge variant="outline" className={user.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {user.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">{user.name}</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 shrink-0" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 shrink-0" />
                        <span>Created: {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                      {user.lastLogin && (
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4 shrink-0" />
                          <span>Last login: {new Date(user.lastLogin).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                      className="gap-2 border-border text-foreground hover:bg-secondary"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={deletingUser === user.id}
                      className="gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      {deletingUser === user.id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Edit Admin User</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password">Password (leave blank to keep current)</Label>
              <div className="relative">
                <Input
                  id="edit-password"
                  type={showEditPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter new password (min 6 characters)"
                  className="bg-background border-border text-foreground pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowEditPassword(!showEditPassword)}
                >
                  <Eye className={`h-4 w-4 ${showEditPassword ? "text-primary" : "text-muted-foreground"}`} />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as AdminUser["role"] })}
              >
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit-active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="rounded border-border"
              />
              <Label htmlFor="edit-active">Active</Label>
            </div>
            <Button onClick={handleUpdateUser} className="w-full" disabled={updatingUser}>
              {updatingUser ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update User"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
