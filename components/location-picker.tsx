"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { MapPin, Crosshair, Loader2 } from "lucide-react"
import MapComponent from "./map-component"

interface LocationPickerProps {
  value?: { lat: number; lng: number; address?: string }
  onChange: (location: { lat: number; lng: number; address?: string }) => void
  label?: string
  required?: boolean
}

export function LocationPicker({ value, onChange, label = "Location", required }: LocationPickerProps) {
  const [isLocating, setIsLocating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const watchIdRef = useRef<number | null>(null)

  // Cleanup geolocation watch on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
    }
  }, [])

  const getCurrentLocation = () => {
    setIsLocating(true)
    setError(null)

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      setIsLocating(false)
      return
    }

    // Clear any existing watch
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }

    const geolocationOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 30000, // Increased to 30 seconds
      maximumAge: 0, // Force fresh position
    }

    // Target accuracy threshold (in meters) - accept positions with accuracy better than 20m
    const TARGET_ACCURACY = 20
    const MAX_WATCH_TIME = 30000 // Maximum time to watch (30 seconds)
    const startTime = Date.now()

    const processPosition = async (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = position.coords

      // Check if we have good accuracy or if we've been waiting too long
      const elapsed = Date.now() - startTime
      const hasGoodAccuracy = accuracy <= TARGET_ACCURACY
      const timeExceeded = elapsed >= MAX_WATCH_TIME

      // If we have good accuracy or time exceeded, use this position
      if (hasGoodAccuracy || timeExceeded) {
        // Clear watch if active
        if (watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current)
          watchIdRef.current = null
        }

        // Reverse geocoding to get address
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          )
          const data = await response.json()
          onChange({
            lat: latitude,
            lng: longitude,
            address: data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          })
        } catch {
          onChange({
            lat: latitude,
            lng: longitude,
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          })
        }
        setIsLocating(false)
      }
      // Otherwise, continue watching for better accuracy
    }

    const handleError = (err: GeolocationPositionError) => {
      // Clear watch if active
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }

      let errorMessage = "Unable to retrieve your location. Please select on the map."
      if (err.code === err.TIMEOUT) {
        errorMessage = "Location request timed out. Please try again or select on the map."
      } else if (err.code === err.PERMISSION_DENIED) {
        errorMessage = "Location permission denied. Please enable location access and try again."
      }

      setError(errorMessage)
      setIsLocating(false)
    }

    // First, try getCurrentPosition for immediate result
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { accuracy } = position.coords
        // If we already have good accuracy, use it immediately
        if (accuracy <= TARGET_ACCURACY) {
          processPosition(position)
        } else {
          // Otherwise, start watching for better accuracy
          watchIdRef.current = navigator.geolocation.watchPosition(
            processPosition,
            handleError,
            geolocationOptions,
          )
        }
      },
      (err) => {
        // If getCurrentPosition fails, try watchPosition as fallback
        watchIdRef.current = navigator.geolocation.watchPosition(
          processPosition,
          handleError,
          geolocationOptions,
        )
      },
      geolocationOptions,
    )
  }

  const handleMapClick = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      const data = await response.json()
      onChange({
        lat,
        lng,
        address: data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      })
    } catch {
      onChange({
        lat,
        lng,
        address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      })
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-foreground">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={getCurrentLocation}
          disabled={isLocating}
          className="gap-2 bg-transparent"
        >
          {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crosshair className="h-4 w-4" />}
          {isLocating ? "Locating..." : "Use Current Location"}
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="rounded-lg border border-border overflow-hidden">
        <MapComponent
          center={value ? [value.lat, value.lng] : [7.8731, 80.7718]}
          zoom={value ? 15 : 8}
          marker={value ? [value.lat, value.lng] : undefined}
          onMapClick={handleMapClick}
          height="300px"
        />
      </div>

      {value && (
        <div className="flex items-start gap-2 rounded-lg bg-secondary p-3">
          <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-foreground">Selected Location</p>
            <p className="text-muted-foreground text-xs mt-1">{value.address}</p>
            <p className="text-muted-foreground text-xs">
              Coordinates: {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
