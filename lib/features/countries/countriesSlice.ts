import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

export interface Country {
  name: string
  region: string
  flag: string
}

interface CountriesState {
  countries: Country[]
  filteredCountries: Country[]
  loading: boolean
  error: string | null
  selectedRegion: string
  displayedCount: number
  itemsPerPage: number
}

const initialState: CountriesState = {
  countries: [],
  filteredCountries: [],
  loading: false,
  error: null,
  selectedRegion: "all",
  displayedCount: 12,
  itemsPerPage: 12,
}

export const fetchCountries = createAsyncThunk("countries/fetchCountries", async () => {
  const response = await fetch("https://restcountries.com/v2/all?fields=name,region,flag")
  if (!response.ok) {
    throw new Error("Failed to fetch countries")
  }
  return response.json()
})

const countriesSlice = createSlice({
  name: "countries",
  initialState,
  reducers: {
    setRegionFilter: (state, action: PayloadAction<string>) => {
      state.selectedRegion = action.payload
      state.displayedCount = state.itemsPerPage

      if (action.payload === "all") {
        state.filteredCountries = state.countries
      } else {
        state.filteredCountries = state.countries.filter((country) => {
          const countryRegion = country.region?.toLowerCase().trim()
          const selectedRegion = action.payload.toLowerCase().trim()

          if (selectedRegion === "americas") {
            return countryRegion === "americas" || countryRegion === "america"
          }

          return countryRegion === selectedRegion
        })
      }
    },
    loadMore: (state) => {
      const remainingItems = state.filteredCountries.length - state.displayedCount
      const itemsToAdd = Math.min(state.itemsPerPage, remainingItems)
      state.displayedCount += itemsToAdd
    },
    resetDisplayCount: (state) => {
      state.displayedCount = state.itemsPerPage
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload
      // Maintain at least the current display count or the new items per page, whichever is larger
      state.displayedCount = Math.max(state.displayedCount, action.payload)
    },
    clearAllFilters: (state) => {
      state.selectedRegion = "all"
      state.filteredCountries = state.countries
      state.displayedCount = state.itemsPerPage
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loading = false
        state.countries = action.payload.sort((a: Country, b: Country) => a.name.localeCompare(b.name))
        state.filteredCountries = state.countries
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch countries"
      })
  },
})

export const { setRegionFilter, loadMore, resetDisplayCount, setItemsPerPage, clearAllFilters } = countriesSlice.actions
export default countriesSlice.reducer
