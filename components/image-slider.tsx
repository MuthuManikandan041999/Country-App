"use client"

import { useState, useEffect } from "react"

interface SlideData {
  id: string
  image: string
  title: string
  description: string
}

interface ImageSliderProps {
  slides: SlideData[]
  autoPlay?: boolean
  autoPlayInterval?: number
  selectedIndex?: number
}

export function ImageSlider({ slides, autoPlay = true, autoPlayInterval = 5000, selectedIndex }: ImageSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, slides.length])

  useEffect(() => {
    if (selectedIndex !== undefined && selectedIndex < slides.length) {
      setCurrentSlide(selectedIndex)
    }
  }, [selectedIndex, slides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  if (slides.length === 0) {
    return (
      <div className="slider-container">
        <div
          style={{
            height: "300px",
            background: "#f8f9fa",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p style={{ color: "#666" }}>No slides available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="slider-container">
      <div style={{ position: "relative", height: "300px", overflow: "hidden", borderRadius: "8px" }}>
        {slides.map((slide, index) => (
          <img
            key={slide.id}
            src={slide.image || "/placeholder.svg"}
            alt={slide.title}
            className="slider-image"
            style={{
              display: index === currentSlide ? "block" : "none",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ))}

        {slides.length > 1 && (
          <>
            <button className="slider-nav prev" onClick={goToPrevious}>
              &#8249;
            </button>
            <button className="slider-nav next" onClick={goToNext}>
              &#8250;
            </button>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div className="slider-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`slider-dot ${index === currentSlide ? "active" : ""}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
