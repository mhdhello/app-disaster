"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { MapPin, Crosshair, Loader2, Search, X } from "lucide-react"
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
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Array<{ lat: number; lng: number; display_name: string }>>([])
  const watchIdRef = useRef<number | null>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup geolocation watch on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
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
      timeout: 10000, // 10 seconds timeout
      maximumAge: 5000, // Accept positions up to 5 seconds old
    }

    // Target accuracy threshold (in meters) - accept positions with accuracy better than 50m for faster results
    const TARGET_ACCURACY = 50
    const MAX_WATCH_TIME = 10000 // Maximum time to watch (10 seconds)
    const startTime = Date.now()

    // Sri Lanka bounds
    const SRI_LANKA_BOUNDS = {
      minLat: 5.9,
      maxLat: 9.8,
      minLng: 79.7,
      maxLng: 81.9,
    }

    const isWithinSriLanka = (lat: number, lng: number) => {
      return lat >= SRI_LANKA_BOUNDS.minLat && lat <= SRI_LANKA_BOUNDS.maxLat &&
             lng >= SRI_LANKA_BOUNDS.minLng && lng <= SRI_LANKA_BOUNDS.maxLng
    }

    const processPosition = async (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = position.coords

      // Check if location is within Sri Lanka
      if (!isWithinSriLanka(latitude, longitude)) {
        setError("Your location is outside Sri Lanka. Please select a location on the map.")
        setIsLocating(false)
        if (watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current)
          watchIdRef.current = null
        }
        return
      }

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
          const locationData = {
            lat: latitude,
            lng: longitude,
            address: data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          }
          // Use setTimeout to ensure state update happens after geolocation completes
          setTimeout(() => {
            onChange(locationData)
          }, 100)
        } catch {
          const locationData = {
            lat: latitude,
            lng: longitude,
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          }
          setTimeout(() => {
            onChange(locationData)
          }, 100)
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
    setSearchResults([])
    
    // Ensure coordinates are within Sri Lanka bounds
    const clampedLat = Math.max(5.9, Math.min(9.8, lat))
    const clampedLng = Math.max(79.7, Math.min(81.9, lng))
    
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${clampedLat}&lon=${clampedLng}`)
      const data = await response.json()
      onChange({
        lat: clampedLat,
        lng: clampedLng,
        address: data.display_name || `${clampedLat.toFixed(6)}, ${clampedLng.toFixed(6)}`,
      })
    } catch {
      onChange({
        lat: clampedLat,
        lng: clampedLng,
        address: `${clampedLat.toFixed(6)}, ${clampedLng.toFixed(6)}`,
      })
    }
  }

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      // Sri Lanka bounding box: West, South, East, North
      // Approximate bounds: 79.7°E, 5.9°N, 81.9°E, 9.8°N
      const sriLankaBounds = "79.7,5.9,81.9,9.8"
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&viewbox=${sriLankaBounds}&bounded=1&countrycodes=lk`
      )
      const data = await response.json()
      setSearchResults(
        data.map((item: any) => ({
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          display_name: item.display_name,
        }))
      )
    } catch (error) {
      setError("Search failed. Please try again.")
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Debounce search
    if (value.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        handleSearch(value)
      }, 500)
    } else {
      setSearchResults([])
    }
  }

  const handleSelectSearchResult = (result: { lat: number; lng: number; display_name: string }) => {
    // Ensure coordinates are within Sri Lanka bounds
    const clampedLat = Math.max(5.9, Math.min(9.8, result.lat))
    const clampedLng = Math.max(79.7, Math.min(81.9, result.lng))
    
    onChange({
      lat: clampedLat,
      lng: clampedLng,
      address: result.display_name,
    })
    setSearchQuery("")
    setSearchResults([])
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-foreground">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="rounded-lg border border-border overflow-hidden relative z-0">
        <MapComponent
          center={value ? [value.lat, value.lng] : [7.8731, 80.7718]}
          zoom={value ? 15 : 8}
          marker={value ? [value.lat, value.lng] : undefined}
          onMapClick={handleMapClick}
          height="400px"
          overlayControls={
            <div className="absolute top-3 right-3 w-64">
              {/* Search Bar */}
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search location..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-7 pr-7 h-8 text-xs bg-background/95 backdrop-blur-sm border-border shadow-lg"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("")
                        setSearchResults([])
                      }}
                      className="absolute right-1.5 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                {isSearching && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-background/95 backdrop-blur-sm border border-border rounded-md shadow-lg p-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Searching...
                    </div>
                  </div>
                )}
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-background/95 backdrop-blur-sm border border-border rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
                    {searchResults.map((result, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSelectSearchResult(result)}
                        className="w-full text-left px-2 py-1.5 hover:bg-secondary transition-colors border-b border-border last:border-b-0"
                      >
                        <p className="text-xs font-medium text-foreground">{result.display_name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {result.lat.toFixed(6)}, {result.lng.toFixed(6)}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Location Button */}
              <div className="flex justify-end mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={getCurrentLocation}
                  disabled={isLocating}
                  className="gap-1.5 h-7 text-xs bg-background/95 backdrop-blur-sm border-border shadow-lg px-2"
                >
                  {isLocating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Crosshair className="h-3.5 w-3.5" />}
                  {isLocating ? "Locating..." : "My Location"}
                </Button>
              </div>
            </div>
          }
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
