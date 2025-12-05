import { create } from "zustand"

export interface DamageReport {
  id: string
  category: string
  timestamp: Date
  location: string
  coordinates?: { lat: number; lng: number }
  severity: string
  data: Record<string, unknown>
  status: "pending" | "reviewed" | "assigned" | "resolved"
  verified?: boolean
  verifiedAt?: Date
  verifiedBy?: string
}

export interface DonorOffer {
  id: string
  category: string
  timestamp: Date
  donorName: string
  contact: string
  location?: string
  coordinates?: { lat: number; lng: number }
  data: Record<string, unknown>
  status: "available" | "matched" | "delivered"
  verified?: boolean
  verifiedAt?: Date
  verifiedBy?: string
}

export interface VolunteerRegistration {
  id: string
  fullName: string
  email: string
  phone?: string
  nic: string
  district: string
  province: string
  location?: string
  coordinates?: { lat: number; lng: number }
  nicFrontImage?: string
  nicBackImage?: string
  skills?: string[]
  availability?: string
  preferredRole?: string
  volunteerType?: "single" | "team"
  teamSize?: number
  groupLeaderName?: string
  groupLeaderPhone?: string
  teamMembers?: Array<{
    fullName: string
    email?: string
    phone?: string
    nic?: string
    role?: string
    roleOther?: string
    skills?: string
    responsibleName?: string
    responsiblePhone?: string
    responsibleRelation?: string
    responsibleRelationOther?: string
    nicFrontImage?: string
    nicBackImage?: string
  }>
  responsiblePerson?: {
    name: string
    phone?: string
    relation: string
    relationOther?: string
  }
  responsiblePersons?: Array<{
    name: string
    phone?: string
    relation: string
    relationOther?: string
  }>
  data: Record<string, unknown>
  status: "pending" | "verified" | "deployed"
  submittedAt: Date
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: "admin" | "moderator" | "viewer"
  createdAt: Date
  lastLogin?: Date
  active: boolean
}

interface StoreState {
  damageReports: DamageReport[]
  donorOffers: DonorOffer[]
  volunteers: VolunteerRegistration[]
  adminUsers: AdminUser[]
  addDamageReport: (report: Omit<DamageReport, "id" | "timestamp" | "status">) => void
  addDonorOffer: (offer: Omit<DonorOffer, "id" | "timestamp" | "status">) => void
  addVolunteer: (volunteer: Omit<VolunteerRegistration, "id" | "submittedAt" | "status">) => void
  updateReportStatus: (id: string, status: DamageReport["status"]) => void
  updateOfferStatus: (id: string, status: DonorOffer["status"]) => void
  verifyReport: (id: string, verifiedBy: string) => void
  verifyOffer: (id: string, verifiedBy: string) => void
  addAdminUser: (user: Omit<AdminUser, "id" | "createdAt">) => void
  updateAdminUser: (id: string, updates: Partial<AdminUser>) => void
  deleteAdminUser: (id: string) => void
}

