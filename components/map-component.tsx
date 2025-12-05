"use client"

import React, { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"

interface MapComponentProps {
  center: [number, number]
  zoom: number
  marker?: [number, number]
  markers?: Array<{
    position: [number, number]
    popup?: string
    color?: string
    iconName?: string
    type?: 'damage' | 'support' | 'volunteer'
  }>
  onMapClick?: (lat: number, lng: number) => void
  height?: string
  overlayControls?: React.ReactNode
}

// Icon SVG paths mapping (Lucide icons)
const iconPaths: Record<string, string> = {
  Home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  Church: '<path d="M18 7h1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-1M18 7V6a1 1 0 0 0-1-1h-1M18 7H6M6 7V6a1 1 0 0 1 1-1h1M6 7H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1M6 7v12M18 7v12M6 19h12"/>',
  Store: '<path d="M4 7v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7M4 7l2-4h12l2 4M4 7H2m18 0h2M8 11v6m4-6v6m4-6v6"/>',
  Car: '<path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"/><path d="m12 15 5-5"/><path d="M17 10l-5 5"/>',
  GraduationCap: '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
  Route: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/>',
  Zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  Droplets: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>',
  Stethoscope: '<path d="M4.5 3a2.5 2.5 0 0 0 0 5"/><path d="M6.5 5h-2"/><path d="M6.5 3v2"/><path d="M9 9.5a6.5 6.5 0 0 1 13 0v.5"/><path d="M9 10h13"/><path d="M9 10v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4"/>',
  Wifi: '<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>',
  Pill: '<path d="M10.5 20.5 10 21a1 1 0 0 1-1.414 0l-7.07-7.07a1 1 0 0 1 0-1.414l3.536-3.536a1 1 0 0 1 1.414 0L13.5 16.5"/><path d="m21 3-6 6"/><path d="m16 8 5-5"/><path d="m21 3-3 3"/><path d="m16 8 3-3"/>',
  Brush: '<path d="m9.06 4.11 6.01 6.01a1.5 1.5 0 0 1-.39 2.39l-4.68 1.75a1.5 1.5 0 0 1-1.88-1.19l-.36-2.12a1.5 1.5 0 0 1 .39-1.62l.91-.82z"/><path d="m11.26 18.05-4.68-1.75a1.5 1.5 0 0 1-.39-2.39l6.01-6.01"/><path d="m14.12 10.94 3.24-3.24"/><path d="m17.32 7.74 3.24-3.24a1.5 1.5 0 0 1 2.12 2.12l-3.24 3.24"/><path d="m8.09 9.91-2.12-2.12a1.5 1.5 0 0 1 2.12-2.12l2.12 2.12"/>',
  Users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  DollarSign: '<line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  Armchair: '<path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/><path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0z"/><path d="M5 18v2"/><path d="M19 18v2"/>',
  UtensilsCrossed: '<path d="m15.5 15.5 4 4"/><path d="m5 4 1.5 1.5"/><path d="M18 18c-1.5-1.5-2-5-2-5s-3.5-1.5-5-3l3-3c1.5 1.5 3 5 3 5s3.5 1.5 5 3z"/><path d="M13 10c-1.5-1.5-5-5-5-5l-2 2c4 4 5.5 6.5 5.5 6.5z"/><path d="M16 22s-4-4-6-6l-3 3c2 2 6 6 6 6z"/>',
  Heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/>',
  HelpingHand: '<path d="M4.71 13a11.18 11.18 0 0 0 3.2 3.2l2.37 1.5a3 3 0 0 0 3.3 0l.1-.06a1 1 0 0 0-.1-1.74l-1.75-.84a3 3 0 0 1-1.65-2.21L9.4 6.06A.57.57 0 0 1 10.33 6l.42 3.04a2 2 0 0 0 .8 1.28l.45.32a1 1 0 0 0 1.51-.49l1.25-3.75a.4.4 0 0 1 .77.15L15 10.1a2.28 2.28 0 0 0 1.22 2.4l1.73.86a1 1 0 0 0 1.45-.75l.6-3.69a.39.39 0 0 1 .76-.02L21.83 12A9.52 9.52 0 0 1 12 21.5h-.2A9.5 9.5 0 0 1 2.5 12v-.2A9.47 9.47 0 0 1 12 2.5h.2A9.47 9.47 0 0 1 21.5 12"/>',
}

function createCustomMarkerIcon(color: string, iconName?: string, type?: 'damage' | 'support' | 'volunteer') {
  const iconPath = iconName && iconPaths[iconName] ? iconPaths[iconName] : iconPaths['Home']
  const pinColor = color || (type === 'support' ? '#22c55e' : type === 'volunteer' ? '#0ea5e9' : '#ef4444')
  
  return {
    className: "custom-marker-pin",
    html: `
      <div style="position: relative; width: 30px; height: 40px;">
        <!-- Pin Shape -->
        <svg width="30" height="40" viewBox="0 0 30 40" style="position: absolute; top: 0; left: 0;">
          <path d="M15 0C6.716 0 0 6.716 0 15c0 8.284 15 25 15 25s15-16.716 15-25C30 6.716 23.284 0 15 0z" 
                fill="${pinColor}" 
                stroke="white" 
                stroke-width="2"/>
        </svg>
        <!-- Icon in the round circle at top - bigger circle with white icon -->
        <div style="position: absolute; top: 2px; left: 50%; transform: translateX(-50%); width: 24px; height: 24px; border-radius: 50%; background: ${pinColor}; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.3); border: 2px solid white;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            ${iconPath}
          </svg>
        </div>
      </div>
    `,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40],
  }
}

