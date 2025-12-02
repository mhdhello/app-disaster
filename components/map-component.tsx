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
  }>
  onMapClick?: (lat: number, lng: number) => void
  height?: string
  overlayControls?: React.ReactNode
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
        const icon = m.color
          ? L.divIcon({
              className: "custom-marker",
              html: `<div style="background-color: ${m.color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            })
          : defaultIcon

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
        const icon = m.color
          ? L.divIcon({
              className: "custom-marker",
              html: `<div style="background-color: ${m.color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            })
          : defaultIcon

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