export const useStore = create<StoreState>((set) => ({
  damageReports: [
    // Houses / Residential
    {
      id: "1",
      category: "houses",
      timestamp: new Date("2024-12-01T08:30:00"),
      location: "Colombo, Wellawatte",
      coordinates: { lat: 6.8746, lng: 79.86 },
      severity: "Major",
      status: "pending",
      data: {
        fullName: "Kamal Perera",
        contact: "+94 77 1234567",
        locationData: { lat: 6.8746, lng: 79.86, address: "Colombo, Wellawatte" },
        address: "Near Wellawatte Beach, beside the railway station",
        residenceType: "house",
        ownership: "owner",
        peopleAffected: "5",
        severity: "major",
        vulnerablePersons: ["Elderly", "Children"],
        damageTypes: ["Roof damage", "Wall cracks", "Flooding"],
        waterLevel: "120",
        roomsAffected: ["Bedrooms", "Living area", "Kitchen"],
        immediateNeeds: ["Shelter", "Food", "Repair support"],
      },
    },
    {
      id: "2",
      category: "houses",
      timestamp: new Date("2024-12-01T10:15:00"),
      location: "Gampaha, Negombo",
      coordinates: { lat: 7.2083, lng: 79.8358 },
      severity: "Critical",
      status: "assigned",
      data: {
        fullName: "Nimal Fernando",
        contact: "+94 77 2345678",
        locationData: { lat: 7.2083, lng: 79.8358, address: "Gampaha, Negombo" },
        address: "Main Street, near the fish market",
        residenceType: "apartment",
        ownership: "tenant",
        peopleAffected: "8",
        severity: "critical",
        vulnerablePersons: ["Elderly", "Disabled"],
        damageTypes: ["Foundation damage", "Structural collapse", "Flooding"],
        waterLevel: "200",
        roomsAffected: ["All rooms"],
        immediateNeeds: ["Shelter", "Medical", "Clothes"],
      },
    },
    // Worshipping Places
    {
      id: "3",
      category: "worship",
      timestamp: new Date("2024-12-01T09:00:00"),
      location: "Kandy, Temple of the Tooth",
      coordinates: { lat: 7.2936, lng: 80.635 },
      severity: "Moderate",
      status: "reviewed",
      data: {
        institutionName: "Sri Dalada Maligawa",
        placeType: "temple",
        locationData: { lat: 7.2936, lng: 80.635, address: "Kandy, Temple of the Tooth" },
        address: "Near Kandy Lake, city center",
        dailyUsers: "500",
        severity: "moderate",
        damageTypes: ["Flooding", "Equipment damage"],
        waterLevel: "80",
        immediateNeeds: ["Cleaning", "Repair", "Equipment"],
      },
    },
    {
      id: "4",
      category: "worship",
      timestamp: new Date("2024-12-01T11:30:00"),
      location: "Colombo, Fort",
      coordinates: { lat: 6.9344, lng: 79.8428 },
      severity: "Major",
      status: "pending",
      data: {
        institutionName: "Jami Ul-Alfar Mosque",
        placeType: "mosque",
        locationData: { lat: 6.9344, lng: 79.8428, address: "Colombo, Fort" },
        address: "Pettah area, near the main market",
        dailyUsers: "300",
        severity: "major",
        damageTypes: ["Structural damage", "Flooding", "Electrical damage"],
        waterLevel: "150",
        immediateNeeds: ["Cleaning", "Repair", "Holy books"],
      },
    },
    // Shops & Commercial
    {
      id: "5",
      category: "shops",
      timestamp: new Date("2024-12-01T08:45:00"),
      location: "Colombo, Pettah Market",
      coordinates: { lat: 6.9369, lng: 79.8507 },
      severity: "Major",
      status: "assigned",
      data: {
        ownerName: "Ravi Silva",
        businessName: "Silva Electronics",
        contact: "+94 11 2345678",
        businessType: "retail",
        locationData: { lat: 6.9369, lng: 79.8507, address: "Colombo, Pettah Market" },
        address: "Main shopping area, first floor",
        stockDamage: "2500000",
        waterLevel: "100",
        infrastructureDamage: ["Shelving", "Cash registers", "Display units"],
        assistanceNeeded: ["Cleaning", "Inventory recovery", "Repair work"],
      },
    },
    {
      id: "6",
      category: "shops",
      timestamp: new Date("2024-12-01T12:00:00"),
      location: "Galle, Fort",
      coordinates: { lat: 6.0535, lng: 80.221 },
      severity: "Moderate",
      status: "reviewed",
      data: {
        ownerName: "Priya Fernando",
        businessName: "Fernando Pharmacy",
        contact: "+94 91 2234567",
        businessType: "pharmacy",
        locationData: { lat: 6.0535, lng: 80.221, address: "Galle, Fort" },
        address: "Church Street, near the fort entrance",
        stockDamage: "1500000",
        waterLevel: "60",
        infrastructureDamage: ["Shelving", "Freezers"],
        assistanceNeeded: ["Cleaning", "Equipment replacement"],
      },
    },
    // Vehicles
    {
      id: "7",
      category: "vehicles",
      timestamp: new Date("2024-12-01T09:20:00"),
      location: "Colombo, Dehiwala",
      coordinates: { lat: 6.8567, lng: 79.8625 },
      severity: "Major",
      status: "pending",
      data: {
        ownerName: "Samantha Perera",
        contact: "+94 77 3456789",
        vehicleType: "car",
        vehicleNumber: "CAB-1234",
        locationData: { lat: 6.8567, lng: 79.8625, address: "Colombo, Dehiwala" },
        address: "Galle Road, near Dehiwala Zoo",
        severity: "major",
        damageTypes: ["Flooded engine", "Interior damage", "Electrical failure"],
        supportNeeded: ["Towing", "Mechanical repairs", "Assessment"],
      },
    },
    {
      id: "8",
      category: "vehicles",
      timestamp: new Date("2024-12-01T10:45:00"),
      location: "Kandy, Peradeniya",
      coordinates: { lat: 7.2697, lng: 80.5956 },
      severity: "Critical",
      status: "assigned",
      data: {
        ownerName: "Ajith Kumar",
        contact: "+94 77 4567890",
        vehicleType: "three-wheeler",
        vehicleNumber: "KAN-5678",
        locationData: { lat: 7.2697, lng: 80.5956, address: "Kandy, Peradeniya" },
        address: "Near Peradeniya Botanical Gardens",
        severity: "critical",
        damageTypes: ["Flooded engine", "Body damage"],
        supportNeeded: ["Towing", "Parts replacement"],
      },
    },
    // Schools & Institutes
    {
      id: "9",
      category: "schools",
      timestamp: new Date("2024-12-01T10:00:00"),
      location: "Ratnapura District",
      coordinates: { lat: 6.6828, lng: 80.3992 },
      severity: "Moderate",
      status: "reviewed",
      data: {
        institutionName: "Ratnapura Central College",
        institutionType: "school",
        locationData: { lat: 6.6828, lng: 80.3992, address: "Ratnapura District" },
        address: "Main road, near the town center",
        studentsAffected: "250",
        severity: "moderate",
        damageTypes: ["Classrooms", "Furniture", "Books"],
        needsTypes: ["Cleaning", "Furniture replacement", "Books"],
      },
    },
    {
      id: "10",
      category: "schools",
      timestamp: new Date("2024-12-01T13:15:00"),
      location: "Colombo, Mount Lavinia",
      coordinates: { lat: 6.8273, lng: 79.8632 },
      severity: "Major",
      status: "pending",
      data: {
        institutionName: "Mount Lavinia International School",
        institutionType: "school",
        locationData: { lat: 6.8273, lng: 79.8632, address: "Colombo, Mount Lavinia" },
        address: "Beach Road, near the hotel",
        studentsAffected: "400",
        severity: "major",
        damageTypes: ["Classrooms", "Laboratories", "IT equipment", "Library"],
        needsTypes: ["Cleaning", "Equipment", "Repairs", "Temporary classrooms"],
      },
    },
    // Roads & Railways
    {
      id: "11",
      category: "roads",
      timestamp: new Date("2024-12-01T09:15:00"),
      location: "Galle Road, Near Railway",
      coordinates: { lat: 6.9271, lng: 79.8612 },
      severity: "Critical",
      status: "assigned",
      data: {
        roadName: "Galle Road",
        type: "road",
        locationData: { lat: 6.9271, lng: 79.8612, address: "Galle Road, Near Railway" },
        address: "Between Dehiwala and Mount Lavinia stations",
        condition: "blocked",
        impact: "critical",
        trappedPeople: "no",
      },
    },
    {
      id: "12",
      category: "roads",
      timestamp: new Date("2024-12-01T11:00:00"),
      location: "Kandy, Peradeniya Road",
      coordinates: { lat: 7.2697, lng: 80.5956 },
      severity: "Major",
      status: "reviewed",
      data: {
        roadName: "Peradeniya Road",
        type: "bridge",
        locationData: { lat: 7.2697, lng: 80.5956, address: "Kandy, Peradeniya Road" },
        address: "Bridge over Mahaweli River",
        condition: "partially-damaged",
        impact: "high",
        trappedPeople: "no",
      },
    },
    {
      id: "13",
      category: "roads",
      timestamp: new Date("2024-12-01T14:30:00"),
      location: "Colombo, Fort Railway Station",
      coordinates: { lat: 6.9369, lng: 79.8507 },
      severity: "Critical",
      status: "assigned",
      data: {
        roadName: "Colombo Fort Railway",
        type: "railway",
        locationData: { lat: 6.9369, lng: 79.8507, address: "Colombo, Fort Railway Station" },
        address: "Main railway station, platform 1-3",
        condition: "blocked",
        impact: "critical",
        trappedPeople: "unknown",
      },
    },
    // Electricity & Power
    {
      id: "14",
      category: "electricity",
      timestamp: new Date("2024-12-01T12:00:00"),
      location: "Matara, Southern Province",
      coordinates: { lat: 5.9485, lng: 80.5353 },
      severity: "Critical",
      status: "assigned",
      data: {
        locationData: { lat: 5.9485, lng: 80.5353, address: "Matara, Southern Province" },
        address: "Main town area, near the bus stand",
        issueTypes: ["Power outage", "Damaged transformer", "Fallen poles"],
        severity: "critical",
        housesAffected: "500",
        immediateDanger: "yes",
      },
    },
    {
      id: "15",
      category: "electricity",
      timestamp: new Date("2024-12-01T13:45:00"),
      location: "Colombo, Nugegoda",
      coordinates: { lat: 6.8636, lng: 79.8977 },
      severity: "Major",
      status: "pending",
      data: {
        locationData: { lat: 6.8636, lng: 79.8977, address: "Colombo, Nugegoda" },
        address: "High Level Road, near the junction",
        issueTypes: ["Exposed wires", "Substation flood"],
        severity: "major",
        housesAffected: "200",
        immediateDanger: "yes",
      },
    },
    // Water & Pipelines
    {
      id: "16",
      category: "water",
      timestamp: new Date("2024-12-01T13:00:00"),
      location: "Gampaha District",
      coordinates: { lat: 7.0873, lng: 80.0144 },
      severity: "Major",
      status: "pending",
      data: {
        areaName: "Gampaha Town",
        familiesAffected: "150",
        locationData: { lat: 7.0873, lng: 80.0144, address: "Gampaha District" },
        address: "Main residential area, near the market",
        issueTypes: ["Pipe burst", "No water supply"],
      },
    },
    {
      id: "17",
      category: "water",
      timestamp: new Date("2024-12-01T15:00:00"),
      location: "Kurunegala, North Western Province",
      coordinates: { lat: 7.4818, lng: 80.3654 },
      severity: "Moderate",
      status: "reviewed",
      data: {
        areaName: "Kurunegala Town",
        familiesAffected: "80",
        locationData: { lat: 7.4818, lng: 80.3654, address: "Kurunegala, North Western Province" },
        address: "Near the clock tower, main street",
        issueTypes: ["Pump failure", "Supply decline"],
      },
    },
    // Hospitals & Clinics
    {
      id: "18",
      category: "hospitals",
      timestamp: new Date("2024-12-01T11:30:00"),
      location: "Kalutara General Hospital",
      coordinates: { lat: 6.5854, lng: 79.9607 },
      severity: "Major",
      status: "pending",
      data: {
        hospitalName: "Kalutara General Hospital",
        department: "Emergency, ICU",
        locationData: { lat: 6.5854, lng: 79.9607, address: "Kalutara General Hospital" },
        address: "Hospital Road, near the beach",
        patientsAffected: "45",
        equipmentDamaged: "Ventilators, ECG machines, X-ray equipment",
        issueTypes: ["Flooding", "Electrical issues", "Equipment damage"],
        immediateNeeds: ["Beds", "Machines", "Power supply", "Staff support"],
      },
    },
    {
      id: "19",
      category: "hospitals",
      timestamp: new Date("2024-12-01T14:15:00"),
      location: "Colombo, National Hospital",
      coordinates: { lat: 6.9022, lng: 79.8612 },
      severity: "Moderate",
      status: "reviewed",
      data: {
        hospitalName: "National Hospital of Sri Lanka",
        department: "Ward 5, 6",
        locationData: { lat: 6.9022, lng: 79.8612, address: "Colombo, National Hospital" },
        address: "Regent Street, Colombo 7",
        patientsAffected: "30",
        equipmentDamaged: "Patient monitors",
        issueTypes: ["Flooding", "Structural damage"],
        immediateNeeds: ["Cleaning", "Medicines"],
      },
    },
    // Telecommunications
    {
      id: "20",
      category: "telecom",
      timestamp: new Date("2024-12-01T12:30:00"),
      location: "Colombo, Wellawatta",
      coordinates: { lat: 6.8746, lng: 79.86 },
      severity: "Major",
      status: "assigned",
      data: {
        provider: "dialog",
        affectedCount: "300",
        locationData: { lat: 6.8746, lng: 79.86, address: "Colombo, Wellawatta" },
        address: "Galle Road, near the beach",
        issueTypes: ["Tower damage", "Internet outage", "Mobile network down"],
      },
    },
    {
      id: "21",
      category: "telecom",
      timestamp: new Date("2024-12-01T15:30:00"),
      location: "Kandy, City Center",
      coordinates: { lat: 7.2906, lng: 80.6337 },
      severity: "Moderate",
      status: "reviewed",
      data: {
        provider: "mobitel",
        affectedCount: "150",
        locationData: { lat: 7.2906, lng: 80.6337, address: "Kandy, City Center" },
        address: "Main street, near the clock tower",
        issueTypes: ["Cable line damage", "Fiber cut"],
      },
    },
  ],
  donorOffers: [
    // Cleaning Equipment
    {
      id: "1",
      category: "cleaning",
      timestamp: new Date("2024-12-01T08:00:00"),
      donorName: "Clean Lanka Foundation",
      contact: "+94 77 9876543",
      location: "Negombo",
      coordinates: { lat: 7.2083, lng: 79.8358 },
      status: "available",
      data: {
        donorName: "Clean Lanka Foundation",
        contact: "+94 77 9876543",
        equipmentTypes: ["Water pumps", "Shovels", "Brooms", "Pressure washers"],
        quantity: "50",
        deliveryPreference: "dropoff",
        availableFrom: "2024-12-02T08:00",
        locationData: { lat: 7.2083, lng: 79.8358, address: "Negombo" },
      },
    },
    {
      id: "2",
      category: "cleaning",
      timestamp: new Date("2024-12-01T10:15:00"),
      donorName: "Colombo Municipal Council",
      contact: "+94 11 2691095",
      location: "Colombo, Fort",
      coordinates: { lat: 6.9344, lng: 79.8428 },
      status: "matched",
      data: {
        donorName: "Colombo Municipal Council",
        contact: "+94 11 2691095",
        equipmentTypes: ["Shovels", "Brooms", "Buckets", "Mops", "Disinfectants"],
        quantity: "200",
        deliveryPreference: "pickup",
        availableFrom: "2024-12-01T14:00",
        locationData: { lat: 6.9344, lng: 79.8428, address: "Colombo, Fort" },
      },
    },
    {
      id: "3",
      category: "cleaning",
      timestamp: new Date("2024-12-01T13:30:00"),
      donorName: "Kandy City Council",
      contact: "+94 81 2222222",
      location: "Kandy",
      coordinates: { lat: 7.2906, lng: 80.6337 },
      status: "available",
      data: {
        donorName: "Kandy City Council",
        contact: "+94 81 2222222",
        equipmentTypes: ["Water pumps", "Pressure washers", "Gloves"],
        quantity: "30",
        deliveryPreference: "dropoff",
        availableFrom: "2024-12-02T09:00",
        locationData: { lat: 7.2906, lng: 80.6337, address: "Kandy" },
      },
    },
    // Man-hours / Volunteers
    {
      id: "4",
      category: "volunteers",
      timestamp: new Date("2024-12-01T09:00:00"),
      donorName: "Youth Corps",
      contact: "+94 77 1234567",
      location: "Galle",
      coordinates: { lat: 6.0535, lng: 80.221 },
      status: "matched",
      data: {
        fullName: "Youth Corps",
        contact: "+94 77 1234567",
        volunteersCount: "25",
        skills: ["Cleaning", "General labor", "Driving"],
        availability: "Weekends 8am-5pm, Weekdays after 4pm",
        locationData: { lat: 6.0535, lng: 80.221, address: "Galle" },
        coverageAreas: "Galle, Matara, Hambantota districts",
      },
    },
    {
      id: "5",
      category: "volunteers",
      timestamp: new Date("2024-12-01T11:00:00"),
      donorName: "Rotary Club Colombo",
      contact: "+94 77 2345678",
      location: "Colombo, Wellawatte",
      coordinates: { lat: 6.8746, lng: 79.86 },
      status: "available",
      data: {
        fullName: "Rotary Club Colombo",
        contact: "+94 77 2345678",
        volunteersCount: "15",
        skills: ["Cleaning", "Carpentry", "Plumbing", "Medical/First Aid"],
        availability: "Daily 9am-6pm, flexible schedule",
        locationData: { lat: 6.8746, lng: 79.86, address: "Colombo, Wellawatte" },
        coverageAreas: "Colombo, Gampaha, Kalutara districts",
      },
    },
    {
      id: "6",
      category: "volunteers",
      timestamp: new Date("2024-12-01T14:00:00"),
      donorName: "Lions Club Kandy",
      contact: "+94 77 3456789",
      location: "Kandy, Peradeniya",
      coordinates: { lat: 7.2697, lng: 80.5956 },
      status: "available",
      data: {
        fullName: "Lions Club Kandy",
        contact: "+94 77 3456789",
        volunteersCount: "20",
        skills: ["Cleaning", "Electrical", "Cooking", "General labor"],
        availability: "Mon-Fri 2pm-8pm, Weekends all day",
        locationData: { lat: 7.2697, lng: 80.5956, address: "Kandy, Peradeniya" },
        coverageAreas: "Kandy, Matale, Nuwara Eliya districts",
      },
    },
    {
      id: "7",
      category: "volunteers",
      timestamp: new Date("2024-12-01T15:30:00"),
      donorName: "University Students Union",
      contact: "+94 77 4567890",
      location: "Colombo, Mount Lavinia",
      coordinates: { lat: 6.8273, lng: 79.8632 },
      status: "available",
      data: {
        fullName: "University Students Union",
        contact: "+94 77 4567890",
        volunteersCount: "50",
        skills: ["Cleaning", "General labor", "Cooking", "Driving"],
        availability: "Flexible - can organize groups as needed",
        locationData: { lat: 6.8273, lng: 79.8632, address: "Colombo, Mount Lavinia" },
        coverageAreas: "All districts - can travel",
      },
    },
    // Funds Donation
    {
      id: "8",
      category: "funds",
      timestamp: new Date("2024-12-01T08:30:00"),
      donorName: "Anonymous Donor",
      contact: "donor@email.com",
      status: "available",
      data: {
        donorName: "Anonymous Donor",
        contact: "donor@email.com",
        amount: "500000",
        preferredUse: "general",
        paymentMethod: "bank-transfer",
        receiptRequired: "no",
      },
    },
    {
      id: "9",
      category: "funds",
      timestamp: new Date("2024-12-01T10:00:00"),
      donorName: "Sri Lanka Red Cross",
      contact: "+94 11 2691095",
      status: "matched",
      data: {
        donorName: "Sri Lanka Red Cross",
        contact: "+94 11 2691095",
        amount: "2000000",
        preferredUse: "medical",
        paymentMethod: "bank-transfer",
        receiptRequired: "yes",
      },
    },
    {
      id: "10",
      category: "funds",
      timestamp: new Date("2024-12-01T12:00:00"),
      donorName: "Corporate Foundation",
      contact: "foundation@corp.com",
      status: "available",
      data: {
        donorName: "Corporate Foundation",
        contact: "foundation@corp.com",
        amount: "1000000",
        preferredUse: "housing",
        paymentMethod: "check",
        receiptRequired: "yes",
      },
    },
    {
      id: "11",
      category: "funds",
      timestamp: new Date("2024-12-01T14:30:00"),
      donorName: "Community Fund",
      contact: "+94 77 5678901",
      status: "available",
      data: {
        donorName: "Community Fund",
        contact: "+94 77 5678901",
        amount: "750000",
        preferredUse: "schools",
        paymentMethod: "online",
        receiptRequired: "yes",
      },
    },
    // Furniture Donation
    {
      id: "12",
      category: "furniture",
      timestamp: new Date("2024-12-01T09:15:00"),
      donorName: "Furniture Warehouse",
      contact: "+94 11 2345678",
      location: "Colombo, Pettah",
      coordinates: { lat: 6.9369, lng: 79.8507 },
      status: "available",
      data: {
        donorName: "Furniture Warehouse",
        contact: "+94 11 2345678",
        furnitureType: "Beds (20), Tables (15), Chairs (30), Cupboards (10)",
        quantity: "75",
        condition: "new",
        deliveryMethod: "dropoff",
        location: "Pettah Market, Main Street, Colombo 11",
        locationData: { lat: 6.9369, lng: 79.8507, address: "Colombo, Pettah" },
      },
    },
    {
      id: "13",
      category: "furniture",
      timestamp: new Date("2024-12-01T11:45:00"),
      donorName: "Hotel Renovation Project",
      contact: "+94 77 6789012",
      location: "Galle, Fort",
      coordinates: { lat: 6.0535, lng: 80.221 },
      status: "matched",
      data: {
        donorName: "Hotel Renovation Project",
        contact: "+94 77 6789012",
        furnitureType: "Beds (50), Tables (25), Chairs (100), Cupboards (20)",
        quantity: "195",
        condition: "good",
        deliveryMethod: "pickup",
        location: "Galle Fort, Church Street, Galle",
        locationData: { lat: 6.0535, lng: 80.221, address: "Galle, Fort" },
      },
    },
    {
      id: "14",
      category: "furniture",
      timestamp: new Date("2024-12-01T13:00:00"),
      donorName: "Private Donor - Kamal Perera",
      contact: "+94 77 7890123",
      location: "Kandy",
      coordinates: { lat: 7.2906, lng: 80.6337 },
      status: "available",
      data: {
        donorName: "Private Donor - Kamal Perera",
        contact: "+94 77 7890123",
        furnitureType: "Beds (5), Tables (3), Chairs (10), Cupboards (2)",
        quantity: "20",
        condition: "used",
        deliveryMethod: "dropoff",
        location: "Kandy City, Peradeniya Road, Kandy",
        locationData: { lat: 7.2906, lng: 80.6337, address: "Kandy" },
      },
    },
    {
      id: "15",
      category: "furniture",
      timestamp: new Date("2024-12-01T15:00:00"),
      donorName: "School Furniture Donation",
      contact: "+94 11 3456789",
      location: "Colombo, Nugegoda",
      coordinates: { lat: 6.8636, lng: 79.8977 },
      status: "available",
      data: {
        donorName: "School Furniture Donation",
        contact: "+94 11 3456789",
        furnitureType: "Tables (40), Chairs (80), Cupboards (15)",
        quantity: "135",
        condition: "good",
        deliveryMethod: "pickup",
        location: "Nugegoda, High Level Road, Colombo",
        locationData: { lat: 6.8636, lng: 79.8977, address: "Colombo, Nugegoda" },
      },
    },
  ],
  volunteers: [
    {
      id: "v1",
      fullName: "Tharindu Perera",
      email: "tharindu@example.com",
      phone: "+94 77 1112233",
      nic: "991234567V",
      district: "Colombo",
      province: "Western",
      location: "Colombo, Wellawatte",
      coordinates: { lat: 6.8746, lng: 79.86 },
      skills: ["First aid", "Logistics", "Driving"],
      availability: "Weekdays after 5pm, Weekends full day",
      preferredRole: "Ground support",
      nicFrontImage: "",
      nicBackImage: "",
      data: {
        locationData: { lat: 6.8746, lng: 79.86, address: "Colombo, Wellawatte" },
        district: "Colombo",
        province: "Western",
      },
      status: "verified",
      submittedAt: new Date("2024-12-01T08:15:00"),
    },
    {
      id: "v2",
      fullName: "Nethmi Karunaratne",
      email: "nethmi@example.com",
      phone: "+94 71 2223344",
      nic: "200045678901",
      district: "Galle",
      province: "Southern",
      location: "Galle City",
      coordinates: { lat: 6.0535, lng: 80.221 },
      skills: ["Medical/First aid", "Child care"],
      availability: "Daily 9am - 6pm",
      preferredRole: "Medical camp support",
      nicFrontImage: "",
      nicBackImage: "",
      data: {
        locationData: { lat: 6.0535, lng: 80.221, address: "Galle City" },
        district: "Galle",
        province: "Southern",
      },
      status: "pending",
      submittedAt: new Date("2024-12-01T10:45:00"),
    },
    {
      id: "v3",
      fullName: "Ashan Silva",
      email: "ashan.silva@example.com",
      phone: "+94 75 3334455",
      nic: "982233445V",
      district: "Kandy",
      province: "Central",
      location: "Kandy, Peradeniya",
      coordinates: { lat: 7.2697, lng: 80.5956 },
      skills: ["Carpentry", "Plumbing", "General labor"],
      availability: "Weekends, on-call emergencies",
      preferredRole: "Shelter repairs",
      nicFrontImage: "",
      nicBackImage: "",
      data: {
        locationData: { lat: 7.2697, lng: 80.5956, address: "Kandy, Peradeniya" },
        district: "Kandy",
        province: "Central",
      },
      status: "deployed",
      submittedAt: new Date("2024-12-01T13:20:00"),
    },
  ],
  addDamageReport: (report) =>
    set((state) => ({
      damageReports: [
        ...state.damageReports,
        {
          ...report,
          id: Date.now().toString(),
          timestamp: new Date(),
          status: "pending",
        },
      ],
    })),
  addDonorOffer: (offer) =>
    set((state) => ({
      donorOffers: [
        ...state.donorOffers,
        {
          ...offer,
          id: Date.now().toString(),
          timestamp: new Date(),
          status: "available",
        },
      ],
    })),
  addVolunteer: (volunteer) =>
    set((state) => ({
      volunteers: [
        ...state.volunteers,
        {
          ...volunteer,
          id: Date.now().toString(),
          submittedAt: new Date(),
          status: "pending",
        },
      ],
    })),
  updateReportStatus: (id, status) =>
    set((state) => ({
      damageReports: state.damageReports.map((report) => (report.id === id ? { ...report, status } : report)),
    })),
  updateOfferStatus: (id, status) =>
    set((state) => ({
      donorOffers: state.donorOffers.map((offer) => (offer.id === id ? { ...offer, status } : offer)),
    })),
  verifyReport: (id, verifiedBy) =>
    set((state) => ({
      damageReports: state.damageReports.map((report) =>
        report.id === id
          ? { ...report, verified: true, verifiedAt: new Date(), verifiedBy }
          : report
      ),
    })),
  verifyOffer: (id, verifiedBy) =>
    set((state) => ({
      donorOffers: state.donorOffers.map((offer) =>
        offer.id === id
          ? { ...offer, verified: true, verifiedAt: new Date(), verifiedBy }
          : offer
      ),
    })),
  adminUsers: [
    {
      id: "1",
      name: "Admin User",
      email: "admin@floodrelief.lk",
      role: "admin",
      createdAt: new Date("2024-12-01"),
      lastLogin: new Date(),
      active: true,
    },
  ],
  addAdminUser: (user) =>
    set((state) => ({
      adminUsers: [
        ...state.adminUsers,
        {
          ...user,
          id: Date.now().toString(),
          createdAt: new Date(),
        },
      ],
    })),
  updateAdminUser: (id, updates) =>
    set((state) => ({
      adminUsers: state.adminUsers.map((user) => (user.id === id ? { ...user, ...updates } : user)),
    })),
  deleteAdminUser: (id) =>
    set((state) => ({
      adminUsers: state.adminUsers.filter((user) => user.id !== id),
    })),
}))
