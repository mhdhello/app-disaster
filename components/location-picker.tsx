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

// Cache for reverse geocoding to avoid repeated API calls
const reverseGeocodingCache = new Map<string, string>()

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

const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  const cacheKey = `${lat.toFixed(5)},${lng.toFixed(5)}`
  
  // Check cache first
  if (reverseGeocodingCache.has(cacheKey)) {
    return reverseGeocodingCache.get(cacheKey)!
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      { signal: controller.signal }
    )
    clearTimeout(timeoutId)

    if (!response.ok) throw new Error("Reverse geocoding failed")
    const data = await response.json()
    const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    
    // Cache the result
    reverseGeocodingCache.set(cacheKey, address)
    return address
  } catch {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
  }
}

export function LocationPicker({ value, onChange, label = "Location", required }: LocationPickerProps) {
  const [isLocating, setIsLocating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Array<{ lat: number; lng: number; display_name: string }>>([])
  const watchIdRef = useRef<number | null>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const locationTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef(true)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
      if (locationTimeoutRef.current) {
        clearTimeout(locationTimeoutRef.current)
      }
    }
  }, [])

  const getCurrentLocation = async () => {
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

    let hasReturned = false
    const startTime = Date.now()

    // Aggressive timeout strategy - accept location as soon as we have it with reasonable accuracy
    const ACCURACY_THRESHOLD_FAST = 30 // Accept within 30m for instant response
    const ACCURACY_THRESHOLD_GOOD = 50 // Accept within 50m 
    const ACCURACY_THRESHOLD_ACCEPTABLE = 100 // Accept within 100m as fallback
    const MAX_WAIT_FAST = 3000 // 3 seconds for good accuracy
    const MAX_WAIT_ACCEPTABLE = 10000 // 10 seconds max total wait

    const returnLocation = async (latitude: number, longitude: number, accuracy: number) => {
      if (hasReturned || !isMountedRef.current) return
      hasReturned = true

      // Clear watch and timeouts
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
      if (locationTimeoutRef.current) {
        clearTimeout(locationTimeoutRef.current)
        locationTimeoutRef.current = null
      }

      // Clamp to Sri Lanka bounds
      const clampedLat = Math.max(SRI_LANKA_BOUNDS.minLat, Math.min(SRI_LANKA_BOUNDS.maxLat, latitude))
      const clampedLng = Math.max(SRI_LANKA_BOUNDS.minLng, Math.min(SRI_LANKA_BOUNDS.maxLng, longitude))

      // Get address in parallel
      const address = await reverseGeocode(clampedLat, clampedLng)

      if (isMountedRef.current) {
        onChange({
          lat: clampedLat,
          lng: clampedLng,
          address: address,
        })
        setIsLocating(false)
      }
    }

    const processPosition = async (position: GeolocationPosition) => {
      if (hasReturned) return

      const { latitude, longitude, accuracy } = position.coords
      const elapsed = Date.now() - startTime

      // Always accept positions from Sri Lanka immediately
      if (isWithinSriLanka(latitude, longitude)) {
        // Accept position based on accuracy and time elapsed
        const hasExcellentAccuracy = accuracy <= ACCURACY_THRESHOLD_FAST
        const hasGoodAccuracy = accuracy <= ACCURACY_THRESHOLD_GOOD
        const hasAcceptableAccuracy = accuracy <= ACCURACY_THRESHOLD_ACCEPTABLE
        const timeExceeded = elapsed >= MAX_WAIT_ACCEPTABLE
        const goodTimeElapsed = elapsed >= MAX_WAIT_FAST

        if (hasExcellentAccuracy || (hasGoodAccuracy && goodTimeElapsed) || timeExceeded) {
          await returnLocation(latitude, longitude, accuracy)
        }
      } else {
        // Location outside Sri Lanka - keep waiting or timeout
        if (elapsed > MAX_WAIT_ACCEPTABLE) {
          // Give up and use the position anyway (clamped)
          await returnLocation(latitude, longitude, accuracy)
        }
      }
    }

    const handleError = async (err: GeolocationPositionError) => {
      if (hasReturned) return

      // Clear watch if active
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }

      let errorMessage = "Unable to retrieve your location. Please select on the map."
      if (err.code === err.PERMISSION_DENIED) {
        errorMessage = "Location permission denied. Please enable location access in browser settings."
      } else if (err.code === err.TIMEOUT) {
        errorMessage = "Location request timed out. Please select on the map or try again."
      } else if (err.code === err.POSITION_UNAVAILABLE) {
        errorMessage = "Location information unavailable. Please select on the map."
      }

      if (isMountedRef.current) {
        setError(errorMessage)
        setIsLocating(false)
      }
    }

    // Set absolute timeout fallback
    locationTimeoutRef.current = setTimeout(() => {
      if (!hasReturned) {
        if (watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current)
          watchIdRef.current = null
        }
        if (isMountedRef.current) {
          setError("Location detection timed out. Please select on the map.")
          setIsLocating(false)
        }
      }
    }, MAX_WAIT_ACCEPTABLE + 1000)

    // Use less aggressive options - let browser use cached positions if available and recent
    const geolocationOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: MAX_WAIT_ACCEPTABLE,
      maximumAge: 60000, // Use cached position if less than 1 minute old
    }

    // Try getCurrentPosition first with lower timeout
    navigator.geolocation.getCurrentPosition(
      processPosition,
      (err) => {
        // If getCurrentPosition fails, try watchPosition as fallback
        if (!hasReturned && isMountedRef.current) {
          watchIdRef.current = navigator.geolocation.watchPosition(
            processPosition,
            handleError,
            {
              enableHighAccuracy: true,
              timeout: MAX_WAIT_ACCEPTABLE,
              maximumAge: 60000,
            },
          )
        }
      },
      geolocationOptions,
    )
  }

  const handleMapClick = async (lat: number, lng: number) => {
    setSearchResults([])
    
    // Ensure coordinates are within Sri Lanka bounds
    const clampedLat = Math.max(SRI_LANKA_BOUNDS.minLat, Math.min(SRI_LANKA_BOUNDS.maxLat, lat))
    const clampedLng = Math.max(SRI_LANKA_BOUNDS.minLng, Math.min(SRI_LANKA_BOUNDS.maxLng, lng))
    
    const address = await reverseGeocode(clampedLat, clampedLng)
    onChange({
      lat: clampedLat,
      lng: clampedLng,
      address: address,
    })
  }

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      // Sri Lanka bounding box: West, South, East, North
      const sriLankaBounds = "79.7,5.9,81.9,9.8"
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&viewbox=${sriLankaBounds}&bounded=1&countrycodes=lk`,
        { signal: controller.signal }
      )
      clearTimeout(timeoutId)

      if (!response.ok) throw new Error("Search failed")
      const data = await response.json()
      
      if (isMountedRef.current) {
        setSearchResults(
          data.map((item: any) => ({
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            display_name: item.display_name,
          }))
        )
      }
    } catch (error) {
      if (isMountedRef.current) {
        setError("Search failed. Please try again.")
        setSearchResults([])
      }
    } finally {
      if (isMountedRef.current) {
        setIsSearching(false)
      }
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
      }, 300) // Reduced from 500ms for faster search
    } else {
      setSearchResults([])
    }
  }

  const handleSelectSearchResult = async (result: { lat: number; lng: number; display_name: string }) => {
    // Ensure coordinates are within Sri Lanka bounds
    const clampedLat = Math.max(SRI_LANKA_BOUNDS.minLat, Math.min(SRI_LANKA_BOUNDS.maxLat, result.lat))
    const clampedLng = Math.max(SRI_LANKA_BOUNDS.minLng, Math.min(SRI_LANKA_BOUNDS.maxLng, result.lng))
    
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
