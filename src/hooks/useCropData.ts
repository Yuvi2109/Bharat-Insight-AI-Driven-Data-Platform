import { useState, useEffect, useCallback } from 'react'
import Papa from 'papaparse'

// The structure of our crop data
export interface CropData {
  State: string
  District: string
  Crop: string
  Year: string
  Season: string
  Area: string
  Production: string
  Yield: string
}

const DATA_URL = 'https://raw.githubusercontent.com/AbhishekKandoi/Crop-Yield-Prediction-based-on-Indian-Agriculture/main/Crop%20Prediction%20dataset.csv'

export function useCropData() {
  const [data, setData] = useState<CropData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // This function fetches and parses the CSV data
  const loadData = useCallback(() => {
    setIsLoading(true)
    setError(null)

    Papa.parse(DATA_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Map the raw CSV rows to our CropData format
        const mapped: CropData[] = results.data
          .filter((row: any) => row.State_Name && row.District_Name)
          .map((row: any) => ({
            State: row.State_Name,
            District: row.District_Name,
            Crop: row.Crop,
            Year: row.Crop_Year,
            Season: row.Season?.trim(),
            Area: row.Area,
            Production: row.Production,
            // Calculate yield: Production divided by Area
            Yield: (parseFloat(row.Production) / parseFloat(row.Area) || 0).toFixed(2)
          }))
        
        setData(mapped)
        setIsLoading(false)
      },
      error: (err) => {
        console.error("Error parsing CSV:", err)
        setError("Could not load data. Please try again later.")
        setIsLoading(false)
      }
    })
  }, [])

  // Load data when the hook is first used
  useEffect(() => {
    loadData()
  }, [loadData])

  // Function to download data as CSV
  const downloadCSV = (dataToDownload: CropData[]) => {
    const csvString = Papa.unparse(dataToDownload)
    const blob = new Blob([csvString], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'crop-data-export.csv'
    link.click()
  }

  // Function to download data as JSON
  const downloadJSON = (dataToDownload: CropData[]) => {
    const jsonString = JSON.stringify(dataToDownload, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'crop-data-export.json'
    link.click()
  }

  return { data, isLoading, error, refresh: loadData, downloadCSV, downloadJSON }
}
