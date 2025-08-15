"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Filter } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { setRegionFilter, resetDisplayCount } from "@/lib/features/countries/countriesSlice"

const regions = [
  { value: "all", label: "All Regions", icon: "🌍" },
  { value: "Africa", label: "Africa", icon: "🌍" },
  { value: "Americas", label: "Americas", icon: "🌎" },
  { value: "Asia", label: "Asia", icon: "🌏" },
  { value: "Europe", label: "Europe", icon: "🇪🇺" },
  { value: "Oceania", label: "Oceania", icon: "🏝️" },
  { value: "Polar", label: "Polar", icon: "🧊" },
]

export function RegionFilter() {
  const dispatch = useAppDispatch()
  const { selectedRegion, filteredCountries, countries } = useAppSelector((state) => state.countries)

  const handleRegionChange = (value: string) => {
    dispatch(setRegionFilter(value))
    dispatch(resetDisplayCount())
  }

  const clearFilter = () => {
    dispatch(setRegionFilter("all"))
    dispatch(resetDisplayCount())
  }

  const regionStats = countries.reduce(
    (acc, country) => {
      acc[country.region] = (acc[country.region] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const selectedRegionData = regions.find((region) => region.value === selectedRegion)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Filter by Continent</h3>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="region-select" className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Select Region:
          </label>
          <Select value={selectedRegion} onValueChange={handleRegionChange}>
            <SelectTrigger id="region-select" className="w-48">
              <SelectValue placeholder="Select a region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region.value} value={region.value}>
                  <div className="flex items-center gap-2">
                    <span>{region.label}</span>
                    {region.value !== "all" && regionStats[region.value] && (
                      <Badge variant="secondary" className="text-xs">
                        {regionStats[region.value]}
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedRegion !== "all" && (
          <div className="flex items-center gap-2">
            <Badge variant="default" className="flex items-center gap-1">
              {selectedRegionData?.label}
              <Button variant="ghost" size="sm" className="h-4 w-4 p-0 hover:bg-transparent" onClick={clearFilter}>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">{filteredCountries.length}</span>{" "}
            {filteredCountries.length === 1 ? "country" : "countries"} found
            {selectedRegion !== "all" && (
              <span className="ml-1">
                in <span className="font-medium">{selectedRegionData?.label}</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {["Africa", "Americas", "Asia", "Europe"].map((region) => (
            <Button
              key={region}
              variant={selectedRegion === region ? "default" : "outline"}
              size="sm"
              onClick={() => handleRegionChange(region)}
              className="text-xs"
            >
              {region}
              <Badge variant="secondary" className="ml-1 text-xs">
                {regionStats[region] || 0}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {filteredCountries.length === 0 && countries.length > 0 && (
        <div className="text-center py-4 text-amber-600 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-sm">
            No countries found in <strong>{selectedRegionData?.label}</strong>. Try selecting a different region.
          </p>
        </div>
      )}
    </div>
  )
}