export default function MapComponent({
  center,
  zoom,
  marker,
  markers,
  onMapClick,
  height = "400px",
  overlayControls,
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const markersLayerRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [L, setL] = useState<any>(null)

  // Load Leaflet from CDN
  useEffect(() => {
    if (typeof window === "undefined") return

    // Check if already loaded
    if ((window as any).L) {
      setL((window as any).L)
      setIsLoaded(true)
      return
    }

    // Load CSS
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    document.head.appendChild(link)

    // Load JS
    const script = document.createElement("script")
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    script.async = true
    script.onload = () => {
      setL((window as any).L)
      setIsLoaded(true)
    }
    document.head.appendChild(script)

    return () => {
      // Cleanup handled by map removal
    }
  }, [])

  // Initialize map once Leaflet is loaded
  useEffect(() => {
    if (!isLoaded || !L || !mapRef.current || mapInstanceRef.current) return

    // Initialize map
    const map = L.map(mapRef.current).setView(center, zoom)
    mapInstanceRef.current = map

    // Set Sri Lanka bounds to restrict map view
    // Sri Lanka approximate bounds: [[South, West], [North, East]]
    const sriLankaBounds = [
      [5.9, 79.7], // Southwest corner
      [9.8, 81.9], // Northeast corner
    ]
    map.setMaxBounds(sriLankaBounds)

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '',
    }).addTo(map)

    // Fix default icon
    const defaultIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    })
    L.Marker.prototype.options.icon = defaultIcon

    // Create markers layer
    markersLayerRef.current = L.layerGroup().addTo(map)

    // Add click handler
    if (onMapClick) {
      map.on("click", (e: any) => {
        onMapClick(e.latlng.lat, e.latlng.lng)
      })
    }

    // Add initial marker if provided
    if (marker) {
      markerRef.current = L.marker(marker).addTo(map)
    }

    // Add initial markers if provided
    if (markers) {
      markers.forEach((m) => {
        const iconConfig = createCustomMarkerIcon(m.color || "#ef4444", m.iconName, m.type)
        const icon = L.divIcon(iconConfig)
        const markerInstance = L.marker(m.position, { icon }).addTo(markersLayerRef.current!)
        if (m.popup) {
          markerInstance.bindPopup(m.popup)
        }
      })
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [isLoaded, L])

  // Update center and zoom
  useEffect(() => {
    if (mapInstanceRef.current && isLoaded && L) {
      // Ensure center is within Sri Lanka bounds
      const sriLankaBounds = [
        [5.9, 79.7], // Southwest corner
        [9.8, 81.9], // Northeast corner
      ]
      
      // Clamp coordinates to Sri Lanka bounds
      const clampedLat = Math.max(5.9, Math.min(9.8, center[0]))
      const clampedLng = Math.max(79.7, Math.min(81.9, center[1]))
      
      mapInstanceRef.current.setView([clampedLat, clampedLng], zoom)
    }
  }, [center, zoom, isLoaded, L])

  // Update single marker
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded || !L) return

    if (markerRef.current) {
      markerRef.current.remove()
      markerRef.current = null
    }

    if (marker) {
      markerRef.current = L.marker(marker).addTo(mapInstanceRef.current)
    }
  }, [marker, isLoaded, L])

  // Update multiple markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !isLoaded || !L) return

    markersLayerRef.current.clearLayers()

    if (markers) {
      const defaultIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      })

      markers.forEach((m) => {
        const iconConfig = createCustomMarkerIcon(m.color || "#ef4444", m.iconName, m.type)
        const icon = L.divIcon(iconConfig)
        const markerInstance = L.marker(m.position, { icon }).addTo(markersLayerRef.current!)
        if (m.popup) {
          markerInstance.bindPopup(m.popup)
        }
      })
    }
  }, [markers, isLoaded, L])

  if (!isLoaded) {
    return (
      <div style={{ height, width: "100%" }} className="flex items-center justify-center bg-secondary rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div style={{ height, width: "100%" }} className="rounded-lg relative">
      <div ref={mapRef} style={{ height, width: "100%" }} className="rounded-lg" />
      {overlayControls && (
        <div className="absolute inset-0 pointer-events-none z-[1000]">
          <div className="pointer-events-auto">{overlayControls}</div>
        </div>
      )}
    </div>
  )
}
