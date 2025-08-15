"use client"

import { Spinner } from "react-bootstrap"

interface Country {
  name: string
  region: string
  flag: string
}

interface CountriesListProps {
  countries: Country[]
  loading: boolean
  onCountryClick?: (index: number) => void
}

export default function CountriesList({ countries, loading, onCountryClick }: CountriesListProps) {
  if (loading && countries.length === 0) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    )
  }

  return (
    <div className="countries-grid-two-column">
      {countries.map((country, index) => (
        <div
          key={index}
          className="country-card-bordered"
          onClick={() => onCountryClick?.(index)}
          style={{ cursor: "pointer" }}
        >
          <div className="country-flag-container">
            <img
              src={country.flag || "/placeholder.svg?height=32&width=48&query=flag"}
              alt={`${country.name} flag`}
              className="country-flag-small"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=32&width=48"
              }}
            />
          </div>
          <div className="country-details">
            <h6 className="country-name">{country.name}</h6>
            <small className="country-region">{country.region}</small>
          </div>
        </div>
      ))}
    </div>
  )
}
