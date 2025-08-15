"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, MapPin, Users } from "lucide-react"
import { useAppSelector } from "@/lib/hooks"

export function CountriesStats() {
  const { countries, filteredCountries, selectedRegion } = useAppSelector((state) => state.countries)

  const regionCounts = countries.reduce(
    (acc, country) => {
      acc[country.region] = (acc[country.region] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const totalCountries = countries.length
  const filteredCount = filteredCountries.length

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Countries</CardTitle>
          <Globe className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCountries}</div>
          <p className="text-xs text-muted-foreground">Countries worldwide</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Filter</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{filteredCount}</div>
          <p className="text-xs text-muted-foreground">
            {selectedRegion === "all" ? "All regions" : `In ${selectedRegion}`}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Largest Region</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Object.keys(regionCounts).length > 0 ? Math.max(...Object.values(regionCounts)) : 0}
          </div>
          <p className="text-xs text-muted-foreground">
            {Object.keys(regionCounts).length > 0
              ? Object.entries(regionCounts).find(
                  ([, count]) => count === Math.max(...Object.values(regionCounts)),
                )?.[0]
              : "Loading..."}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
