"use client"

import { useEffect, useState } from "react"
import { ImageSlider } from "./image-slider"
import { useAppSelector } from "@/lib/hooks"

interface SlideData {
  id: string
  image: string
  title: string
  description: string
}

export function FeaturedCountriesSlider() {
  const { countries } = useAppSelector((state) => state.countries)
  const [featuredSlides, setFeaturedSlides] = useState<SlideData[]>([])

  useEffect(() => {
    if (countries.length > 0) {
      // Create featured slides from countries data
      const featured = [
        {
          id: "welcome",
          image: "/placeholder.svg?height=400&width=800",
          title: "Explore the World",
          description: "Discover countries from every continent and learn about their unique cultures and regions.",
        },
        {
          id: "africa",
          image: "/placeholder.svg?height=400&width=800",
          title: "African Nations",
          description: `Explore ${countries.filter((c) => c.region === "Africa").length} countries across the diverse African continent.`,
        },
        {
          id: "europe",
          image: "/placeholder.svg?height=400&width=800",
          title: "European Countries",
          description: `Discover ${countries.filter((c) => c.region === "Europe").length} European nations with rich histories and cultures.`,
        },
        {
          id: "asia",
          image: "/placeholder.svg?height=400&width=800",
          title: "Asian Heritage",
          description: `Journey through ${countries.filter((c) => c.region === "Asia").length} Asian countries spanning diverse landscapes and traditions.`,
        },
        {
          id: "americas",
          image: "/placeholder.svg?height=400&width=800",
          title: "The Americas",
          description: `From North to South America, explore ${countries.filter((c) => c.region === "Americas").length} countries across the New World.`,
        },
      ]

      setFeaturedSlides(featured)
    }
  }, [countries])

  if (featuredSlides.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center animate-pulse">
        <p className="text-gray-500">Loading featured countries...</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Featured Regions</h2>
        <p className="text-gray-600">Discover countries from around the world</p>
      </div>
      <ImageSlider slides={featuredSlides} autoPlay={true} autoPlayInterval={4000} />
    </div>
  )
}
