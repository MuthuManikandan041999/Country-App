"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronUp, MoreHorizontal } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { loadMore } from "@/lib/features/countries/countriesSlice"

const itemsPerPageOptions = [
  { value: 12, label: "12 per page" },
  { value: 24, label: "24 per page" },
  { value: 36, label: "36 per page" },
  { value: 48, label: "48 per page" },
]

export function PaginationControls() {
  const dispatch = useAppDispatch()
  const { filteredCountries, displayedCount, itemsPerPage, loading } = useAppSelector((state) => state.countries)

  const handleLoadMore = () => {
    dispatch(loadMore())
    // Smooth scroll to the new content
    setTimeout(() => {
      const newItemsStart = document.querySelector(`[data-country-index="${displayedCount}"]`)
      if (newItemsStart) {
        newItemsStart.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 100)
  }

  const handleItemsPerPageChange = (value: string) => {
    // This would require updating the Redux slice to handle items per page changes
    // For now, we'll just reset and show more items
    const newItemsPerPage = Number.parseInt(value)
    const currentlyShown = Math.min(displayedCount, filteredCountries.length)
    const newDisplayCount = Math.max(currentlyShown, newItemsPerPage)

    // We would dispatch an action to update itemsPerPage and displayedCount
    // dispatch(setItemsPerPage(newItemsPerPage))
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const hasMore = displayedCount < filteredCountries.length
  const totalPages = Math.ceil(filteredCountries.length / itemsPerPage)
  const currentPage = Math.ceil(displayedCount / itemsPerPage)

  if (filteredCountries.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Load More Button */}
      {hasMore && (
        <div className="text-center">
          <Button
            onClick={handleLoadMore}
            variant="outline"
            size="lg"
            disabled={loading}
            className="min-w-[200px] bg-transparent"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                Loading more...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <MoreHorizontal className="h-4 w-4" />
                Load More Countries
              </div>
            )}
          </Button>
        </div>
      )}

      {/* Pagination Info and Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg border">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>
            Showing{" "}
            <span className="font-medium text-gray-900">{Math.min(displayedCount, filteredCountries.length)}</span> of{" "}
            <span className="font-medium text-gray-900">{filteredCountries.length}</span> countries
          </span>
          {totalPages > 1 && (
            <span className="hidden sm:inline">
              (Page {currentPage} of {totalPages})
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Items per page selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">Show:</span>
            <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {itemsPerPageOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Scroll to top button */}
          {displayedCount > itemsPerPage && (
            <Button onClick={scrollToTop} variant="outline" size="sm">
              <ChevronUp className="h-4 w-4 mr-1" />
              Top
            </Button>
          )}
        </div>
      </div>

      {/* Progress indicator */}
      {filteredCountries.length > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${Math.min((displayedCount / filteredCountries.length) * 100, 100)}%`,
            }}
          />
        </div>
      )}
    </div>
  )
}
