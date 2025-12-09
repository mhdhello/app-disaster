"use client"

import { useState, useMemo } from "react"
import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ClipboardList,
  Plus,
  Edit2,
  Trash2,
  Users,
  MapPin,
  Calendar,
  AlertCircle,
} from "lucide-react"

const provinces = [
  "Central",
  "Eastern",
  "North Central",
  "Northern",
  "North Western",
  "Sabaragamuwa",
  "Southern",
  "Uva",
  "Western",
]

const districtsByProvince: Record<string, string[]> = {
  Western: ["Colombo", "Gampaha", "Kalutara"],
  Central: ["Kandy", "Matale", "Nuwara Eliya"],
  Southern: ["Galle", "Matara", "Hambantota"],
  Northern: ["Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu"],
  Eastern: ["Batticaloa", "Ampara", "Trincomalee"],
  "North Western": ["Kurunegala", "Puttalam"],
  "North Central": ["Anuradhapura", "Polonnaruwa"],
  Uva: ["Badulla", "Moneragala"],
  Sabaragamuwa: ["Ratnapura", "Kegalle"],
}

const taskTypes = [
  "Search & Rescue",
  "Medical - Doctor",
  "Medical - Nurse / Paramedic",
  "Medical - First Aid",
  "Psychosocial Support",
  "Child Care",
  "Shelter Management",
  "Cleaning & Sanitation",
  "Food Distribution",
  "Logistics / Supply Chain",
  "Driving",
  "Carpentry",
  "Plumbing",
  "Electrician",
  "IT / Communications",
  "Other",
]

const priorityColors: Record<string, string> = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
}

