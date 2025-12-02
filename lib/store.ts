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
}

interface StoreState {
  damageReports: DamageReport[]
  donorOffers: DonorOffer[]
  addDamageReport: (report: Omit<DamageReport, "id" | "timestamp" | "status">) => void
  addDonorOffer: (offer: Omit<DonorOffer, "id" | "timestamp" | "status">) => void
  updateReportStatus: (id: string, status: DamageReport["status"]) => void
  updateOfferStatus: (id: string, status: DonorOffer["status"]) => void
}

export const useStore = create<StoreState>((set) => ({
  damageReports: [
    {
      id: "1",
      category: "houses",
      timestamp: new Date("2024-12-01T08:30:00"),
      location: "Colombo, Wellawatte",
      coordinates: { lat: 6.8746, lng: 79.86 },
      severity: "Major",
      data: { peopleAffected: 5, waterLevel: 120 },
      status: "pending",
    },
    {
      id: "2",
      category: "roads",
      timestamp: new Date("2024-12-01T09:15:00"),
      location: "Galle Road, Near Railway",
      coordinates: { lat: 6.9271, lng: 79.8612 },
      severity: "Critical",
      data: { condition: "Blocked" },
      status: "assigned",
    },
    {
      id: "3",
      category: "schools",
      timestamp: new Date("2024-12-01T10:00:00"),
      location: "Ratnapura District",
      coordinates: { lat: 6.6828, lng: 80.3992 },
      severity: "Moderate",
      data: { studentsAffected: 250 },
      status: "reviewed",
    },
    {
      id: "4",
      category: "hospitals",
      timestamp: new Date("2024-12-01T11:30:00"),
      location: "Kalutara General Hospital",
      coordinates: { lat: 6.5854, lng: 79.9607 },
      severity: "Major",
      data: { patientsAffected: 45 },
      status: "pending",
    },
    {
      id: "5",
      category: "electricity",
      timestamp: new Date("2024-12-01T12:00:00"),
      location: "Matara, Southern Province",
      coordinates: { lat: 5.9485, lng: 80.5353 },
      severity: "Critical",
      data: { housesAffected: 500 },
      status: "assigned",
    },
    {
      id: "6",
      category: "water",
      timestamp: new Date("2024-12-01T13:00:00"),
      location: "Gampaha District",
      coordinates: { lat: 7.0873, lng: 80.0144 },
      severity: "Major",
      data: { familiesAffected: 150 },
      status: "pending",
    },
    {
      id: "7",
      category: "worship",
      timestamp: new Date("2024-12-01T14:00:00"),
      location: "Kandy, Temple of the Tooth",
      coordinates: { lat: 7.2936, lng: 80.635 },
      severity: "Moderate",
      data: { type: "Temple" },
      status: "reviewed",
    },
  ],
  donorOffers: [
    {
      id: "1",
      category: "medical",
      timestamp: new Date("2024-12-01T08:00:00"),
      donorName: "Red Cross Sri Lanka",
      contact: "+94 11 2691095",
      location: "Colombo",
      coordinates: { lat: 6.9271, lng: 79.8612 },
      data: { supplies: "First Aid Kits, Medicines", quantity: 200 },
      status: "available",
    },
    {
      id: "2",
      category: "funds",
      timestamp: new Date("2024-12-01T09:00:00"),
      donorName: "Anonymous Donor",
      contact: "donor@email.com",
      data: { amount: "LKR 500,000", use: "General Fund" },
      status: "available",
    },
    {
      id: "3",
      category: "volunteers",
      timestamp: new Date("2024-12-01T10:30:00"),
      donorName: "Youth Corps",
      contact: "+94 77 1234567",
      location: "Galle",
      coordinates: { lat: 6.0535, lng: 80.221 },
      data: { volunteers: 25, skills: "Cleaning, General Labor" },
      status: "matched",
    },
    {
      id: "4",
      category: "cleaning",
      timestamp: new Date("2024-12-01T11:00:00"),
      donorName: "Clean Lanka Foundation",
      contact: "+94 77 9876543",
      location: "Negombo",
      coordinates: { lat: 7.2083, lng: 79.8358 },
      data: { equipment: "Water pumps, Shovels", quantity: 50 },
      status: "available",
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
  updateReportStatus: (id, status) =>
    set((state) => ({
      damageReports: state.damageReports.map((report) => (report.id === id ? { ...report, status } : report)),
    })),
  updateOfferStatus: (id, status) =>
    set((state) => ({
      donorOffers: state.donorOffers.map((offer) => (offer.id === id ? { ...offer, status } : offer)),
    })),
}))
