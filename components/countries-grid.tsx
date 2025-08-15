"use client"

import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, MapPin } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchCountries } from "@/lib/features/countries/countriesSlice"
import { PaginationControls } from "./pagination-controls"

export function CountriesGrid() {
  const dispatch = useAppDispatch()
  const { filteredCountries, loading, error, displayedCount, selectedRegion } = useAppSelector(
    (state) => state.countries,
  )

  useEffect(() => {
    dispatch(fetchCountries())
  }, [dispatch])

  const displayedCountries = filteredCountries.slice(0, displayedCount)

  if (loading && filteredCountries.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg text-gray-600">Loading countries...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium mb-2">Error loading countries</div>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => dispatch(fetchCountries())} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  if (filteredCountries.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <div className="text-gray-600 text-lg mb-2">No countries found</div>
        <p className="text-gray-500">
          {selectedRegion !== "all"
            ? `No countries found in ${selectedRegion}. Try selecting a different region.`
            : "No countries available at the moment."}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {selectedRegion === "all" ? "All Countries" : `Countries in ${selectedRegion}`}
        </h3>
        <div className="text-sm text-gray-500">
          {displayedCountries.length} of {filteredCountries.length} shown
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedCountries.map((country, index) => (
          <Card
            key={`${country.name}-${index}`}
            data-country-index={index}
            className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
          >
            <div className="aspect-video relative bg-gray-100">
              <img
                src={country.flag || "/placeholder.svg"}
                alt={`Flag of ${country.name}`}
                className="w-full h-full object-cover"
                loading={index < 12 ? "eager" : "lazy"}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = `/placeholder.svg?height=200&width=300&query=flag+of+${encodeURIComponent(country.name)}`
                }}
              />
              <div className="absolute inset-0 bg-gray-200 animate-pulse opacity-0 transition-opacity duration-200" />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1" title={country.name}>
                {country.name}
              </h3>
              <Badge variant="secondary" className="text-sm">
                {country.region}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <PaginationControls />
    </div>
  )
}