const statusColors: Record<string, string> = {
  pending: "bg-gray-100 text-gray-800",
  "in-progress": "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

interface TaskFormData {
  title: string
  description: string
  taskType: string
  priority: "low" | "medium" | "high" | "critical"
  status: "pending" | "in-progress" | "completed" | "cancelled"
  location: string
  province: string
  district: string
  dueDate: string
}

const initialFormData: TaskFormData = {
  title: "",
  description: "",
  taskType: "",
  priority: "medium",
  status: "pending",
  location: "",
  province: "",
  district: "",
  dueDate: "",
}

export default function TasksPage() {
  const { tasks, volunteers, addTask, updateTask, deleteTask, assignVolunteerToTask, removeVolunteerFromTask } =
    useStore()
  const { toast } = useToast()
  const [formData, setFormData] = useState<TaskFormData>(initialFormData)
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [filterProvince, setFilterProvince] = useState<string>("")
  const [filterDistrict, setFilterDistrict] = useState<string>("")
  const [selectedVolunteers, setSelectedVolunteers] = useState<string[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)

  const selectedProvinceForForm = formData.province
  const districtOptionsForForm = useMemo(() => {
    if (!selectedProvinceForForm || !districtsByProvince[selectedProvinceForForm]) return []
    return districtsByProvince[selectedProvinceForForm]
  }, [selectedProvinceForForm])

  const districtOptionsForFilter = useMemo(() => {
    if (!filterProvince || !districtsByProvince[filterProvince]) return []
    return districtsByProvince[filterProvince]
  }, [filterProvince])

  // Filter volunteers by selected province and district
  const filteredVolunteers = useMemo(() => {
    return volunteers.filter((volunteer) => {
      if (filterProvince && volunteer.province !== filterProvince) return false
      if (filterDistrict && volunteer.district !== filterDistrict) return false
      return true
    })
  }, [filterProvince, filterDistrict, volunteers])

  // Filter tasks by selected task
  const filteredTasks = useMemo(() => {
    if (!selectedTask) return tasks
    return tasks.filter((task) => task.id === selectedTask)
  }, [selectedTask, tasks])

  const handleFormChange = (field: keyof TaskFormData, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }
      // Reset district if province changes
      if (field === "province") {
        updated.district = ""
      }
      return updated
    })
  }

  const handleProvinceFilterChange = (province: string) => {
    setFilterProvince(province)
    setFilterDistrict("") // Reset district filter
  }

  const handleSubmitTask = () => {
    if (!formData.title.trim() || !formData.taskType || !formData.province || !formData.district) {
      toast({
        title: "Missing fields",
        description: "Please fill in title, task type, province, and district",
        variant: "destructive",
      })
      return
    }

    if (editingTaskId) {
      updateTask(editingTaskId, {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      })
      toast({
        title: "Task updated",
        description: "Task has been updated successfully",
      })
      setEditingTaskId(null)
    } else {
      addTask({
        ...formData,
        assignedVolunteers: selectedVolunteers,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      })
      toast({
        title: "Task created",
        description: "New task has been created successfully",
      })
    }

    setFormData(initialFormData)
    setSelectedVolunteers([])
    setIsDialogOpen(false)
  }

  const handleEditTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        taskType: task.taskType,
        priority: task.priority,
        status: task.status,
        location: task.location || "",
        province: task.province || "",
        district: task.district || "",
        dueDate: task.dueDate ? task.dueDate.toISOString().split("T")[0] : "",
      })
      setSelectedVolunteers(task.assignedVolunteers)
      setEditingTaskId(taskId)
      setIsDialogOpen(true)
    }
  }

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId)
    if (selectedTask === taskId) {
      setSelectedTask(null)
    }
    toast({
      title: "Task deleted",
      description: "Task has been deleted successfully",
    })
  }

  const handleAddVolunteerToTask = (volunteerId: string) => {
    if (selectedTask) {
      assignVolunteerToTask(selectedTask, volunteerId)
      toast({
        title: "Volunteer assigned",
        description: "Volunteer has been assigned to the task",
      })
    }
  }

  const handleRemoveVolunteerFromTask = (volunteerId: string) => {
    if (selectedTask) {
      removeVolunteerFromTask(selectedTask, volunteerId)
      toast({
        title: "Volunteer removed",
        description: "Volunteer has been removed from the task",
      })
    }
  }

  const getVolunteerNames = (volunteerIds: string[]) => {
    return volunteerIds
      .map((id) => volunteers.find((v) => v.id === id)?.fullName)
      .filter(Boolean)
      .join(", ")
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
          <ClipboardList className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          Task Management
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Create tasks and assign volunteers by province and district
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="all" className="text-xs sm:text-sm">
            All Tasks
          </TabsTrigger>
          <TabsTrigger value="manage" className="text-xs sm:text-sm">
            Manage Task
          </TabsTrigger>
          <TabsTrigger value="create" className="text-xs sm:text-sm">
            <Plus className="h-4 w-4 mr-1" />
            New Task
          </TabsTrigger>
        </TabsList>

        {/* All Tasks Tab */}
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {tasks.length === 0 ? (
              <Card className="bg-card border-border">
                <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
                  <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
                  <p className="text-muted-foreground text-sm sm:text-base">No tasks yet</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Create a new task to get started</p>
                </CardContent>
              </Card>
            ) : (
              tasks.map((task) => (
                <Card
                  key={task.id}
                  className="bg-card border-border cursor-pointer hover:border-primary hover:shadow-md transition-all"
                  onClick={() => setSelectedTask(task.id)}
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground truncate">{task.title}</h3>
                          <Badge className={priorityColors[task.priority]}>{task.priority}</Badge>
                          <Badge className={statusColors[task.status]}>{task.status}</Badge>
                        </div>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{task.description}</p>
                        )}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {task.taskType}
                          </div>
                          {task.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {task.location}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {task.assignedVolunteers.length} assigned
                          </div>
                          {task.dueDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {task.dueDate.toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-auto sm:ml-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditTask(task.id)
                          }}
                          className="border-border"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteTask(task.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Manage Task Tab */}
        <TabsContent value="manage" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl text-foreground">Select Task to Manage</CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                Choose a task and assign volunteers by province and district
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 pt-2 sm:pt-2 space-y-6">
              {/* Task Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Available Tasks</Label>
                <div className="grid gap-2">
                  {tasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => {
                        setSelectedTask(task.id)
                        setFilterProvince("")
                        setFilterDistrict("")
                      }}
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        selectedTask === task.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="font-semibold text-sm text-foreground">{task.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {task.taskType} • {task.district}, {task.province}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {task.assignedVolunteers.length} volunteer(s) assigned
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedTask && (
                <>
                  {/* Province and District Filter */}
                  <div className="space-y-4 border-t pt-6">
                    <h3 className="font-semibold text-sm text-foreground">Filter Volunteers by Location</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="filter-province">Province</Label>
                        <select
                          id="filter-province"
                          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          value={filterProvince}
                          onChange={(e) => handleProvinceFilterChange(e.target.value)}
                        >
                          <option value="">All Provinces</option>
                          {provinces.map((province) => (
                            <option key={province} value={province}>
                              {province}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="filter-district">District</Label>
                        <select
                          id="filter-district"
                          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          value={filterDistrict}
                          onChange={(e) => setFilterDistrict(e.target.value)}
                          disabled={!filterProvince}
                        >
                          <option value="">All Districts</option>
                          {districtOptionsForFilter.map((district) => (
                            <option key={district} value={district}>
                              {district}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Current Assignments */}
                  {filteredTasks[0]?.assignedVolunteers.length > 0 && (
                    <div className="space-y-3 border-t pt-6">
                      <h3 className="font-semibold text-sm text-foreground">Currently Assigned Volunteers</h3>
                      <div className="grid gap-2">
                        {filteredTasks[0].assignedVolunteers.map((volunteerId) => {
                          const volunteer = volunteers.find((v) => v.id === volunteerId)
                          return (
                            <div
                              key={volunteerId}
                              className="p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-between"
                            >
                              <div className="text-sm">
                                <p className="font-semibold text-foreground">{volunteer?.fullName}</p>
                                <p className="text-xs text-muted-foreground">
                                  {volunteer?.district}, {volunteer?.province}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRemoveVolunteerFromTask(volunteerId)}
                              >
                                Remove
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Available Volunteers for Assignment */}
                  <div className="space-y-3 border-t pt-6">
                    <h3 className="font-semibold text-sm text-foreground">
                      Available Volunteers {filterProvince && `in ${filterProvince}`}
                      {filterDistrict && ` - ${filterDistrict}`}
                    </h3>
                    {filteredVolunteers.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No volunteers found matching the selected location</p>
                    ) : (
                      <ScrollArea className="h-[300px] rounded-lg border border-border p-4">
                        <div className="space-y-2">
                          {filteredVolunteers.map((volunteer) => {
                            const isAssigned = filteredTasks[0]?.assignedVolunteers.includes(volunteer.id)
                            return (
                              <div
                                key={volunteer.id}
                                className="p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border flex items-start gap-3"
                              >
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-sm text-foreground">{volunteer.fullName}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {volunteer.email} • {volunteer.phone || "No phone"}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {volunteer.district}, {volunteer.province}
                                  </p>
                                  {volunteer.skills && volunteer.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {volunteer.skills.slice(0, 2).map((skill) => (
                                        <Badge key={skill} variant="secondary" className="text-xs">
                                          {skill}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  variant={isAssigned ? "destructive" : "default"}
                                  onClick={() => {
                                    if (isAssigned) {
                                      handleRemoveVolunteerFromTask(volunteer.id)
                                    } else {
                                      handleAddVolunteerToTask(volunteer.id)
                                    }
                                  }}
                                  className="shrink-0"
                                >
                                  {isAssigned ? "Remove" : "Assign"}
                                </Button>
                              </div>
                            )
                          })}
                        </div>
                      </ScrollArea>
                    )}
                  </div>
                </>
              )}

              {!selectedTask && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-muted/30 border border-border">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Select a task above to manage volunteer assignments</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Create Task Tab */}
        <TabsContent value="create" className="space-y-4">
          <Card className="bg-card border-border max-w-4xl">
            <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl text-foreground flex items-center gap-2">
                <Plus className="h-5 w-5" />
                {editingTaskId ? "Edit Task" : "Create New Task"}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                {editingTaskId
                  ? "Update task details and manage assignments"
                  : "Create a new relief task and assign volunteers"}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 pt-2 sm:pt-2 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title">Task Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Search and Rescue - Colombo District"
                    value={formData.title}
                    onChange={(e) => handleFormChange("title", e.target.value)}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Detailed description of the task"
                    value={formData.description}
                    onChange={(e) => handleFormChange("description", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taskType">Task Type *</Label>
                  <select
                    id="taskType"
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={formData.taskType}
                    onChange={(e) => handleFormChange("taskType", e.target.value)}
                  >
                    <option value="">Select task type</option>
                    {taskTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level *</Label>
                  <select
                    id="priority"
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={formData.priority}
                    onChange={(e) =>
                      handleFormChange(
                        "priority",
                        e.target.value as "low" | "medium" | "high" | "critical"
                      )
                    }
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <select
                    id="status"
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={formData.status}
                    onChange={(e) =>
                      handleFormChange(
                        "status",
                        e.target.value as "pending" | "in-progress" | "completed" | "cancelled"
                      )
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="province">Province *</Label>
                  <select
                    id="province"
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={selectedProvinceForForm}
                    onChange={(e) => handleFormChange("province", e.target.value)}
                  >
                    <option value="">Select province</option>
                    {provinces.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">District *</Label>
                  <select
                    id="district"
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={formData.district}
                    onChange={(e) => handleFormChange("district", e.target.value)}
                    disabled={!selectedProvinceForForm}
                  >
                    <option value="">Select district</option>
                    {districtOptionsForForm.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location Details</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Main Street near Hospital"
                    value={formData.location}
                    onChange={(e) => handleFormChange("location", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleFormChange("dueDate", e.target.value)}
                  />
                </div>
              </div>

              {/* Volunteer Selection */}
              {!editingTaskId && (
                <div className="space-y-3 border-t pt-5">
                  <h3 className="font-semibold text-sm text-foreground">Assign Volunteers (optional)</h3>
                  <p className="text-xs text-muted-foreground">
                    You can assign volunteers after creating the task
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormData(initialFormData)
                    setSelectedVolunteers([])
                    setEditingTaskId(null)
                  }}
                  className="flex-1 border-border text-foreground hover:bg-secondary"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitTask}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {editingTaskId ? "Update Task" : "Create Task"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
