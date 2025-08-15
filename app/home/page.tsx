"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button, Spinner, Nav, Navbar, Offcanvas } from "react-bootstrap"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { fetchCountries, loadMore, setRegionFilter } from "@/lib/features/countries/countriesSlice"
import CountriesList from "@/components/countries-list"
import { ImageSlider } from "@/components/image-slider"
import { SocialIcons } from "@/components/social-icons"

export default function HomePage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { filteredCountries, loading, displayedCount, regionFilter } = useAppSelector((state) => state.countries)
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [selectedCountryIndex, setSelectedCountryIndex] = useState(0)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    dispatch(fetchCountries())
  }, [dispatch])

  const handleLoadMore = () => {
    dispatch(loadMore())
  }

  const handleRegionFilter = (region: string) => {
    dispatch(setRegionFilter(region === "All" ? "" : region))
    setShowMobileMenu(false)
  }

  const handleCountryClick = (index: number) => {
    setSelectedCountryIndex(index)
  }

  const displayedCountries = filteredCountries.slice(0, displayedCount);
  const hasMore = displayedCount < filteredCountries.length

  const sliderData =
    regionFilter === ""
      ? displayedCountries.map((country, index) => ({
          id: index.toString(),
          image: country.flag || "/placeholder.svg?height=300&width=600",
          title: country.name,
          description: `Explore ${country.name} in ${country.region}`,
        }))
      : displayedCountries.slice(0, 5).map((country, index) => ({
          id: index.toString(),
          image: country.flag || "/placeholder.svg?height=300&width=600",
          title: country.name,
          description: `Explore ${country.name} in ${country.region}`,
        }));

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="home-container">
      <Navbar expand={false} className="top-navigation">
        <Navbar.Brand className="countries-title">Countries</Navbar.Brand>

        {/* Desktop Navigation - hidden on mobile */}
        <div className="d-none d-md-block nav-right">
          <Nav variant="pills" className="region-filters">
            <Nav.Item>
              <Nav.Link active={regionFilter === ""} onClick={() => handleRegionFilter("All")} className="filter-link">
                All
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={regionFilter === "Asia"}
                onClick={() => handleRegionFilter("Asia")}
                className="filter-link"
              >
                Asia
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={regionFilter === "Europe"}
                onClick={() => handleRegionFilter("Europe")}
                className="filter-link"
              >
                Europe
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>

        {/* Mobile Menu Toggle - only visible on mobile */}
        <Navbar.Toggle aria-controls="mobile-menu" className="d-md-none" onClick={() => setShowMobileMenu(true)} />

        {/* Mobile Offcanvas Menu */}
        <Offcanvas show={showMobileMenu} onHide={() => setShowMobileMenu(false)} placement="end" id="mobile-menu">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Filters</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column">
              <Nav.Link
                active={regionFilter === ""}
                onClick={() => handleRegionFilter("All")}
                className="mobile-filter-link"
              >
                All
              </Nav.Link>
              <Nav.Link
                active={regionFilter === "Asia"}
                onClick={() => handleRegionFilter("Asia")}
                className="mobile-filter-link"
              >
                Asia
              </Nav.Link>
              <Nav.Link
                active={regionFilter === "Europe"}
                onClick={() => handleRegionFilter("Europe")}
                className="mobile-filter-link"
              >
                Europe
              </Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>
      </Navbar>

      <h1 className="welcome-header">WELCOME</h1>

      <div className="slider-section">
        <div className="slider-main">
          <ImageSlider slides={sliderData} selectedIndex={selectedCountryIndex} />
        </div>
        <div className="slider-side">
          <img
            src={
              displayedCountries[selectedCountryIndex]?.flag ||
              "/placeholder.svg?height=300&width=200&query=country flag"
            }
            alt="Selected country"
            className="side-image"
          />
        </div>
      </div>

      <CountriesList countries={displayedCountries} loading={loading} onCountryClick={handleCountryClick} />

      {hasMore && (
        <div className="text-center mb-5">
          <Button className="load-more-btn" onClick={handleLoadMore} disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Loading...
              </>
            ) : (
              "Load more"
            )}
          </Button>
        </div>
      )}

      {/* <div className="pagination-dots">
        {[1, 2, 3, 4].map((dot, index) => (
          <div key={index} className={`pagination-dot ${index === 0 ? "active" : ""}`} />
        ))}
      </div> */}

    
      <SocialIcons />

      <div className="contact-info">Example@email.com</div>
      <div className="copyright">Copyright © 2019 Name. All rights reserved.</div>
    </div>
  )
}
